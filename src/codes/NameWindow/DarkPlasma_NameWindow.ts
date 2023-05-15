/// <reference path="./NameWindow.d.ts" />

import { settings } from './_build/DarkPlasma_NameWindow_parameters';

function ColorManager_NameWindowMixIn(colorManager: typeof ColorManager) {
  /**
   * アクター名から名前の色を返す
   */
  colorManager.colorByName = function (name: string): string | number {
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
  colorManager.coloredName = function (name: string): string {
    return name
      ? name.replace(new RegExp(`^${name}$`, 'gi'), `\\C[${ColorManager.colorByName(name)}]${name}\\C[0]`)
      : '';
  };
}

ColorManager_NameWindowMixIn(ColorManager);

function Game_Actors_NameWindowMixIn(gameActors: Game_Actors) {
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

function Game_Message_NameWindowMixIn(gameMessage: Game_Message) {
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

function Window_Message_NameWindowMixIn(windowClass: Window_Message) {
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
      const name = hit.isActorId ? this.actorName(Number(hit.idOrName![1])) : hit.idOrName![1];
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
