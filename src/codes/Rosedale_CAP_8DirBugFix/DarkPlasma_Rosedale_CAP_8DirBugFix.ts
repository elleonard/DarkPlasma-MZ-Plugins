/// <reference path="./Rosedale_CAP_8DirBugFix.d.ts" />

function DataManager_CAP_BugFixMixIn(dataManager: typeof DataManager) {
  dataManager.characterNameToActor = function (characterName) {
    return $dataActors.find(dataActor => dataActor && dataActor.characterName === characterName);
  };

  const _makeSavefileInfo = dataManager.makeSavefileInfo;
  dataManager.makeSavefileInfo = function () {
    const info = _makeSavefileInfo.call(this);
    /**
     * セーブ・ロード画面に歩行グラフィックを表示するため、アクターIDを控えておく
     */
    info.partyMembers = $gameParty.allMembers().map(actor => actor.actorId());
    return info;
  };
}

DataManager_CAP_BugFixMixIn(DataManager);

function Game_Actor_CAP_BugFixMixIn(gameActor: Game_Actor) {
  gameActor.maxCharacterPattern = function () {
    return ImageManager.isBigCharacter(this.characterName()) ? 3 : 12;
  };

  gameActor.defaultCharacterPattern = function () {
    return 1;
  };

  gameActor.characterPatternYCount = function () {
    return ImageManager.isBigCharacter(this.characterName()) ? 8 : 16;
  };
}

Game_Actor_CAP_BugFixMixIn(Game_Actor.prototype);

function Window_CAP_BugFixMixIn(windowClass: Window_Base) {
  windowClass.drawActorCharacterWith8Dir = function (actor, x, y) {
    const bitmap = ImageManager.loadCharacter(actor.characterName());
    const big = ImageManager.isBigCharacter(actor.characterName());
    const pw = bitmap.width / actor.maxCharacterPattern();
    const ph = bitmap.height / actor.characterPatternYCount();
    const n = big ? 0 : actor.characterIndex();
    const sx = ((n % 4) * 3 + actor.defaultCharacterPattern()) * pw;
    const sy = (Math.floor(n / 4) * 4 + 1) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
  };
}

Window_CAP_BugFixMixIn(Window_Base.prototype);

function Window_StatusBase_CAP_BugFixMixIn(windowClass: Window_StatusBase) {
  const _drawActorCharacter = windowClass.drawActorCharacter;
  windowClass.drawActorCharacter = function (actor, x, y) {
    if (actor.actor().meta['8dir']) {
      this.drawActorCharacterWith8Dir(actor, x, y);
    } else {
      _drawActorCharacter.call(this, actor, x, y);
    }
  };
}

Window_StatusBase_CAP_BugFixMixIn(Window_StatusBase.prototype);

function Window_SavefileList_CAP_BugFixMixIn(windowClass: Window_SavefileList) {
  windowClass.drawPartyCharacters = function (info, x, y) {
    if (info.characters) {
      let characterX = x;
      info.characters.forEach((data, index) => {
        if (info.partyMembers
          && info.partyMembers[index] !== undefined
          && $dataActors[info.partyMembers[index]]?.meta['8dir']
        ) {
          const dataActor = $dataActors[info.partyMembers[index]];
          const actor = new Game_Actor(dataActor.id);
          actor.setCharacterImage(data[0], data[1]);
          this.drawActorCharacterWith8Dir(actor, characterX, y);
        } else {
          this.drawCharacter(data[0], data[1], characterX, y);
        }
        characterX += 48;
      });
    }
  };
}

Window_SavefileList_CAP_BugFixMixIn(Window_SavefileList.prototype);
