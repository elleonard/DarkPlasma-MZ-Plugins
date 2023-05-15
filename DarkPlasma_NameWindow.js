// DarkPlasma_NameWindow 2.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/15 2.0.3 プラグインパラメータの型を変更
 *                  typescript移行
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
 * @plugindesc 会話イベント中に名前ウィンドウを表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param defaultTextColor
 * @desc 名前ウィンドウのデフォルト文字色
 * @text デフォルト文字色
 * @type color
 * @default 6
 *
 * @param actorColors
 * @desc アクターごとの名前の色を設定する
 * @text アクター色設定
 * @type struct<ActorColor>[]
 * @default []
 *
 * @param autoNameWindow
 * @desc 「及び（を検出して自動で名前ウィンドウを表示する
 * @text 自動名前ウィンドウ
 * @type boolean
 * @default false
 *
 * @param forceAutoNameColor
 * @desc 自動名前検出した名前の色をこのプラグインの設定に固定する（DarkPlasma_AutoHighlight等による変換を無視する）
 * @text 自動名前色強制
 * @type boolean
 * @default true
 *
 * @help
 * version: 2.0.3
 * メッセージテキストに以下のように記述すると名前ウィンドウを表示します。
 *
 * \n<***>
 *
 * また、以下のように入力するとIDに対応するアクター名を名前ウィンドウに表示します。
 *
 * \ndp<アクターID>
 */
/*~struct~ActorColor:
 * @param actor
 * @text アクター
 * @type actor
 *
 * @param color
 * @desc 名前の色。色番号
 * @text 名前の色
 * @type color
 * @default 6
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    defaultTextColor: pluginParameters.defaultTextColor?.startsWith('#')
      ? String(pluginParameters.defaultTextColor)
      : Number(pluginParameters.defaultTextColor || 6),
    actorColors: JSON.parse(pluginParameters.actorColors || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          actor: Number(parsed.actor || 0),
          color: parsed.color?.startsWith('#') ? String(parsed.color) : Number(parsed.color || 6),
        };
      })(e || '{}');
    }),
    autoNameWindow: String(pluginParameters.autoNameWindow || false) === 'true',
    forceAutoNameColor: String(pluginParameters.forceAutoNameColor || true) === 'true',
  };

  function ColorManager_NameWindowMixIn(colorManager) {
    /**
     * アクター名から名前の色を返す
     */
    colorManager.colorByName = function (name) {
      const actor = $gameActors.byName(name);
      if (actor) {
        const colorSetting = settings.actorColors.find(
          (actorColor) => Number(actorColor.actor) === Number(actor.actorId())
        );
        return colorSetting ? colorSetting.color : settings.defaultTextColor;
      }
      return settings.defaultTextColor;
    };
    /**
     * 色付け制御文字を加えた名前
     */
    colorManager.coloredName = function (name) {
      return name
        ? name.replace(new RegExp(`^${name}$`, 'gi'), `\\C[${ColorManager.colorByName(name)}]${name}\\C[0]`)
        : '';
    };
  }
  ColorManager_NameWindowMixIn(ColorManager);
  function Game_Actors_NameWindowMixIn(gameActors) {
    /**
     * アクター名からアクターを取得する
     */
    gameActors.byName = function (name) {
      const actor = $dataActors.find((actor) => actor && actor.name === name);
      if (actor) {
        if (!this._data[actor.id]) {
          this._data[actor.id] = new Game_Actor(actor.id);
        }
        return this._data[actor.id];
      }
      return null;
    };
  }
  Game_Actors_NameWindowMixIn(Game_Actors.prototype);
  function Game_Message_NameWindowMixIn(gameMessage) {
    const _setSpeakerName = gameMessage.setSpeakerName;
    gameMessage.setSpeakerName = function (speakerName) {
      if (!/\\C[#?0-9+]*/gi.test(speakerName)) {
        _setSpeakerName.call(this, ColorManager.coloredName(speakerName));
      } else {
        _setSpeakerName.call(this, speakerName);
      }
    };
  }
  Game_Message_NameWindowMixIn(Game_Message.prototype);
  function Window_Message_NameWindowMixIn(windowClass) {
    windowClass.convertEscapeCharacters = function (text) {
      text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
      return this.convertNameWindow(text);
    };
    /**
     * 指定したテキストの中から名前ウィンドウにすべき箇所を探す
     */
    windowClass.findNameWindowTextInfo = function (text) {
      const regExpAndPositions = [
        {
          regExp: /\x1bN\<(.*?)\>/gi,
        },
        {
          regExp: /\x1bNDP\<(.*?)\>/gi,
          isActorId: true,
        },
      ];
      const hit = regExpAndPositions
        .map((regExpAndPosition) => {
          return {
            regExp: new RegExp(regExpAndPosition.regExp),
            idOrName: regExpAndPosition.regExp.exec(text),
            isActorId: regExpAndPosition.isActorId,
          };
        })
        .find((hit) => hit.idOrName && hit.idOrName[1]);
      if (hit) {
        const name = hit.isActorId ? this.actorName(Number(hit.idOrName[1])) : hit.idOrName[1];
        return {
          name: ColorManager.coloredName(name),
          eraseTarget: hit.regExp,
        };
      }
      if (settings.autoNameWindow) {
        // 名前＋開きカッコを見つけ次第、名前ウィンドウを設定する
        const speakerReg = new RegExp('^(.+)(「|（)', 'gi');
        const speaker = speakerReg.exec(text);
        if (speaker !== null) {
          let target = speaker[1].replace('\x1b}', '');
          const eraseTarget = target;
          if (settings.forceAutoNameColor) {
            target = target.replace(/\x1bC\[(#?[0-9]*)\]/gi, '');
          }
          const speakerNames = target.split('＆');
          const speakerNameString = speakerNames
            .map((speakerName) => {
              return ColorManager.coloredName(speakerName);
            }, this)
            .join('＆');
          if (target.length > 0) {
            return {
              name: speakerNameString,
              eraseTarget: eraseTarget,
            };
          }
        }
      }
      return null;
    };
    windowClass.convertNameWindow = function (text) {
      const nameWindowTextInfo = this.findNameWindowTextInfo(text);
      if (nameWindowTextInfo) {
        text = text.replace(nameWindowTextInfo.eraseTarget, '');
        $gameMessage.setSpeakerName(nameWindowTextInfo.name);
      }
      return text;
    };
  }
  Window_Message_NameWindowMixIn(Window_Message.prototype);
})();
