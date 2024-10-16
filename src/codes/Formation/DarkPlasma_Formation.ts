/// <reference path="./Formation.d.ts" />
import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_Formation_parameters';
import { command_openFormationScene } from './_build/DarkPlasma_Formation_commands';

/**
 * デフォルトのキャラグラサイズ
 * @type {number}
 */
const DEFAULT_CHARACTER_SIZE: number = 48;

/**
 * 待機ウィンドウの上下パディング幅
 * @type {number}
 */
const WAITING_WINDOW_PADDING: number = 36;

PluginManager.registerCommand(pluginName, command_openFormationScene, function () {
  SceneManager.push(Scene_Formation);
});

SceneManager.isPreviousSceneExtendsMenuBase = function () {
  return !!this._previousClass && new this._previousClass() instanceof Scene_MenuBase;
};

function Game_Temp_FormationMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._needsFormationBattleMemberWindowRefresh = false;
    this._needsFormationWaitingMemberWindowRefresh = false;
  };

  const _requestBattleRefresh = gameTemp.requestBattleRefresh;
  gameTemp.requestBattleRefresh = function () {
    _requestBattleRefresh.call(this);
    this.requestFormationMemberWindowsRefresh();
  };

  gameTemp.requestFormationMemberWindowsRefresh = function () {
    this._needsFormationBattleMemberWindowRefresh = true;
    this._needsFormationWaitingMemberWindowRefresh = true;
  };

  gameTemp.clearFormationBattleMemberWindowRefreshRequest = function () {
    this._needsFormationBattleMemberWindowRefresh = false;
  };

  gameTemp.clearFormationWaitingMemberWindowRefreshRequest = function () {
    this._needsFormationWaitingMemberWindowRefresh = false;
  };

  gameTemp.isFormationBattleMemberWindowRefreshRequested = function () {
    return this._needsFormationBattleMemberWindowRefresh;
  };

  gameTemp.isFormationWaitingMemberWindowRefreshRequested = function () {
    return this._needsFormationWaitingMemberWindowRefresh;
  };
}

Game_Temp_FormationMixIn(Game_Temp.prototype);

function Scene_FormationMixIn(sceneClass: typeof Scene_Base): typeof Scene_FormationMixInClass {
  return class extends sceneClass {
    _currentWindow: Window_FormationMember;
    _pendingWindow: Window_FormationMember | undefined;
    /**
     * @return {Rectangle}
     */
    helpWindowRect(): Rectangle {
      if (settings.showHelpWindow) {
        const width = ConfigManager.touchUI
          ? Graphics.boxWidth -
          this.cancelButtonWidth() -
          settings.cancelButtonRightMergin -
          settings.cancelButtonLeftMergin
          : Graphics.boxWidth;
        return new Rectangle(0, 0, width, this.calcWindowHeight(1, false));
      } else {
        return new Rectangle(0, 0, 0, 0);
      }
    }

    /**
     * @return {Rectangle}
     */
    statusWindowRect(): Rectangle {
      return new Rectangle(
        0,
        this.formationHelpWindow().height + this.waitingMemberWindowHeight(),
        this.formationStatusWindowWidth(),
        this.formationStatusWindowHeight()
      );
    }

    formationStatusWindowWidth(): number {
      return Graphics.boxWidth;
    }

    formationStatusWindowHeight(): number {
      return this.calcWindowHeight(4, false);
    }

    /**
     * @return {Rectangle}
     */
    battleMemberWindowRect(): Rectangle {
      return new Rectangle(
        0,
        this.formationHelpWindow().height,
        this.battleMemberWindowWidth(),
        this.waitingMemberWindowHeight()
      );
    }

    battleMemberWindowWidth(): number {
      const characterSpacing = Window_FormationBattleMember.prototype.spacing();
      return settings.characterHeight > DEFAULT_CHARACTER_SIZE
        ? (settings.characterWidth + characterSpacing) * $gameParty.maxBattleMembers()
        : (settings.characterWidth + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
    }

    /**
     * @return {Rectangle}
     */
    waitingMemberWindowRect(): Rectangle {
      return new Rectangle(
        this.formationBattleMemberWindow().width,
        this.formationHelpWindow().height,
        Graphics.boxWidth - this.formationBattleMemberWindow().width,
        this.waitingMemberWindowHeight()
      );
    }

    waitingMemberWindowHeight(): number {
      return settings.characterHeight > DEFAULT_CHARACTER_SIZE
        ? settings.characterHeight + WAITING_WINDOW_PADDING
        : settings.characterHeight * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
    }

    cancelButtonWidth(): number {
      return 0;
    }

    formationHelpWindow(): Window_Help {
      return new Window_Help(new Rectangle(0, 0, 0, 0));
    }

    formationBattleMemberWindow(): Window_FormationBattleMember {
      return new Window_FormationBattleMember(new Rectangle(0, 0, 0, 0));
    }

    formationWaitingMemberWindow(): Window_FormationWaitingMember {
      return new Window_FormationWaitingMember(new Rectangle(0, 0, 0, 0));
    }

    formationStatusWindow(): Window_FormationStatus {
      return new Window_FormationStatus(new Rectangle(0, 0, 0, 0));
    }

    formationStatusParamsWindow(): Window_StatusParams {
      return new Window_StatusParams(new Rectangle(0, 0, 0, 0));
    }

    formationEquipStatusWindow(): Window_StatusEquip {
      return new Window_StatusEquip(new Rectangle(0, 0, 0, 0));
    }

    currentActiveWindow(): Window_FormationMember {
      return this._currentWindow;
    }

    pendingWindow(): Window_FormationMember | undefined {
      return this._pendingWindow;
    }

    setupFormationWindows() {
      this.formationWaitingMemberWindow().setActivateAnotherWindow(() => this.activateBattleMemberWindow());
      this.formationWaitingMemberWindow().setActivateByHover(() => this.activateWaitingMemberWindowByHover());
      this.formationWaitingMemberWindow().setStatusWindow(this.formationStatusWindow());
      this.formationWaitingMemberWindow().setStatusParamsWindow(this.formationStatusParamsWindow());
      this.formationWaitingMemberWindow().setEquipWindow(this.formationEquipStatusWindow());
      this.formationWaitingMemberWindow().setHandler('ok', () => this.onFormationOk());
      this.formationWaitingMemberWindow().setHandler('cancel', () => this.onFormationCancel());
      this.formationWaitingMemberWindow().select(0);

      this.formationBattleMemberWindow().setActivateAnotherWindow(() => this.activateWaitingMemberWindow());
      this.formationBattleMemberWindow().setActivateByHover(() => this.activateBattleMemberWindowByHover());
      this.formationBattleMemberWindow().setStatusWindow(this.formationStatusWindow());
      this.formationBattleMemberWindow().setStatusParamsWindow(this.formationStatusParamsWindow());
      this.formationBattleMemberWindow().setEquipWindow(this.formationEquipStatusWindow());
      this.formationBattleMemberWindow().setHandler('ok', () => this.onFormationOk());
      this.formationBattleMemberWindow().setHandler('cancel', () => this.onFormationCancel());
      this.formationBattleMemberWindow().select(0);
    }

    /**
     * @return {Rectangle}
     */
    selectWindowRect(): Rectangle {
      return new Rectangle(
        0,
        this.formationWaitingMemberWindow().y,
        Graphics.boxWidth,
        this.formationWaitingMemberWindow().height
      );
    }

    onFormationOk(): void {
      const pendingIndex = this.pendingWindow()?.pendingIndexInParty() ?? -1;
      if (pendingIndex >= 0) {
        const index = this.currentActiveWindow().indexInParty();
        $gameParty.swapOrder(index, pendingIndex);
        this.pendingWindow()?.setPendingIndex(-1);
        this._pendingWindow = undefined;
        $gameTemp.requestFormationMemberWindowsRefresh();
      } else {
        const index = this.currentActiveWindow().index();
        this.currentActiveWindow().setPendingIndex(index);
        this._pendingWindow = this.currentActiveWindow();
      }
      this.currentActiveWindow().activate();
    }

    onFormationCancel(): void {
      if ((this.pendingWindow()?.pendingIndex() ?? -1) >= 0) {
        this.pendingWindow()?.setPendingIndex(-1);
        this.currentActiveWindow().activate();
      } else {
        this.quitFromFormation();
      }
    }

    quitFromFormation(): void { }

    activateWaitingMemberWindow(): void {
      if (this.formationWaitingMemberWindow().maxItems() > 0) {
        this.formationBattleMemberWindow().deactivate();
        this.formationWaitingMemberWindow().activate();
        this.formationWaitingMemberWindow().smoothSelect(this.targetIndexOfActivateWaitingMember());
        this._currentWindow = this.formationWaitingMemberWindow();
      }
    }

    targetIndexOfActivateWaitingMember() {
      let rowOffset = this.formationBattleMemberWindow().row() - this.formationBattleMemberWindow().topRow();
      let targetIndex = () => (this.formationWaitingMemberWindow().topRow() + rowOffset) * this.formationWaitingMemberWindow().maxCols();
      while (targetIndex() >= this.formationWaitingMemberWindow().maxItems()) {
        rowOffset--;
      }
      return targetIndex();
    }

    activateBattleMemberWindow(): void {
      this.formationWaitingMemberWindow().deactivate();
      this.formationBattleMemberWindow().activate();
      this.formationBattleMemberWindow().smoothSelect(this.targetIndexOfActivateBattleMember());
      this._currentWindow = this.formationBattleMemberWindow();
    }

    targetIndexOfActivateBattleMember() {
      let rowOffset = this.formationWaitingMemberWindow().row() - this.formationWaitingMemberWindow().topRow();
      let colOffset = this.formationBattleMemberWindow().maxCols() - 1;
      let targetIndex = () => (this.formationBattleMemberWindow().topRow() + rowOffset) * this.formationBattleMemberWindow().maxCols() + colOffset;
      while (targetIndex() >= this.formationBattleMemberWindow().maxItems()) {
        if (colOffset > 0) {
          colOffset--;
        } else {
          colOffset = this.formationBattleMemberWindow().maxCols() - 1;
          rowOffset--;
        }
      }
      return targetIndex();
    }

    activateBattleMemberWindowByHover() {
      this.formationWaitingMemberWindow().deactivate();
      this.formationBattleMemberWindow().activate();
      this._currentWindow = this.formationBattleMemberWindow();
    }

    activateWaitingMemberWindowByHover() {
      if (this.formationWaitingMemberWindow().maxItems() > 0) {
        this.formationBattleMemberWindow().deactivate();
        this.formationWaitingMemberWindow().activate();
        this._currentWindow = this.formationWaitingMemberWindow();
      }
    }
  };
}

globalThis.Scene_FormationMixIn = Scene_FormationMixIn;

class Scene_Formation extends Scene_FormationMixIn(Scene_Base) {
  _backgroundSprite: Sprite | null = null;
  _cancelButton: Sprite_Button | null = null;

  _helpWindow: Window_Help | null = null;
  _statusWindow: Window_FormationStatus | null = null;
  _statusParamsWindow: Window_StatusParams | null = null;
  _equipWindow: Window_StatusEquip | null = null;
  _battleMemberWindow: Window_FormationBattleMember | null = null;
  _waitingMemberWindow: Window_FormationWaitingMember | null = null;

  create() {
    super.create();
    this.createBackground();
    this.createWindowLayer();
    this.createButtons();
    this.createHelpWindow();
    this.createBattleMemberWindow();
    this.createWaitingMemberWindow();
    this.createStatusWindow();
    this.createStatusParamsWindow();
    this.createStatusEquipWindow();
    this.setupFormationWindows();
  }

  start() {
    super.start();
    this._battleMemberWindow!.activate();
    this._currentWindow = this._battleMemberWindow!;
  }

  createBackground() {
    if (settings.inheritMenuBackground && SceneManager.isPreviousSceneExtendsMenuBase()) {
      Scene_MenuBase.prototype.createBackground.call(this);
    } else {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
      this.addChild(this._backgroundSprite);
    }
  }

  setBackgroundOpacity(opacity: number) {
    if (this._backgroundSprite) {
      this._backgroundSprite.opacity = opacity;
    }
  }

  createHelpWindow() {
    this._helpWindow = new Window_Help(this.helpWindowRect());
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
  }

  helpWindowText() {
    return TextManager.formation;
  }

  createButtons() {
    if (ConfigManager.touchUI) {
      this._cancelButton = new Sprite_Button('cancel');
      this._cancelButton.x = Graphics.boxWidth - this.cancelButtonWidth() - settings.cancelButtonRightMergin;
      this._cancelButton.y = this.buttonY();
      this.addChild(this._cancelButton);
    }
  }

  cancelButtonWidth() {
    return this._cancelButton ? this._cancelButton.width : 0;
  }

  formationHelpWindow() {
    return this._helpWindow!;
  }

  createStatusWindow() {
    this._statusWindow = new Window_FormationStatus(this.statusWindowRect());
    this.addWindow(this._statusWindow);
  }

  formationStatusWindow() {
    return this._statusWindow!;
  }

  createStatusParamsWindow() {
    this._statusParamsWindow = new Window_StatusParams(this.statusParamsWindowRect());
    this.addWindow(this._statusParamsWindow);
  }

  statusParamsWindowRect() {
    return new Rectangle(
      0,
      this.formationHelpWindow().height + this.formationStatusWindow().height + this.waitingMemberWindowHeight(),
      Scene_Status.prototype.statusParamsWidth.call(this),
      this.formationStatusParamsWindowHeight()
    );
  }

  formationStatusParamsWindowHeight() {
    return (
      Graphics.boxHeight -
      this.waitingMemberWindowHeight() -
      this.formationStatusWindow().height -
      this.formationHelpWindow().height
    );
  }

  formationStatusParamsWindow() {
    return this._statusParamsWindow!;
  }

  createStatusEquipWindow() {
    this._equipWindow = new Window_StatusEquip(this.equipStatusWindowRect());
    this.addWindow(this._equipWindow);
  }

  equipStatusWindowRect() {
    return new Rectangle(
      this._statusParamsWindow!.width,
      this._statusParamsWindow!.y,
      Graphics.boxWidth - this._statusParamsWindow!.width,
      this._statusParamsWindow!.height
    );
  }

  formationEquipStatusWindow() {
    return this._equipWindow!;
  }

  createBattleMemberWindow() {
    this._battleMemberWindow = new Window_FormationBattleMember(this.battleMemberWindowRect());
    this._battleMemberWindow.setHandler('ok', () => this.onFormationOk());
    this.addWindow(this._battleMemberWindow);
  }

  formationBattleMemberWindow() {
    return this._battleMemberWindow!;
  }

  createWaitingMemberWindow() {
    this._waitingMemberWindow = new Window_FormationWaitingMember(this.waitingMemberWindowRect());
    this.addWindow(this._waitingMemberWindow);
  }

  formationWaitingMemberWindow() {
    return this._waitingMemberWindow!;
  }

  quitFromFormation() {
    $gamePlayer.refresh();
    this.popScene();
  }
}

type _Scene_Formation = typeof Scene_Formation;
declare global {
  var Scene_Formation: _Scene_Formation;
}
globalThis.Scene_Formation = Scene_Formation;

class Window_FormationStatus extends Window_SkillStatus {
  _topFaceBitmap: Bitmap | null = null;
  _topFaceIsVisible: boolean = false;
  loadFaceImages() {
    super.loadFaceImages();
    /**
     * 先頭の顔グラビットマップ
     */
    this._topFaceBitmap = ImageManager.loadFace($gameParty.leader()!.faceName());
    this._topFaceIsVisible = false;
  }

  numVisibleRows() {
    return 4;
  }

  windowHeight() {
    return this.fittingHeight(this.numVisibleRows());
  }

  update() {
    super.update();
    /**
     * 先頭のみ顔グラの読み込みが間に合わないケースがあるため、
     * 準備完了を待って一度だけ再描画処理を走らせる
     */
    if (!this._topFaceIsVisible && this._topFaceBitmap && this._topFaceBitmap.isReady()) {
      this.refresh();
      this._topFaceIsVisible = true;
    }
  }
}

class Window_FormationMember extends Window_StatusBase {
  _bitmapsMustBeRedraw: Bitmap[];
  _pendingIndex: number;
  _activateAnotherWindow: () => void;
  _activateByHover: () => void;

  _statusWindow: Window_FormationStatus | null = null;
  _statusParamsWindow: Window_StatusParams | null = null;
  _equipWindow: Window_StatusEquip | null = null;

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this._bitmapsMustBeRedraw = [];
    this._pendingIndex = -1;
    this.refresh();
  }

  setActivateAnotherWindow(func: () => void) {
    this._activateAnotherWindow = func;
  }

  setActivateByHover(func: () => void) {
    this._activateByHover = func;
  }

  setStatusWindow(statusWindow: Window_FormationStatus) {
    this._statusWindow = statusWindow;
  }

  setStatusParamsWindow(statusParamsWindow: Window_StatusParams) {
    this._statusParamsWindow = statusParamsWindow;
  }

  setEquipWindow(equipWindow: Window_StatusEquip) {
    this._equipWindow = equipWindow;
  }

  drawActorCharacter(actor: Game_Actor, x: number, y: number) {
    super.drawActorCharacter(actor, x, y);
    const bitmap = ImageManager.loadCharacter(actor.characterName());
    if (!bitmap.isReady()) {
      this._bitmapsMustBeRedraw.push(bitmap);
    }
  }

  drawActorCharacterLeft(actor: Game_Actor, x: number, y: number) {
    const bitmap = ImageManager.loadCharacter(actor.characterName());
    const big = ImageManager.isBigCharacter(actor.characterName());
    const pw = bitmap.width / (big ? 3 : 12);
    const ph = bitmap.height / (big ? 4 : 8);
    const n = big ? 0 : actor.characterIndex();
    const sx = ((n % 4) * 3 + 1) * pw;
    const sy = (Math.floor(n / 4) * 4 + 1) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    if (!bitmap.isReady()) {
      this._bitmapsMustBeRedraw.push(bitmap);
    }
  }

  actor(): Game_Actor | undefined {
    return $gameParty.allMembers()[this.index()];
  }

  members(): Game_Actor[] {
    return [];
  }

  public maxItems(): number {
    return this.members().length;
  }

  spacing() {
    return 12;
  }

  /**
   * カーソル矩形のXオフセット
   * MZデフォサイズ(48)の場合は待機メンバーウィンドウのみ、いい感じに左右パディングが必要
   */
  rectangleOffsetX() {
    return 0;
  }

  /**
   * 歩行グラフィック表示Yオフセット
   */
  characterOffsetY() {
    return 4;
  }

  itemHeight() {
    return settings.characterHeight + this.spacing();
  }

  maxColsForRect() {
    return this.maxCols();
  }

  /**
   * スクロール高さ制限のため
   */
  public overallHeight(): number {
    return this.maxRows() * this.itemHeight();
  }

  itemRect(index: number) {
    const x = this.rectangleOffsetX() + (index % this.maxColsForRect()) * this.itemWidth() - this.scrollBaseX();
    const y = Math.floor(index / this.maxColsForRect()) * this.itemHeight() - this.scrollBaseY();
    return new Rectangle(x, y, settings.characterWidth, this.itemHeight());
  }

  pendingIndex() {
    return this._pendingIndex;
  }

  pendingIndexInParty() {
    return this._pendingIndex;
  }

  indexInParty() {
    return this.index();
  }

  setPendingIndex(pendingIndex: number) {
    if (this._pendingIndex !== pendingIndex) {
      this._pendingIndex = pendingIndex;
      this.refresh();
    }
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

  update() {
    super.update();
    /**
     * 初回のみロードが間に合わないケースがあるため、再描画
     */
    if (this._bitmapsMustBeRedraw.length > 0 && this._bitmapsMustBeRedraw.every((bitmap) => bitmap.isReady())) {
      this.refresh();
      this._bitmapsMustBeRedraw = [];
    }
  }

  public drawAllItems(): void {
    this.drawPendingItemBackGround();
    this.members().forEach((actor, i) => {
      const rect = this.itemRect(i);
      const x = rect.x + settings.characterWidth / 2;
      const y = rect.y + settings.characterHeight + this.characterOffsetY();
      if (settings.characterDirectionToLeft) {
        this.drawActorCharacterLeft(actor, x, y);
      } else {
        this.drawActorCharacter(actor, x, y);
      }
    });
  }

  drawPendingItemBackGround() {
    if (this._pendingIndex >= 0) {
      const rect = this.itemRect(this._pendingIndex);
      const color = ColorManager.pendingColor();
      this.changePaintOpacity(false);
      this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
      this.changePaintOpacity(true);
    }
  }

  public refreshCursor(): void {
    /**
     * アクティブでない場合には選択カーソル非表示
     */
    if (!this.active) {
      this.setCursorRect(0, 0, 0, 0);
    } else {
      super.refreshCursor();
    }
  }

  processCancel() {
    if (this.processCancelEnabled()) {
      super.processCancel();
    } else {
      this.playBuzzerSound();
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

  public processTouch(): void {
    if (!this.active && this.isOpen() && TouchInput.isHovered() && this.hitIndex() >= 0 && this._activateByHover) {
      this._activateByHover();
    }
    super.processTouch();
  }
}

class Window_FormationBattleMember extends Window_FormationMember {
  update() {
    super.update();
    if ($gameTemp.isFormationBattleMemberWindowRefreshRequested()) {
      this.refresh();
      $gameTemp.clearFormationBattleMemberWindowRefreshRequest();
    }
  }

  members() {
    return $gameParty.battleMembers();
  }

  maxCols() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE
      ? $gameParty.maxBattleMembers()
      : Math.ceil($gameParty.maxBattleMembers() / 2);
  }

  /**
   * 戦闘メンバーの数が奇数だった場合に2段目の位置をいい感じにするためのもの
   * 少数で割った余りを計算するので気持ち悪いが……。
   */
  maxColsForRect(): number {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE
      ? $gameParty.maxBattleMembers()
      : $gameParty.maxBattleMembers() / 2;
  }

  /**
   * カーソル矩形のXオフセット
   * MZデフォサイズ(48)の場合は待機メンバーウィンドウのみ、いい感じに左右パディングが必要
   */
  rectangleOffsetX() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE ? 0 : 12;
  }

  isAtRightEnd() {
    return this.index() % this.maxCols() === this.maxCols() - 1 || this.index() === this.maxItems() - 1;
  }

  isAtLeftEnd() {
    return this.index() % this.maxCols() === 0;
  }

  public cursorRight(wrap?: boolean | undefined): void {
    if (this.isAtRightEnd()) {
      this._activateAnotherWindow();
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorRight();
    }
  }

  public cursorLeft(wrap?: boolean | undefined): void {
    /**
     * 直感に反するため、左端で左キーを押したときは何もしない
     */
    if (!this.isAtLeftEnd()) {
      super.cursorLeft();
    }
  }
}

class Window_FormationWaitingMember extends Window_FormationMember {
  actor(): Game_Actor | undefined {
    return this.index() >= 0 ? $gameParty.allMembers()[this.index() + $gameParty.battleMembers().length] : undefined;
  }

  pendingIndexInParty(): number {
    return this.pendingIndex() >= 0 ? this.pendingIndex() + $gameParty.battleMembers().length : -1;
  }

  indexInParty(): number {
    return this.index() + $gameParty.battleMembers().length;
  }

  update() {
    super.update();
    if ($gameTemp.isFormationWaitingMemberWindowRefreshRequested()) {
      this.refresh();
      $gameTemp.clearFormationWaitingMemberWindowRefreshRequest();
    }
  }

  members() {
    return $gameParty.allMembers().filter((actor) => !actor.isBattleMember());
  }

  maxCols() {
    return Math.floor(this.innerWidth / (settings.characterWidth + this.spacing()));
  }

  isAtLeftEnd() {
    return this.index() % this.maxCols() === 0;
  }

  isAtRightEnd() {
    return this.index() % this.maxCols() === this.maxCols() - 1;
  }

  public cursorLeft(wrap?: boolean | undefined): void {
    if (this.index() % this.maxCols() === 0) {
      this._activateAnotherWindow();
      this.playCursorSound();
      this.updateInputData();
    } else {
      super.cursorLeft();
    }
  }

  public cursorRight(wrap?: boolean | undefined): void {
    if (!this.isAtRightEnd()) {
      super.cursorRight();
    }
  }
}

type _Window_FormationStatus = typeof Window_FormationStatus;
type _Window_FormationBattleMember = typeof Window_FormationBattleMember;
type _Window_FormationWaitinMember = typeof Window_FormationWaitingMember;
declare global {
  var Window_FormationStatus: _Window_FormationStatus;
  var Window_FormationBattleMember: _Window_FormationBattleMember;
  var Window_FormationWaitingMember: _Window_FormationWaitinMember;
}
globalThis.Window_FormationStatus = Window_FormationStatus;
globalThis.Window_FormationBattleMember = Window_FormationBattleMember;
globalThis.Window_FormationWaitingMember = Window_FormationWaitingMember;
