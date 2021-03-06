import { settings } from './_build/DarkPlasma_NameWindow_parameters';

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
