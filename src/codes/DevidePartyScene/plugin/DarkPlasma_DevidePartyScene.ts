/// <reference path="./DevidePartyScene.d.ts" />

import { settings } from '../config/_build/DarkPlasma_DevidePartyScene_parameters';

class Scene_DevideParty extends Scene_Base {
  _devidedParties: Game_DevidedParty[];
  _helpWindow: Window_Help | null = null;
  _cancelButton: Sprite_Button | null = null;

  public create(): void {
    super.create();
    this.createBackground();
    this.createWindowLayer();
    this.createButtons();
    this.createHelpWindow();
    /**
     * TODO: 待機メンバーと分割パーティウィンドウを作る
     */
  }

  createBackground() {

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

  helpWindowText() {
    return "";
  }

  helpWindowRect() {
      if (settings.showHelpWindow) {
        const width = ConfigManager.touchUI
          ? Graphics.boxWidth -
          this.cancelButtonWidth() - 8
          : Graphics.boxWidth;
        return new Rectangle(0, 0, width, this.calcWindowHeight(1, false));
      } else {
        return new Rectangle(0, 0, 0, 0);
      }
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
  _activateAnotherWindow: () => void;

  _statusWindow: Window_DevidePartyStatus | null = null;
  _statusParamsWindow: Window_StatusParams | null = null;
  _equipWindow: Window_StatusEquip | null = null;

  setActivateAnotherWindow(func: () => void) {
    this._activateAnotherWindow = func;
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

}

class Window_DevidedParty extends Window_DevidePartyMember {

}
