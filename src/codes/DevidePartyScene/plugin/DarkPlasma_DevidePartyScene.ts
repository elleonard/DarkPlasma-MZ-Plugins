/// <reference path="./DevidePartyScene.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { settings } from '../config/_build/DarkPlasma_DevidePartyScene_parameters';
import { command_open, parseArgs_open } from '../config/_build/DarkPlasma_DevidePartyScene_commands';

const WAITING_WINDOW_PADDING: number = 36;

PluginManager.registerCommand(pluginName, command_open, function (args) {
  const parsedArgs = parseArgs_open(args);
  const locations: Game_DevidedPartyPosition[] = parsedArgs.locations.map(l => {
    return {
      ...l,
      direction: 2,
    };
  });
  $gameTemp.setDevidePartyInfo(parsedArgs.count, locations);
  SceneManager.push(Scene_DevideParty);
});

function Game_Temp_DevidePartySceneMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._devidePartyInfo = undefined;
  };

  gameTemp.devidePartyInfo = function () {
    return this._devidePartyInfo;
  };

  gameTemp.setDevidePartyInfo = function (count, locations) {
    this._devidePartyInfo = {
      count,
      locations,
    };
  };

  gameTemp.devidePartyCount = function () {
    return this._devidePartyInfo?.count || 2;
  };

  gameTemp.devidePartyLocation = function (index) {
    return this._devidePartyInfo?.locations[index] || {
      mapId: 1,
      x: 0,
      y: 0,
      direction: 2,
    };
  };
}

Game_Temp_DevidePartySceneMixIn(Game_Temp.prototype);

class Scene_DevideParty extends Scene_Base {
  _devidedParties: Game_DevidedParty[];
  _waitingMembers: Game_DevidedParty;

  _backgroundSprite: Sprite;

  _helpWindow: Window_Help | null = null;
  _statusWindow: Window_DevidePartyStatus;
  _waitingMemberWindow: Window_DevidePartyWaitingMember;
  _devidedPartyWindows: Window_DevidedParty[];
  _pendingWindow: Window_DevidePartyMember | undefined;
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
    this._backgroundSprite.filters = [new PIXI.filters.BlurFilter()];
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
    this._waitingMemberWindow.setHandler('ok', () => this.onSelectActor(this._waitingMemberWindow));
    this._waitingMemberWindow.setHandler('cancel', () => this.onCancel(this._waitingMemberWindow));
    this._waitingMemberWindow.setStatusWindow(this._statusWindow);
    this._waitingMemberWindow.setParty(this.waitingMembers());
    this._waitingMemberWindow.refresh();
    this.addWindow(this._waitingMemberWindow);
  }

  createDevidedPartyWindows() {
    this._devidedParties = [...Array($gameTemp.devidePartyCount()).keys()].map(_ => new Game_DevidedParty());
    this._devidedPartyWindows = [...Array($gameTemp.devidePartyCount()).keys()]
      .map(i => new Window_DevidedParty(this.devidedPartyWindowRect(i)));
    this._devidedPartyWindows.forEach((w, index) => {
      w.setHandler('ok', () => this.onSelectActor(w));
      w.setHandler('cancel', () => this.onCancel(w));
      w.setWaitingMemberWindow(this._waitingMemberWindow);
      w.setStatusWindow(this._statusWindow);
      w.setPreviousWindow(this._devidedPartyWindows[(index + this._devidedPartyWindows.length - 1) % this._devidedPartyWindows.length]);
      w.setNextWindow(this._devidedPartyWindows[(index + 1) % this._devidedPartyWindows.length]);
      w.setParty(this._devidedParties[index]);
      this.addWindow(w);
    });
    this._waitingMemberWindow.setDevidedPartyWindows(this._devidedPartyWindows);
  }

  public start(): void {
    super.start();
    this._waitingMemberWindow.activate();
    this._waitingMemberWindow.select(0);
  }

  helpWindowText() {
    return settings.helpText;
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
    return this.useTallCharacter()
      ? characterSize.height + WAITING_WINDOW_PADDING
      : characterSize.height * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
  }

  devidedPartyWindowRect(index: number) {
    return new Rectangle(
      index * this.devidedPartyWindowWidth(),
      this.helpAreaHeight() + this.statusWindowRect().height + this.memberWindowHeight(),
      this.devidedPartyWindowWidth(),
      this.memberWindowHeight()
    );
  }

  devidedPartyWindowWidth() {
    const characterSize = this.characterSize();
    const characterSpacing = Window_SelectActorCharacter.prototype.spacing();
    return this.useTallCharacter()
      ? (characterSize.width + characterSpacing) * $gameParty.maxBattleMembers()
      : (characterSize.width + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
  }

  pendingWindow() {
    return this._pendingWindow;
  }

  waitingMembers(): Game_DevidedParty {
    if (!this._waitingMembers) {
      this._waitingMembers = new Game_DevidedParty();
      $gameParty.allMembers().forEach(actor => this._waitingMembers.addMember(actor));
    }
    return this._waitingMembers;
  }

  onSelectActor(currentWindow: Window_DevidePartyMember) {
    if (!this._pendingWindow) {
      /**
       * 初回選択
       */
      this._pendingWindow = currentWindow;
      this._pendingWindow.setPendingIndex();
    } else if (this._pendingWindow === currentWindow) {
      /**
       * 2回目の選択: 同一ウィンドウ内入れ替え
       */
      if (this._pendingWindow.pendingIndex() !== this._pendingWindow?.index()) {
        this._pendingWindow.party().swapOrder(this._pendingWindow.index(), this._pendingWindow.pendingIndex());
        this._pendingWindow.setPendingIndex(-1);
        this._pendingWindow.refresh();
        this._pendingWindow = undefined;
      }
    } else {
      /**
       * 2回目の選択: 別々のウィンドウ同士で入れ替え
       */
      const actor1 = this._pendingWindow.pendingActor();
      const actor2 = currentWindow.currentActor();
      currentWindow.party().setMember(actor1, currentWindow.index());
      this._pendingWindow.party().setMember(actor2, this._pendingWindow.pendingIndex());
      this._pendingWindow.setPendingIndex(-1);
      this._pendingWindow.refresh();
      currentWindow.refresh();
      this._pendingWindow = undefined;
    }
    currentWindow.activate();
  }

  onCancel(currentWindow: Window_DevidePartyMember) {
    if (this._pendingWindow) {
      this._pendingWindow.setPendingIndex(-1);
      this._pendingWindow = undefined;
      currentWindow.activate();
    } else if (this.canCommit()) {
      this.commitDevidedPartiesAndExit();
    } else {
      currentWindow.activate();
    }
  }

  commitDevidedPartiesAndExit() {
    this._devidedParties.forEach((party, index) => party.setPosition($gameTemp.devidePartyLocation(index)));
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

Scene_SelectActorCharacterMixIn(Scene_DevideParty.prototype);

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
  _statusWindow: Window_DevidePartyStatus | null = null;
  _statusParamsWindow: Window_StatusParams | null = null;
  _equipWindow: Window_StatusEquip | null = null;

  setStatusWindow(statusWindow: Window_DevidePartyStatus) {
    this._statusWindow = statusWindow;
  }

  setStatusParamsWindow(statusParamsWindow: Window_StatusParams) {
    this._statusParamsWindow = statusParamsWindow;
  }

  setEquipWindow(equipWindow: Window_StatusEquip) {
    this._equipWindow = equipWindow;
  }

  members(): (Game_Actor|undefined)[] {
    return [];
  }

  party(): Game_DevidedParty {
    return new Game_DevidedParty();
  }

  nearestIndexCandidates(x: number, y: number) {
    return [...Array(this.maxItems()).keys()];
  }

  nearestIndexTo(x: number, y: number) {
    const candidates = this.nearestIndexCandidates(x, y).map(i => {
      const rect = this.itemRect(i);
      return {
        index: i,
        x: this.x + rect.x + Math.floor(rect.width / 2),
        y: this.y + rect.y + Math.floor(rect.height / 2),
      };
    });
    return candidates.reduce((result: { index: number, x: number, y: number } | undefined, current) => {
      if (!result) {
        return current;
      }
      if (Math.abs(result.x - x) + Math.abs(result.y - y) > Math.abs(current.x - x) + Math.abs(result.y - y)) {
        return current;
      }
      return result;
    }, undefined)!.index;
  }

  activationTargetWindow(): Window_DevidePartyMember {
    return this;
  }

  activateOtherWindow(target: Window_DevidePartyMember) {
    this.deactivate();
    target.activate();
    const currentPoint = this.itemRect(this.index());
    target.select(target.nearestIndexTo(currentPoint.x + this.x, currentPoint.y + this.y));
  }

  select(index: number) {
    super.select(index);
    const actor = this.currentActor();
    if (this._statusWindow) {
      this._statusWindow.setActor(actor || null);
    }
    if (this._statusParamsWindow) {
      this._statusParamsWindow.setActor(actor || null);
    }
    if (this._equipWindow) {
      this._equipWindow.setActor(actor || null);
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
  _party: Game_DevidedParty;
  _devidedPartyWindows: Window_DevidedParty[];

  setDevidedPartyWindows(windows: Window_DevidedParty[]) {
    this._devidedPartyWindows = windows;
  }

  setParty(party: Game_DevidedParty) {
    this._party = party;
  }

  activationTargetWindow() {
    const cursorX = this.x + this.itemRect(this.index()).x;
    const targetWindowIndex = this._devidedPartyWindows
      .findIndex(devidedPartyWindow => devidedPartyWindow.x + devidedPartyWindow.width > cursorX);
    return targetWindowIndex < 0 ? this._devidedPartyWindows[this._devidedPartyWindows.length - 1] : this._devidedPartyWindows[targetWindowIndex];
  }

  maxCols() {
    return Math.floor(this.innerWidth / (this.characterSize().width + this.spacing()));
  }

  public maxItems(): number {
    return this.useTallCharacter() ? this.maxCols() : this.maxCols() * 2;
  }

  members() {
    return this._party?.allMembersWithSpace() || [];
  }

  party() {
    return this._party;
  }

  nearestIndexCandidates(x: number, y: number): number[] {
    return super.nearestIndexCandidates(x, y)
      .filter(i => this.useTallCharacter() || i >= this.maxCols())
  }

  isAtBottomRow() {
    return this.useTallCharacter() || this.index() >= this.maxCols();
  }

  public cursorDown(wrap?: boolean | undefined): void {
    if (this.isAtBottomRow()) {
      this.activateOtherWindow(this.activationTargetWindow());
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorDown(wrap);
    }
  }
}

class Window_DevidedParty extends Window_DevidePartyMember {
  _party: Game_DevidedParty;
  _waitingMemberWindow: Window_DevidePartyWaitingMember;
  _previousWindow: Window_DevidedParty;
  _nextWindow: Window_DevidedParty;

  setWaitingMemberWindow(waitingMemberWindow: Window_DevidePartyWaitingMember) {
    this._waitingMemberWindow = waitingMemberWindow;
  }

  setPreviousWindow(previousWindow: Window_DevidedParty) {
    this._previousWindow = previousWindow;
  }

  setNextWindow(nextWindow: Window_DevidedParty) {
    this._nextWindow = nextWindow;
  }

  setParty(party: Game_DevidedParty) {
    this._party = party;
  }

  isAtTopRow() {
    return this.index() < this.maxCols();
  }

  isAtLeftEdge() {
    return this.index() % this.maxCols() === 0;
  }

  isAtRightEdge() {
    return this.index() % this.maxCols() === this.maxCols() - 1;
  }

  public maxCols(): number {
    return this.useTallCharacter()
      ? $gameParty.maxBattleMembers()
      : Math.ceil($gameParty.maxBattleMembers() / 2);
  }

  public maxItems(): number {
    return $gameParty.maxBattleMembers();
  }

  members() {
    return this._party?.allMembersWithSpace() || [];
  }

  party() {
    return this._party;
  }

  nearestIndexCandidates(x: number, y: number): number[] {
    return super.nearestIndexCandidates(x, y).filter(i => i < this.maxCols());
  }

  public cursorUp(wrap?: boolean | undefined): void {
    if (this.isAtTopRow()) {
      this.activateOtherWindow(this._waitingMemberWindow);
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorUp(wrap);
    }
  }

  public cursorLeft(wrap?: boolean | undefined): void {
    if (this.isAtLeftEdge()) {
      this.activateOtherWindow(this._previousWindow);
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorLeft(wrap);
    }
  }

  public cursorRight(wrap?: boolean | undefined): void {
    if (this.isAtRightEdge()) {
      this.activateOtherWindow(this._nextWindow);
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorRight(wrap);
    }
  }
}

type _Scene_DevideParty = typeof Scene_DevideParty;
declare global {
  var Scene_DevideParty: _Scene_DevideParty;
}
globalThis.Scene_DevideParty = Scene_DevideParty;
