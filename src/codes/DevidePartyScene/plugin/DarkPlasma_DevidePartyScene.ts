/// <reference path="./DevidePartyScene.d.ts" />

import { settings } from '../config/_build/DarkPlasma_DevidePartyScene_parameters';

const WAITING_WINDOW_PADDING: number = 36;

class Scene_DevideParty extends Scene_Base {
  _devidedParties: Game_DevidedParty[];

  _backgroundSprite: Sprite;

  _helpWindow: Window_Help | null = null;
  _statusWindow: Window_DevidePartyStatus;
  _waitingMemberWindow: Window_DevidePartyWaitingMember;
  _devidedPartyWindows: Window_DevidedParty[];
  _cancelButton: Sprite_Button | null = null;

  public create(): void {
    super.create();
    this.createBackground();
    this.createWindowLayer();
    this.createButtons();
    this.createHelpWindow();
    this.createStatusWindow();
    this.createWaitingMemberWindow();
    this.createDevidedPartyWindows();
  }

  createBackground() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
  }

  createButtons() {
    if (ConfigManager.touchUI) {
      this._cancelButton = new Sprite_Button('cancel');
      this._cancelButton.x = Graphics.boxWidth - this.cancelButtonWidth() - 4;
      this._cancelButton.y = this.buttonY();
      this.addChild(this._cancelButton);
    }
  }

  cancelButtonWidth() {
    return this._cancelButton ? this._cancelButton.width : 0;
  }

  createHelpWindow() {
    this._helpWindow = new Window_Help(this.helpWindowRect());
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
  }

  createStatusWindow() {
    this._statusWindow = new Window_DevidePartyStatus(this.statusWindowRect());
    this.addWindow(this._statusWindow);
  }

  createWaitingMemberWindow() {
    this._waitingMemberWindow = new Window_DevidePartyWaitingMember(this.waitingMemberWindowRect());
    this._waitingMemberWindow.setCharacterSize(this.characterSize());
    /**
     * TODO: カーソル操作の定義
     */
    this.addWindow(this._waitingMemberWindow);
  }

  createDevidedPartyWindows() {
    this._devidedPartyWindows = [...Array($gameTemp.devidePartyCount()).keys()]
      .map(i => new Window_DevidedParty(this.devidedPartyWindowRect(i)));
    this._devidedPartyWindows.forEach(w => {
      w.setCharacterSize(this.characterSize());
      this.addWindow(w);
    });
  }

  helpWindowText() {
    return "";
  }

  helpWindowRect() {
    if (settings.showHelpWindow) {
      const width = ConfigManager.touchUI
        ? Graphics.boxWidth -
        this.cancelButtonWidth() - 8
        : Graphics.boxWidth;
      return new Rectangle(0, 0, width, this.helpAreaHeight());
    } else {
      return new Rectangle(0, 0, 0, 0);
    }
  }

  helpAreaHeight() {
    return this.calcWindowHeight(1, false);
  }

  statusWindowRect() {
    return new Rectangle(
      0,
      this.helpAreaHeight(),
      Graphics.boxWidth,
      this.calcWindowHeight(4, false)
    );
  }

  waitingMemberWindowRect() {
    return new Rectangle(
      0,
      this.helpAreaHeight() + this.statusWindowRect().height,
      Graphics.boxWidth,
      this.memberWindowHeight()
    );
  }

  memberWindowHeight(): number {
    const characterSize = this.characterSize();
    return characterSize.height > this.defaultCharacterSize().height
      ? characterSize.height + WAITING_WINDOW_PADDING
      : characterSize.height * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
  }


  devidedPartyWindowRect(index: number) {
    return new Rectangle(
      index * this.devidedPartyWindowWidth(),
      this.helpAreaHeight() + this.memberWindowHeight(),
      Graphics.boxWidth,
      this.memberWindowHeight()
    );
  }

  devidedPartyWindowWidth() {
    const characterSize = this.characterSize();
    const characterSpacing = Window_SelectActorCharacter.prototype.spacing();
    return characterSize.height > this.defaultCharacterSize().height
      ? (characterSize.width + characterSpacing) * $gameParty.maxBattleMembers()
      : (characterSize.width + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
  }

  commitDevidedPartiesAndExit() {
    $gameParty.devidePartyInto({
      parties: this._devidedParties,
      currentIndex: 0,
    });
    this.popScene();
  }

  canCommit() {
    return this._devidedParties.every(party => party.isValid());
  }
}

class Window_DevidePartyStatus extends Window_SkillStatus {
  loadFaceImages() {
    super.loadFaceImages();
    /**
     * 先頭の顔グラビットマップの読み込みが間に合わなかった時のため
     * ロード完了時にリフレッシュする
     */
    ImageManager.loadFace($gameParty.leader()!.faceName())
      .addLoadListener(() => this.refresh());
  }

  numVisibleRows() {
    return 4;
  }

  windowHeight() {
    return this.fittingHeight(this.numVisibleRows());
  }
}

class Window_DevidePartyMember extends Window_SelectActorCharacter {
  _characterSize: {
    width: number;
    height: number;
  };
  _statusWindow: Window_DevidePartyStatus | null = null;
  _statusParamsWindow: Window_StatusParams | null = null;
  _equipWindow: Window_StatusEquip | null = null;

  setCharacterSize(size: {width: number, height: number}) {
    this._characterSize = size;
  }

  setStatusWindow(statusWindow: Window_DevidePartyStatus) {
    this._statusWindow = statusWindow;
  }

  setStatusParamsWindow(statusParamsWindow: Window_StatusParams) {
    this._statusParamsWindow = statusParamsWindow;
  }

  setEquipWindow(equipWindow: Window_StatusEquip) {
    this._equipWindow = equipWindow;
  }

  members(): Game_Actor[] {
    return [];
  }

  select(index: number) {
    super.select(index);
    const actor = this.actor();
    if (actor) {
      if (this._statusWindow) {
        this._statusWindow.setActor(actor);
      }
      if (this._statusParamsWindow) {
        this._statusParamsWindow.setActor(actor);
      }
      if (this._equipWindow) {
        this._equipWindow.setActor(actor);
      }
    }
  }

  processCancelEnabled() {
    if (this.pendingIndex() >= 0) {
      return true;
    }
    if ($gameParty.forwardMembersAreAllDead) {
      return !$gameParty.forwardMembersAreAllDead();
    }
    return !$gameParty.isAllDead();
  }
}

class Window_DevidePartyWaitingMember extends Window_DevidePartyMember {
  _actors: Game_Actor[];
  _devidedPartyWindows: Window_DevidedParty[];

  setDevidedPartyWindows(windows: Window_DevidedParty[]) {
    this._devidedPartyWindows = windows;
  }

  activationTargetWindow(): Window_DevidedParty {
    const cursorX = this.x + this.itemRect(this.index()).x;
    const targetWindowIndex = this._devidedPartyWindows.findIndex(devidedPartyWindow => devidedPartyWindow.x > cursorX) - 1;
    return targetWindowIndex < 0 ? this._devidedPartyWindows[0] : this._devidedPartyWindows[targetWindowIndex];
  }

  activateDevidedPartyWindow() {
    const target = this.activationTargetWindow();
    this.deactivate();
    target.activate();
  }

  maxCols() {
    return Math.floor(this.innerWidth / (this._characterSize.width + this.spacing()));
  }

  members() {
    return this._actors;
  }

  public cursorDown(wrap?: boolean | undefined): void {
    if (this.index() >= this.maxCols()) {
      this.activateDevidedPartyWindow();
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorDown(wrap);
    }
  }
}

class Window_DevidedParty extends Window_DevidePartyMember {
  _actors: Game_Actor[];

  /**
   * TODO: カーソル操作を定義する
   */

  members() {
    return this._actors;
  }
}
