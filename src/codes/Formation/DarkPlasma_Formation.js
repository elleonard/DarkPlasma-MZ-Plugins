import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_Formation_parameters';

/**
 * デフォルトのキャラグラサイズ
 * @type {number}
 */
const DEFAULT_CHARACTER_SIZE = 48;

/**
 * 待機ウィンドウの上下パディング幅
 * @type {number}
 */
const WAITING_WINDOW_PADDING = 36;

const PLUGIN_COMMANDS = {
  OPEN_FORMATION_SCENE: 'openFormationScene',
};

PluginManager.registerCommand(pluginName, PLUGIN_COMMANDS.OPEN_FORMATION_SCENE, function () {
  SceneManager.push(Scene_Formation);
});

SceneManager.isPreviousSceneExtendsMenuBase = function () {
  return new this._previousClass() instanceof Scene_MenuBase;
};

const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function () {
  _Game_Temp_initialize.call(this);
  this._needsFormationBattleMemberWindowRefresh = false;
  this._needsFormationWaitingMemberWindowRefresh = false;
};

const _Game_Temp_requestBattleRefresh = Game_Temp.prototype.requestBattleRefresh;
Game_Temp.prototype.requestBattleRefresh = function () {
  _Game_Temp_requestBattleRefresh.call(this);
  this.requestFormationMemberWindowsRefresh();
};

Game_Temp.prototype.requestFormationMemberWindowsRefresh = function () {
  this._needsFormationBattleMemberWindowRefresh = true;
  this._needsFormationWaitingMemberWindowRefresh = true;
};

Game_Temp.prototype.clearFormationBattleMemberWindowRefreshRequest = function () {
  this._needsFormationBattleMemberWindowRefresh = false;
};

Game_Temp.prototype.clearFormationWaitingMemberWindowRefreshRequest = function () {
  this._needsFormationWaitingMemberWindowRefresh = false;
};

Game_Temp.prototype.isFormationBattleMemberWindowRefreshRequested = function () {
  return this._needsFormationBattleMemberWindowRefresh;
};

Game_Temp.prototype.isFormationWaitingMemberWindowRefreshRequested = function () {
  return this._needsFormationWaitingMemberWindowRefresh;
};

class Scene_Formation extends Scene_Base {
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
    this.createSelectWindow();
  }

  start() {
    super.start();
    this._selectWindow.activate();
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

  setBackgroundOpacity(opacity) {
    this._backgroundSprite.opacity = opacity;
  }

  createHelpWindow() {
    this._helpWindow = new Window_Help(this.helpWindowRect());
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
  }

  helpWindowRect() {
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

  helpWindowText() {
    return TextManager.formation;
  }

  createButtons() {
    if (ConfigManager.touchUI) {
      this._cancelButton = new Sprite_Button('cancel');
      this._cancelButton.x = Graphics.boxWidth - this.cancelButtonWidth() - settings.cancelButtonRightMergin;
      this._cancelButton.y = this.buttonY();
      this.addWindow(this._cancelButton);
    }
  }

  cancelButtonWidth() {
    return this._cancelButton ? this._cancelButton.width : 0;
  }

  formationHelpWindow() {
    return this._helpWindow;
  }

  createStatusWindow() {
    this._statusWindow = new Window_FormationStatus(this.statusWindowRect());
    this.addWindow(this._statusWindow);
  }

  statusWindowRect() {
    return new Rectangle(
      0,
      this.formationHelpWindow().height + this.waitingMemberWindowHeight(),
      Graphics.boxWidth,
      this.formationStatusWindowHeight()
    );
  }

  formationStatusWindow() {
    return this._statusWindow;
  }

  formationStatusWindowHeight() {
    return this.calcWindowHeight(4, false);
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
    return this._statusParamsWindow;
  }

  createStatusEquipWindow() {
    this._equipWindow = new Window_StatusEquip(this.equipStatusWindowRect());
    this.addWindow(this._equipWindow);
  }

  equipStatusWindowRect() {
    return new Rectangle(
      this._statusParamsWindow.width,
      this._statusParamsWindow.y,
      Graphics.boxWidth - this._statusParamsWindow.width,
      this._statusParamsWindow.height
    );
  }

  formationEquipStatusWindow() {
    return this._equipWindow;
  }

  createBattleMemberWindow() {
    this._battleMemberWindow = new Window_FormationBattleMember(this.battleMemberWindowRect());
    this.addWindow(this._battleMemberWindow);
  }

  battleMemberWindowRect() {
    return new Rectangle(
      0,
      this.formationHelpWindow().height,
      this.battleMemberWindowWidth(),
      this.waitingMemberWindowHeight()
    );
  }

  battleMemberWindowWidth() {
    const characterSpacing = Window_FormationBattleMember.prototype.spacing();
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE
      ? (settings.characterWidth + characterSpacing) * $gameParty.maxBattleMembers()
      : (settings.characterWidth + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
  }

  formationBattleMemberWindow() {
    return this._battleMemberWindow;
  }

  createWaitingMemberWindow() {
    this._waitingMemberWindow = new Window_FormationWaitingMember(this.waitingMemberWindowRect());
    this.addWindow(this._waitingMemberWindow);
  }

  waitingMemberWindowRect() {
    return new Rectangle(
      this.formationBattleMemberWindow().width,
      this.formationHelpWindow().height,
      Graphics.boxWidth - this.formationBattleMemberWindow().width,
      this.waitingMemberWindowHeight()
    );
  }

  waitingMemberWindowHeight() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE
      ? settings.characterHeight + WAITING_WINDOW_PADDING
      : settings.characterHeight * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
  }

  formationWaitingMemberWindow() {
    return this._waitingMemberWindow;
  }

  createSelectWindow() {
    this._selectWindow = new Window_FormationSelect(this.selectWindowRect());
    this.setupFormationSelectWindow();
  }

  setupFormationSelectWindow() {
    this.formationSelectWindow().setStatusWindow(this.formationStatusWindow());
    this.formationSelectWindow().setBattleMemberWindow(this.formationBattleMemberWindow());
    this.formationSelectWindow().setWaitingMemberWindow(this.formationWaitingMemberWindow());
    this.formationSelectWindow().setStatusParamsWindow(this.formationStatusParamsWindow());
    this.formationSelectWindow().setEquipWindow(this.formationEquipStatusWindow());
    this.formationSelectWindow().setHandler('ok', this.onFormationOk.bind(this));
    this.formationSelectWindow().setHandler('cancel', this.onFormationCancel.bind(this));
    this.formationSelectWindow().select(0);
    /**
     * 透明なウィンドウを重ねることでカーソル表示を実現するため、専用レイヤーを用意する
     */
    this._selectWindowLayer = new WindowLayer();
    this._selectWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._selectWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._selectWindowLayer);
    this._selectWindowLayer.addChild(this.formationSelectWindow());
  }

  selectWindowRect() {
    return new Rectangle(
      0,
      this.formationWaitingMemberWindow().y,
      Graphics.boxWidth,
      this.formationWaitingMemberWindow().height
    );
  }

  formationSelectWindow() {
    return this._selectWindow;
  }

  onFormationOk() {
    const index = this.formationSelectWindow().index();
    const pendingIndex = this.formationSelectWindow().pendingIndex();
    if (pendingIndex >= 0) {
      $gameParty.swapOrder(index, pendingIndex);
      this.formationSelectWindow().setPendingIndex(-1);
      $gameTemp.requestFormationMemberWindowsRefresh();
    } else {
      this.formationSelectWindow().setPendingIndex(index);
    }
    this.formationSelectWindow().activate();
  }

  onFormationCancel() {
    if (this.formationSelectWindow().pendingIndex() >= 0) {
      this.formationSelectWindow().setPendingIndex(-1);
      this.formationSelectWindow().activate();
    } else {
      this.quitFromFormation();
    }
  }

  quitFromFormation() {
    $gamePlayer.refresh();
    this.popScene();
  }
}

window[Scene_Formation.name] = Scene_Formation;

class Window_FormationStatus extends Window_SkillStatus {
  loadFaceImages() {
    super.loadFaceImages();
    /**
     * 先頭の顔グラビットマップ
     */
    this._topFaceBitmap = ImageManager.loadFace($gameParty.leader().faceName());
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

class Window_DrawActorCharacter extends Window_StatusBase {
  initialize(rect) {
    super.initialize(rect);
    this._bitmapsMustBeRedraw = [];
    this.refresh();
  }

  drawActorCharacter(actor, x, y) {
    super.drawActorCharacter(actor, x, y);
    const bitmap = ImageManager.loadCharacter(actor.characterName());
    if (!bitmap.isReady()) {
      this._bitmapsMustBeRedraw.push(bitmap);
    }
  }

  drawActorCharacterLeft(actor, x, y) {
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

  members() {
    return [];
  }

  spacing() {
    return 12;
  }

  offsetX() {
    return 0;
  }

  offsetY() {
    return 0;
  }

  itemHeight() {
    return settings.characterHeight + 8;
  }

  itemRect(index) {
    const x = this.x + this.offsetX() + (index % this.maxCols()) * (settings.characterWidth + this.spacing());
    const y = -4 + this.offsetY() + Math.floor(index / this.maxCols()) * (settings.characterHeight + this.spacing());
    return new Rectangle(x, y, settings.characterWidth, this.itemHeight());
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

  refresh() {
    this.contents.clear();
    this.members().forEach((actor, index) => {
      const x =
        this.offsetX() +
        settings.characterWidth / 2 +
        (index % this.maxCols()) * (settings.characterWidth + this.spacing());
      const y =
        this.offsetY() +
        settings.characterHeight +
        Math.floor(index / this.maxCols()) * (settings.characterHeight + this.spacing());
      if (settings.characterDirectionToLeft) {
        this.drawActorCharacterLeft(actor, x, y);
      } else {
        this.drawActorCharacter(actor, x, y);
      }
    });
  }
}

class Window_FormationBattleMember extends Window_DrawActorCharacter {
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
      : $gameParty.maxBattleMembers() / 2;
  }

  offsetX() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE ? 0 : 12;
  }

  offsetY() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE ? 0 : 4;
  }

  spacing() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE ? 24 : 12;
  }
}

class Window_FormationWaitingMember extends Window_DrawActorCharacter {
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
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE ? 9 : 11;
  }
}

class Window_FormationSelect extends Window_Selectable {
  initialize(rect) {
    super.initialize(rect);
    this.setBackgroundType(2);
    this._pendingIndex = -1;
    this._pendingCursorSprite = new Sprite();
    this._pendingCursorRect = new Rectangle();
    this.addChild(this._pendingCursorSprite);
  }

  setStatusWindow(statusWindow) {
    this._statusWindow = statusWindow;
  }

  setBattleMemberWindow(battleMemberWindow) {
    this._battleMemberWindow = battleMemberWindow;
  }

  setWaitingMemberWindow(waitingMemberWindow) {
    this._waitingMemberWindow = waitingMemberWindow;
  }

  setStatusParamsWindow(statusParamsWindow) {
    this._statusParamsWindow = statusParamsWindow;
  }

  setEquipWindow(equipWindow) {
    this._equipWindow = equipWindow;
  }

  maxCols() {
    return this.maxItems();
  }

  maxItems() {
    return $gameParty.allMembers().length;
  }

  isSelectBattleMember() {
    return this.index() < $gameParty.battleMembers().length;
  }

  isSelectUpperLineBattleMember() {
    return !this.useTallCharacter() && this.index() < this._battleMemberWindow.maxCols();
  }

  isSelectLowerLineBattleMember() {
    return (
      !this.useTallCharacter() &&
      this.index() >= this._battleMemberWindow.maxCols() &&
      this.index() < $gameParty.battleMembers().length
    );
  }

  isSelectLeftLineWaitingMember() {
    return (
      !this.useTallCharacter() &&
      this.index() < $gameParty.battleMembers().length &&
      this.index() % this._battleMemberWindow.maxCols() === 0
    );
  }

  isSelectRightLineBattleMember() {
    const maxCols = this.isSelectUpperLineBattleMember()
      ? Math.ceil(this._battleMemberWindow.maxCols())
      : Math.floor(this._battleMemberWindow.maxCols());
    return (
      !this.useTallCharacter() &&
      this.index() < $gameParty.battleMembers().length &&
      this.index() % maxCols === maxCols - 1
    );
  }

  isSelectUpperLineWaitingMember() {
    return (
      !this.useTallCharacter() &&
      this.index() >= $gameParty.battleMembers().length &&
      this.index() < $gameParty.battleMembers().length + this._waitingMemberWindow.maxCols()
    );
  }

  isSelectLowerLineWaitingMember() {
    return (
      !this.useTallCharacter() &&
      this.index() >= $gameParty.battleMembers().length + this._waitingMemberWindow.maxCols()
    );
  }

  isSelectLeftLineWaitingMember() {
    return (
      !this.useTallCharacter() &&
      this.index() >= $gameParty.battleMembers().length &&
      (this.index() - $gameParty.battleMembers().length) % this._waitingMemberWindow.maxCols() === 0
    );
  }

  /**
   * デフォルトよりも背の高いキャラグラを使用しているか
   * @return {boolean}
   */
  useTallCharacter() {
    return settings.characterHeight > DEFAULT_CHARACTER_SIZE;
  }

  cursorDown() {
    if (this.isSelectUpperLineBattleMember()) {
      if (this.index() + Math.ceil(this._battleMemberWindow.maxCols()) < $gameParty.battleMembers().length) {
        this.select(this.index() + Math.ceil(this._battleMemberWindow.maxCols()));
      } else if ($gameParty.battleMembers().length > Math.ceil(this._battleMemberWindow.maxCols())) {
        this.select($gameParty.battleMembers().length - 1);
      }
    } else if (
      this.isSelectUpperLineWaitingMember() &&
      this.index() + this._waitingMemberWindow.maxCols() < this.maxItems()
    ) {
      this.select(this.index() + this._waitingMemberWindow.maxCols());
    }
  }

  cursorUp() {
    if (this.isSelectLowerLineBattleMember()) {
      this.select(this.index() - Math.floor(this._battleMemberWindow.maxCols()));
    } else if (this.isSelectLowerLineWaitingMember()) {
      this.select(this.index() - this._waitingMemberWindow.maxCols());
    }
  }

  cursorRight(wrap) {
    if (this.isSelectRightLineBattleMember() && this.maxItems() > $gameParty.battleMembers().length) {
      if (
        this.isSelectLowerLineBattleMember() &&
        this.maxItems() > $gameParty.battleMembers().length + this._waitingMemberWindow.maxCols()
      ) {
        this.select($gameParty.battleMembers().length + this._waitingMemberWindow.maxCols());
      } else {
        this.select($gameParty.battleMembers().length);
      }
    } else {
      super.cursorRight(wrap);
    }
  }

  cursorLeft(wrap) {
    if (this.isSelectLeftLineWaitingMember()) {
      if (this.isSelectUpperLineWaitingMember()) {
        this.select(Math.ceil(this._battleMemberWindow.maxCols()) - 1);
      } else {
        this.select($gameParty.battleMembers().length - 1);
      }
    } else {
      super.cursorLeft(wrap);
    }
  }

  select(index) {
    super.select(index);
    if (this._statusWindow) {
      this._statusWindow.setActor($gameParty.allMembers()[this.index()]);
    }
    if (this._statusParamsWindow) {
      this._statusParamsWindow.setActor($gameParty.allMembers()[this.index()]);
    }
    if (this._equipWindow) {
      this._equipWindow.setActor($gameParty.allMembers()[this.index()]);
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

  itemRect(index) {
    if (index < $gameParty.battleMembers().length) {
      return this._battleMemberWindow.itemRect(index);
    } else {
      return this._waitingMemberWindow.itemRect(index - $gameParty.battleMembers().length);
    }
  }

  pendingIndex() {
    return this._pendingIndex;
  }

  setPendingIndex(pendingIndex) {
    this._pendingIndex = pendingIndex;
    this.drawPendingItemBackGround();
  }

  drawPendingItemBackGround() {
    if (this._pendingIndex >= 0) {
      const rect = this.itemRect(this._pendingIndex);
      const color = ColorManager.pendingColor();
      this.changePaintOpacity(false);
      this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
      this.changePaintOpacity(true);
    } else {
      this.contents.clear();
    }
  }
}

window[Window_FormationStatus.name] = Window_FormationStatus;
window[Window_FormationBattleMember.name] = Window_FormationBattleMember;
window[Window_FormationWaitingMember.name] = Window_FormationWaitingMember;
window[Window_FormationSelect.name] = Window_FormationSelect;
