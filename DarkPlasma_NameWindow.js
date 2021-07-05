// DarkPlasma_NameWindow 2.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
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
 * @type number
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
 * version: 2.0.2
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
 * @type string
 * @default 6
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    defaultTextColor: Number(pluginParameters.defaultTextColor || 6),
    actorColors: JSON.parse(pluginParameters.actorColors || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          actor: Number(parsed.actor || 0),
          color: String(parsed.color || '6'),
        };
      })(e || '{}');
    }),
    autoNameWindow: String(pluginParameters.autoNameWindow || false) === 'true',
    forceAutoNameColor: String(pluginParameters.forceAutoNameColor || true) === 'true',
  };

  Window_Message.prototype.convertEscapeCharacters = function (text) {
    text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
    return this.convertNameWindow(text);
  };

  /**
   * 指定したテキストの中から名前ウィンドウにすべき箇所を探す
   */
  Window_Message.prototype.findNameWindowTextInfo = function (text) {
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
      name = hit.isActorId ? this.actorName(hit.idOrName[1]) : hit.idOrName[1];
      return {
        name: ColorManager.colorEscapedName(name),
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
            return ColorManager.colorEscapedName(speakerName);
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

  Window_Message.prototype.convertNameWindow = function (text) {
    const nameWindowTextInfo = this.findNameWindowTextInfo(text);
    if (nameWindowTextInfo) {
      text = text.replace(nameWindowTextInfo.eraseTarget, '');
      $gameMessage.setSpeakerName(nameWindowTextInfo.name);
    }
    return text;
  };

  /**
   * アクター名から名前の色を返す
   * @param {string} name アクター名
   * @return {string|number}
   */
  ColorManager.colorByName = function (name) {
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
   * 色付けエスケープ文字を加えた名前
   * @param {string} name 名前
   * @return {string}
   */
  ColorManager.colorEscapedName = function (name) {
    return name
      ? name.replace(new RegExp(`^${name}$`, 'gi'), `\\C[${ColorManager.colorByName(name)}]${name}\\C[0]`)
      : null;
  };

  /**
   * アクター名からアクターを取得する
   * @param {string} name アクター名
   * @return {Game_Actor}
   */
  Game_Actors.prototype.byName = function (name) {
    const actor = $dataActors.find((actor) => actor && actor.name === name);
    if (actor) {
      if (!this._data[actor.id]) {
        this._data[actor.id] = new Game_Actor(actor.id);
      }
      return this._data[actor.id];
    }
    return null;
  };

  const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
  Game_Message.prototype.setSpeakerName = function (speakerName) {
    if (!/\\C[#?0-9+]*/gi.test(speakerName)) {
      _Game_Message_setSpeakerName.call(this, ColorManager.colorEscapedName(speakerName));
    } else {
      _Game_Message_setSpeakerName.call(this, speakerName);
    }
  };
})();
