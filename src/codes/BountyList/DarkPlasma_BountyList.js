import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_BountyList_parameters';

const _extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _extractMetadata.call(this, data);
  if (data.meta.isBounty) {
    data.isBounty = true;
    if (data.meta.bountyShowSwitch) {
      data.bountyShowSwitch = Number(data.meta.bountyShowSwitch);
    }
    settings.bountyInformations.forEach((info) => {
      if (data.meta[info.tag]) {
        data[info.tag] = String(data.meta[info.tag]);
      }
    });
  }
};

PluginManager.registerCommand(pluginName, 'BountyList open', (_) => {
  SceneManager.push(Scene_BountyList);
});

PluginManager.registerCommand(pluginName, 'BountyList add', (args) => {
  $gameSystem.addToBountyList(Number(args.id));
});

PluginManager.registerCommand(pluginName, 'BountyList remove', (args) => {
  $gameSystem.removeFromBountyList(Number(args.id));
});

PluginManager.registerCommand(pluginName, 'BountyList complete', (_) => {
  $gameSystem.completeBountyList();
});

PluginManager.registerCommand(pluginName, 'BountyList clear', (_) => {
  $gameSystem.clearBountyList();
});

Game_System.prototype.addToBountyList = function (enemyId) {
  if (!this._bountyKillFlags) {
    this.clearBountyList();
  }
  if ($dataEnemies[enemyId].isBounty) {
    this._bountyKillFlags[enemyId] = true;
  }
};

Game_System.prototype.removeFromBountyList = function (enemyId) {
  if (this._bountyKillFlags) {
    this._bountyKillFlags[enemyId] = false;
  }
};

Game_System.prototype.completeBountyList = function () {
  this.clearBountyList();
  $dataEnemies
    .filter((enemy) => enemy && enemy.isBounty)
    .forEach(function (enemy) {
      this._bountyKillFlags[enemy.id] = true;
    }, this);
};

Game_System.prototype.clearBountyList = function () {
  this._bountyKillFlags = [];
};

Game_System.prototype.isInBountyList = function (enemy) {
  if (!this._bountyKillFlags) {
    this.clearBountyList();
  }
  // そもそもバウンティではない
  if (!enemy.isBounty) {
    return false;
  }
  // すでに撃破済み
  if (this._bountyKillFlags[enemy.id]) {
    return true;
  }
  // スイッチが立っている
  if (enemy.bountyShowSwitch && $gameSwitches.value(enemy.bountyShowSwitch)) {
    return true;
  }
  return false;
};

Game_System.prototype.isKilledBounty = function (enemy) {
  if (!this._bountyKillFlags) {
    this.clearBountyList();
  }
  if (!enemy.isBounty) {
    return false;
  }
  if (this._bountyKillFlags[enemy.id]) {
    return true;
  }
  return false;
};

const _Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
Game_Enemy.prototype.performCollapse = function () {
  _Game_Enemy_performCollapse.call(this);
  $gameSystem.addToBountyList(this.enemy().id);
};

/**
 *  賞金首シーン
 */
class Scene_BountyList extends Scene_MenuBase {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    super.initialize();
  }

  create() {
    super.create();
    this._indexWindow = new Window_BountyListIndex(this.bountyListIndexWindowRect());
    this._indexWindow.setHandler('cancel', this.popScene.bind(this));
    const detailsWindowY = this._indexWindow.height;
    this._detailsWindow = new Window_BountyListDetails(this.bountyListDetailsWindowRect());
    this.addWindow(this._indexWindow);
    this.addWindow(this._detailsWindow);
    this._indexWindow.setDetailsWindow(this._detailsWindow);
  }

  /**
   * @return {Rectangle}
   */
  bountyListIndexWindowRect() {
    return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(6, true));
  }

  /**
   * @return {Rectangle}
   */
  bountyListDetailsWindowRect() {
    const y = this._indexWindow.height;
    return new Rectangle(0, y, Graphics.boxWidth, Graphics.boxHeight - y);
  }
}

window[Scene_BountyList.name] = Scene_BountyList;

/**
 * 賞金首リスト表示
 */
class Window_BountyListIndex extends Window_Selectable {
  constructor(rect) {
    super(rect);
    this.initialize.apply(this, arguments);
  }

  initialize(rect) {
    super.initialize(rect);
    this.refresh();
    this.setTopRow(Window_BountyListIndex.lastTopRow);
    this.select(Window_BountyListIndex.lastIndex);
    this.activate();
  }

  maxCols() {
    return 3;
  }

  maxItems() {
    return this._list ? this._list.length : 0;
  }

  /**
   * @param {Window_BountyListDetails} detailsWindow 詳細ウィンドウ
   */
  setDetailsWindow(detailsWindow) {
    this._detailsWindow = detailsWindow;
    this.updateDetails();
  }

  update() {
    super.update();
    this.updateDetails();
  }

  updateDetails() {
    if (this._detailsWindow) {
      const enemy = this._list[this.index()];
      this._detailsWindow.setEnemy(enemy);
    }
  }

  refresh() {
    this._list = $dataEnemies.filter((enemy) => enemy && enemy.isBounty);
    this.createContents();
    this.drawAllItems();
  }

  /**
   * @param {number} index インデックス
   */
  drawItem(index) {
    const enemy = this._list[index];
    const rect = this.itemRect(index);
    const name = $gameSystem.isInBountyList(enemy) ? enemy.name : settings.unknownName;
    if ($gameSystem.isKilledBounty(enemy)) {
      this.changeTextColor(ColorManager.textColor(settings.textColorKilled));
    } else {
      this.changeTextColor(ColorManager.textColor(settings.textColorNormal));
    }
    this.drawText(name, rect.x, rect.y, rect.width);
    this.resetTextColor();
  }

  processCancel() {
    super.processCancel();
    Window_BountyListIndex.lastTopRow = this.topRow();
    Window_BountyListIndex.lastIndex = this.index();
  }
}

Window_BountyListIndex.lastTopRow = 0;
Window_BountyListIndex.lastIndex = 0;

/**
 * 賞金首詳細表示
 */
class Window_BountyListDetails extends Window_Base {
  constructor(rect) {
    super(rect);
    this.initialize.apply(this, arguments);
  }

  initialize(rect) {
    super.initialize(rect);
    this._enemy = null;
    this._enemySprite = new Sprite();
    this._enemySprite.anchor.x = 0.5;
    this._enemySprite.anchor.y = 0.5;
    this._enemySprite.x = rect.width / 4 - 20;
    this._enemySprite.y = rect.height / 2;
    this.addChildToBack(this._enemySprite);
    this.refresh();
  }

  /**
   * @param {MZ.Enemy} enemy 敵データ
   */
  setEnemy(enemy) {
    if (this._enemy !== enemy) {
      this._enemy = enemy;
      this.refresh();
    }
  }

  update() {
    super.update();
    if (this._enemySprite.bitmap) {
      const bitmapHeight = this._enemySprite.bitmap.height;
      const contentsHeight = this.contents.height;
      const scale = bitmapHeight > contentsHeight ? contentsHeight / bitmapHeight : 1;
      this._enemySprite.scale.x = scale;
      this._enemySprite.scale.y = scale;
    }
  }

  refresh() {
    const enemy = this._enemy;
    const lineHeight = this.lineHeight();
    const NAME_X = 0;
    const NAME_Y = 0;

    this.contents.clear();

    if (!enemy || !$gameSystem.isInBountyList(enemy)) {
      this._enemySprite.bitmap = null;
      return;
    }

    const name = enemy.battlerName;
    const hue = enemy.battlerHue;
    this._enemySprite.bitmap = $gameSystem.isSideView()
      ? ImageManager.loadSvEnemy(name, hue)
      : ImageManager.loadEnemy(name, hue);

    this.resetTextColor();
    this.drawText(enemy.name, NAME_X, NAME_Y);

    const detailsWidth = 480;
    const x = this.contents.width - detailsWidth + settings.textOffsetX;
    const y = lineHeight + $gameSystem.windowPadding() + settings.textOffsetY;

    let lineCount = 0;

    settings.bountyInformations.forEach((info) => {
      if (enemy[info.tag]) {
        this.drawTextEx(
          info.text ? `${info.text}:${enemy[info.tag]}` : enemy[info.tag],
          x,
          y + lineHeight * lineCount,
          detailsWidth
        );
        lineCount++;
      }
    });
  }
}
