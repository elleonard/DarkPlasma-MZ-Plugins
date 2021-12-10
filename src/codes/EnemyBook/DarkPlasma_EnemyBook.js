import { Scene_BookLayoutMixIn } from '../../common/scene/bookLayoutMixIn';
import { LabelAndValueText } from '../../common/object/labelAndValueText';
import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_EnemyBook_parameters';
import { Window_LabelAndValueTexts } from '../../common/window/labelAndValueTextsWindow';

const STATUS_NAMES = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

const PLUGIN_COMMAND_NAME = {
  OPEN: 'open enemyBook',
  ADD: 'add to enemyBook',
  REMOVE: 'remove from enemyBook',
  COMPLETE: 'complete enemyBook',
  CLEAR: 'clear enemyBook',
};

const DROP_RATE_FORMAT = {
  PERCENT: 0,
  FRACTION: 1,
};

/**
 * 図鑑登録可能かどうか
 * @param {MZ.Enemy} enemy エネミーデータ
 * @return {boolean}
 */
function isRegisterableEnemy(enemy) {
  return enemy && enemy.name && enemy.meta.book !== 'no';
}

/**
 * 図鑑登録可能なエネミー一覧
 * @return {MZ.Enemy[]}
 */
function registerableEnemies() {
  return $dataEnemies.filter((enemy) => isRegisterableEnemy(enemy));
}

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.OPEN, function () {
  SceneManager.push(Scene_EnemyBook);
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.ADD, function (args) {
  $gameSystem.addToEnemyBook(Number(args.id));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.REMOVE, function (args) {
  $gameSystem.removeFromEnemyBook(Number(args.id));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.COMPLETE, function () {
  $gameSystem.completeEnemyBook();
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR, function () {
  $gameSystem.clearEnemyBook();
});

class EnemyBook {
  /**
   * @param {EnemyBookPage[]} pages ページ一覧
   */
  constructor(pages) {
    this._pages = pages;
  }

  /**
   * 初期状態（何も登録されていない）図鑑を返す
   * @return {EnemyBook}
   */
  static initialBook() {
    return new EnemyBook(
      $dataEnemies.map((enemy) => {
        return isRegisterableEnemy(enemy)
          ? new EnemyBookPage(
              false,
              enemy.dropItems.map((_) => false)
            )
          : null;
      })
    );
  }

  flexPage() {
    /**
     * エネミーが増減していた場合、ページ数をあわせる
     * 減った場合、溢れたデータは捨てられる
     */
    if (this._pages.length < $dataEnemies.length) {
      this._pages = this._pages.concat(
        $dataEnemies.slice(this._pages.length).map((enemy) => {
          return isRegisterableEnemy(enemy)
            ? new EnemyBookPage(
                false,
                enemy.dropItems.map((_) => false)
              )
            : null;
        })
      );
    } else if (this._pages.length > $dataEnemies.length) {
      this._pages = this._pages.slice(0, $dataEnemies.length - 1);
    }
    /**
     * 登録不可から登録可能に変更された場合
     * 計算量的に微妙だが、セーブデータロード時に一度だけ実行されるところなので許容する
     * 逆パターンはどうせ表示されないので放置する
     */
    $dataEnemies
      .filter((enemy) => isRegisterableEnemy(enemy) && this._pages[enemy.id] === null)
      .forEach(
        (enemy) =>
          (this._pages[enemy.id] = new EnemyBookPage(
            false,
            enemy.dropItems.map((_) => false)
          ))
      );
  }

  /**
   * エネミー登録率を百分率で返す
   * @return {number}
   */
  percentRegisteredEnemy() {
    const registerableEnemyCount = registerableEnemies().length;
    if (registerableEnemyCount === 0) {
      return 0;
    }
    const registeredEnemyCount = this._pages.filter((page, enemyId) => {
      return page && $dataEnemies[enemyId] && isRegisterableEnemy($dataEnemies[enemyId]) && page.isRegistered;
    }).length;
    return (100 * registeredEnemyCount) / registerableEnemyCount;
  }

  /**
   * ドロップアイテム登録率を百分率で返す
   * @return {number}
   */
  percentRegisteredDropItem() {
    const registerableDropItemCount = registerableEnemies().reduce(
      (previous, current) => previous + current.dropItems.filter((dropItem) => dropItem.kind > 0).length,
      0
    );
    if (registerableDropItemCount === 0) {
      return 0;
    }
    const registeredDropItemCount = this._pages
      .filter((page) => page && page.isRegistered)
      .reduce((previous, page, enemyId) => {
        if (!page || !$dataEnemies[enemyId] || !isRegisterableEnemy($dataEnemies[enemyId])) {
          return previous;
        }
        return previous + page.registeredDropItemCount($dataEnemies[enemyId]);
      }, 0);
    return (100 * registeredDropItemCount) / registerableDropItemCount;
  }

  /**
   * 登録済みかどうか
   * @param {MZ.Enemy} enemy 敵データ
   */
  isRegistered(enemy) {
    if (enemy && this._pages[enemy.id]) {
      return this._pages[enemy.id].isRegistered;
    }
    return false;
  }

  /**
   * ドロップアイテムが登録済みかどうか
   * @param {MZ.Enemy} enemy 敵データ
   * @param {number} index ドロップアイテム番号
   */
  isDropItemRegistered(enemy, index) {
    if (enemy && this._pages[enemy.id]) {
      return this._pages[enemy.id].isDropItemRegistered(index);
    }
    return false;
  }

  /**
   * 図鑑に指定したエネミーを登録する
   * @param {number} enemyId 敵ID
   */
  register(enemyId) {
    if (this._pages[enemyId]) {
      this._pages[enemyId].register();
    }
  }

  /**
   * 図鑑に指定したエネミーのドロップアイテムを登録する
   * @param {number} enemyId 敵ID
   * @param {number} index ドロップアイテム番号
   */
  registerDropItem(enemyId, index) {
    if (this._pages[enemyId]) {
      this._pages[enemyId].registerDropItem(index);
    }
  }

  /**
   * 図鑑から指定したエネミーを登録解除する
   * @param {number} enemyId 敵ID
   */
  unregister(enemyId) {
    if (this._pages[enemyId]) {
      this._pages[enemyId].unregister();
    }
  }

  /**
   * 図鑑を完成させる
   */
  complete() {
    registerableEnemies().forEach((enemy) => {
      this.register(enemy.id);
      enemy.dropItems.forEach((dropItem, index) => {
        if (dropItem.kind > 0) {
          this.registerDropItem(enemy.id, index);
        }
      });
    });
  }

  /**
   * 図鑑を白紙に戻す
   */
  clear() {
    this._pages.filter((page) => page).forEach((page) => page.unregister());
  }
}

class EnemyBookPage {
  /**
   * @param {boolean} isRegistered 登録フラグ
   * @param {boolean[]} dropItems ドロップアイテムごとに登録フラグ
   */
  constructor(isRegistered, dropItems) {
    this._isRegistered = isRegistered;
    this._dropItems = dropItems;
  }

  get isRegistered() {
    return this._isRegistered;
  }

  isDropItemRegistered(index) {
    return this._dropItems[index];
  }

  /**
   * @param {MZ.Enemy} enemy
   * @return {boolean}
   */
  registeredDropItemCount(enemy) {
    return this._dropItems.filter((dropItem, index) => dropItem && enemy.dropItems[index].kind > 0).length;
  }

  register() {
    this._isRegistered = true;
  }

  registerDropItem(index) {
    this._dropItems[index] = true;
  }

  unregister() {
    this._isRegistered = false;
    this._dropItems = this._dropItems.map((_) => false);
  }
}

window[EnemyBook.name] = EnemyBook;
window[EnemyBookPage.name] = EnemyBookPage;

/**
 * 敵図鑑情報
 * Game_Systemからのみ直接アクセスされる
 * @type {EnemyBook}
 */
let enemyBook = null;

/**
 * エネミー図鑑シーン
 */
class Scene_EnemyBook extends Scene_BookLayoutMixIn(Scene_MenuBase) {
  create() {
    super.create();
    this.createEnemyBookWindows();
  }

  createEnemyBookWindows() {
    this._enemyBookWindows = new EnemyBookWindows(
      this.popScene.bind(this),
      this._windowLayer,
      this.percentWindowRect(),
      this.indexWindowRect(),
      this.mainWindowRect(),
      false
    );
  }
}

window[Scene_EnemyBook.name] = Scene_EnemyBook;

class EnemyBookWindows {
  /**
   * @param {function} cancelHandler キャンセル時の挙動
   * @param {WindowLayer} parentLayer 親レイヤー
   * @param {Rectangle} percentWindowRect
   * @param {Rectangle} indexWindowRect
   * @param {Rectangle} statusWindowRect
   * @param {boolean} isInBattle
   */
  constructor(cancelHandler, parentLayer, percentWindowRect, indexWindowRect, statusWindowRect, isInBattle) {
    this._isInBattle = isInBattle;
    this._percentWindow = new Window_EnemyBookPercent(percentWindowRect);
    this._indexWindow = new Window_EnemyBookIndex(indexWindowRect, isInBattle);
    this._indexWindow.setHandler('cancel', cancelHandler);
    this._statusWindow = new Window_EnemyBookStatus(statusWindowRect);
    parentLayer.addChild(this._percentWindow);
    parentLayer.addChild(this._indexWindow);
    parentLayer.addChild(this._statusWindow);
    this._indexWindow.setStatusWindow(this._statusWindow);
  }

  close() {
    this._percentWindow.hide();
    this._indexWindow.hide();
    this._indexWindow.deactivate();
    this._statusWindow.hide();
  }

  open() {
    this._percentWindow.show();
    this._indexWindow.show();
    this._indexWindow.activate();
    this._statusWindow.show();
  }

  isActive() {
    return this._indexWindow.active;
  }

  get indexWindow() {
    return this._indexWindow;
  }

  get statusWindow() {
    return this._statusWindow;
  }
}

/**
 * 登録率表示ウィンドウ
 */
class Window_EnemyBookPercent extends Window_LabelAndValueTexts {
  labelAndValueTexts() {
    return [
      new LabelAndValueText(settings.enemyPercentLabel, `${$gameSystem.percentCompleteEnemy().toFixed(1)}％`),
      new LabelAndValueText(settings.dropItemPercentLabel, `${$gameSystem.percentCompleteDrop()}％`),
    ];
  }
}

/**
 * エネミー図鑑目次
 */
class Window_EnemyBookIndex extends Window_Selectable {
  initialize(rect, isInBattle) {
    super.initialize(rect);
    this._isInBattle = isInBattle;
    this.refresh();
    if (this._isInBattle) {
      this._battlerEnemyIndexes = Array.from(
        new Set(
          $gameTroop
            .members()
            .map((gameEnemy) => this._list.indexOf(gameEnemy.enemy()))
            .filter((index) => index >= 0)
        )
      ).sort((a, b) => a - b);
      const firstIndex = this._battlerEnemyIndexes.length > 0 ? this._battlerEnemyIndexes[0] : null;
      if (firstIndex >= 0) {
        this.setTopRow(firstIndex);
        this.select(firstIndex);
      }
    } else {
      this.setTopRow(Window_EnemyBookIndex.lastTopRow);
      this.select(Window_EnemyBookIndex.lastIndex);
    }
    this.activate();
  }

  /**
   * @return {number}
   */
  maxCols() {
    return 1;
  }

  /**
   * @return {number}
   */
  maxItems() {
    return this._list ? this._list.length : 0;
  }

  /**
   * @param {Window_EnemyBookStatus} statusWindow ステータスウィンドウ
   */
  setStatusWindow(statusWindow) {
    this._statusWindow = statusWindow;
    this.updateStatus();
  }

  update() {
    super.update();
    this.updateStatus();
  }

  updateStatus() {
    if (this._statusWindow) {
      const enemy = this._list[this.index()];
      this._statusWindow.setEnemy(enemy);
    }
  }

  makeItemList() {
    if (this._list) {
      return;
    }
    this._list = registerableEnemies();
    if (this._isInBattle && settings.battlerEnemyToTop) {
      this._list = this._list
        .filter((enemy) => $gameTroop.members().some((gameEnemy) => gameEnemy.enemy() === enemy))
        .concat(this._list.filter((enemy) => $gameTroop.members().every((gameEnemy) => gameEnemy.enemy() !== enemy)));
    }
  }

  refresh() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
  }

  /**
   * @return {boolean}
   */
  isCurrentItemEnabled() {
    return this.isEnabled(this.index());
  }

  /**
   * @param {number} index インデックス
   * @return {boolean}
   */
  isEnabled(index) {
    const enemy = this._list[index];
    return $gameSystem.isInEnemyBook(enemy);
  }

  /**
   * @param {number} index インデックス
   */
  drawItem(index) {
    const enemy = this._list[index];
    const rect = this.itemRect(index);
    let name;
    if ($gameSystem.isInEnemyBook(enemy)) {
      if (this._isInBattle && $gameTroop.members().some((battlerEnemy) => battlerEnemy.enemyId() === enemy.id)) {
        this.changeTextColor(ColorManager.textColor(settings.highlightColor));
      }
      name = enemy.name;
    } else {
      this.changePaintOpacity(!settings.grayOutUnknown);
      name = settings.unknownData;
    }
    this.drawText(name, rect.x, rect.y, rect.width);
    this.changePaintOpacity(true);
    this.resetTextColor();
  }

  processHandling() {
    super.processHandling();
    if (this.active && $gameParty.inBattle() && Input.isTriggered(settings.openKeyInBattle)) {
      this.processCancel();
    }
  }

  processOk() {}

  processCancel() {
    super.processCancel();
    Window_EnemyBookIndex.lastTopRow = this.topRow();
    Window_EnemyBookIndex.lastIndex = this.index();
  }

  battlerEnemyIsInBook() {
    return this._battlerEnemyIndexes && this._battlerEnemyIndexes.length > 0;
  }

  cursorPagedown() {
    if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
      this.selectNextBattlerEnemy();
    } else {
      super.cursorPagedown();
    }
  }

  cursorPageup() {
    if (this.battlerEnemyIsInBook() && settings.skipToBattlerEnemy) {
      this.selectPreviousBattlerEnemy();
    } else {
      super.cursorPageup();
    }
  }

  selectNextBattlerEnemy() {
    const nextIndex = this._battlerEnemyIndexes.find((index) => index > this.index()) || this._battlerEnemyIndexes[0];
    this.smoothSelect(nextIndex);
  }

  selectPreviousBattlerEnemy() {
    const candidates = this._battlerEnemyIndexes.filter((index) => index < this.index());
    const prevIndex = candidates.length > 0 ? candidates.slice(-1)[0] : this._battlerEnemyIndexes.slice(-1)[0];
    this.smoothSelect(prevIndex);
  }
}

Window_EnemyBookIndex.lastTopRow = 0;
Window_EnemyBookIndex.lastIndex = 0;

window.Window_EnemyBookIndex = Window_EnemyBookIndex;

/**
 * 図鑑ステータスウィンドウ
 */
class Window_EnemyBookStatus extends Window_Base {
  initialize(rect) {
    super.initialize(rect);
    this._enemy = null;
    this.setupEnemySprite(this.width, this.height);
    this.refresh();
  }

  setupEnemySprite(width, height) {
    this._enemySprite = new Sprite();
    this._enemySprite.anchor.x = 0.5;
    this._enemySprite.anchor.y = 0.5;
    this._enemySprite.x = width / 4;
    this._enemySprite.y = height / 4 + this.lineHeight();
    this.addChildToBack(this._enemySprite);
  }

  contentsHeight() {
    const maxHeight = this.height;
    return maxHeight - this.itemPadding() * 2;
  }

  /**
   * @param {MZ.Enemy} enemy 敵キャラ情報
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
      let scale = 1;
      if (bitmapHeight > contentsHeight) {
        scale = contentsHeight / bitmapHeight;
      }
      this._enemySprite.scale.x = scale;
      this._enemySprite.scale.y = scale;
    }
  }

  refresh() {
    const enemy = this._enemy;
    this.contents.clear();

    if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
      this._enemySprite.bitmap = null;
      return;
    }

    const name = enemy.battlerName;
    const hue = enemy.battlerHue;
    let bitmap;
    if ($gameSystem.isSideView()) {
      bitmap = ImageManager.loadSvEnemy(name, hue);
    } else {
      bitmap = ImageManager.loadEnemy(name, hue);
    }
    this._enemySprite.bitmap = bitmap;
    this._enemySprite.setHue(enemy.battlerHue);

    this.resetTextColor();
    this.drawText(enemy.name, 0, 0);

    this.drawPage();
  }

  drawPage() {
    const enemy = this._enemy;
    const lineHeight = this.lineHeight();
    this.drawLevel(this.contentsWidth() / 2 + this.itemPadding() / 2, 0);
    this.drawStatus(this.contentsWidth() / 2 + this.itemPadding() / 2, lineHeight + this.itemPadding());

    this.drawExpAndGold(this.itemPadding(), lineHeight * 9 + this.itemPadding());

    const rewardsWidth = this.contentsWidth() / 2;
    const dropItemWidth = rewardsWidth;

    this.drawDropItems(0, lineHeight * 6 + this.itemPadding(), dropItemWidth);

    const weakAndResistWidth = this.contentsWidth() / 2;
    this._weakLines = 1;
    this._resistLines = 1;
    this.drawWeakElementsAndStates(0, lineHeight * 10 + this.itemPadding(), weakAndResistWidth);
    this.drawResistElementsAndStates(0, lineHeight * (11 + this._weakLines) + this.itemPadding(), weakAndResistWidth);
    if (settings.devideResistAndNoEffect) {
      this.drawNoEffectElementsAndStates(
        0,
        lineHeight * (12 + this._weakLines + this._resistLines) + this.itemPadding(),
        weakAndResistWidth
      );
    }

    const descWidth = 480;
    if (enemy.meta.desc1) {
      this.drawTextEx(enemy.meta.desc1, this.descriptionX(), this.descriptionY(), descWidth);
    }
    if (enemy.meta.desc2) {
      this.drawTextEx(enemy.meta.desc2, this.descriptionX(), this.descriptionY() + lineHeight, descWidth);
    }
  }

  /**
   * @return {number}
   */
  descriptionX() {
    return settings.devideResistAndNoEffect ? this.contentsWidth() / 2 + this.itemPadding() / 2 : 0;
  }

  /**
   * @return {number}
   */
  descriptionY() {
    return this.itemPadding() + this.lineHeight() * 14;
  }

  /**
   * レベルを描画する
   * @param {number} x X座標
   * @param {number} y Y座標
   */
  drawLevel(x, y) {
    const enemy = this._enemy;
    if (enemy.level) {
      this.changeTextColor(this.systemColor());
      this.drawText(`Lv.`, x, y, 160);
      this.resetTextColor();
      this.drawText(enemy.level, x + 160, y, 60, 'right');
    }
  }

  /**
   * ステータスを描画する
   * @param {number} x X座標
   * @param {number} y Y座標
   */
  drawStatus(x, y) {
    const lineHeight = this.lineHeight();
    const enemy = this._enemy;
    [...Array(8).keys()].forEach((i) => {
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(i), x, y, 160);
      this.resetTextColor();
      this.drawText(enemy.params[i], x + 160, y, 60, 'right');
      y += lineHeight;
    });
  }

  /**
   * 経験値とゴールドを描画する
   * @param {number} x X座標
   * @param {number} y Y座標
   */
  drawExpAndGold(x, y) {
    const enemy = this._enemy;
    this.resetTextColor();
    this.drawText(enemy.exp, x, y);
    x += this.textWidth(enemy.exp) + 6;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.expA, x, y);
    x += this.textWidth(TextManager.expA + '  ');

    this.resetTextColor();
    this.drawText(enemy.gold, x, y);
    x += this.textWidth(enemy.gold) + 6;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.currencyUnit, x, y);
  }

  /**
   * ドロップアイテムを描画する
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} rewardsWidth 報酬欄の横幅
   */
  drawDropItems(x, y, rewardsWidth) {
    const enemy = this._enemy;
    const lineHeight = this.lineHeight();
    const displayDropRate = settings.displayDropRate;
    enemy.dropItems.forEach((dropItems, index) => {
      if (dropItems.kind > 0) {
        const dropRateWidth = this.textWidth('0000000');
        if ($gameSystem.isInEnemyBookDrop(enemy, index)) {
          const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
          this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
          this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
        } else {
          this.changePaintOpacity(!settings.grayOutUnknown);
          if (settings.maskUnknownDropItem) {
            this.resetTextColor();
            this.drawText(settings.unknownData, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
          } else {
            const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
            this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
          }
          this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
          this.changePaintOpacity(true);
        }
        y += lineHeight;
      }
    });
  }

  /**
   * ドロップ率を描画する
   * @param {number} denominator 確率
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawDropRate(denominator, x, y, width) {
    if (!settings.displayDropRate || !denominator) {
      return;
    }
    const dropRate = Number(100 / denominator).toFixed(1);
    switch (settings.dropRateFormat) {
      case DROP_RATE_FORMAT.PERCENT:
        this.drawText(`${dropRate}％`, x, y, width, 'right');
        break;
      case DROP_RATE_FORMAT.FRACTION:
        this.drawText(`1/${denominator}`, x, y, width, 'right');
        break;
    }
  }

  /**
   * 指定した属性の有効度を返す
   * @param {number} elementId 属性ID
   * @return {number}
   */
  elementRate(elementId) {
    return this._enemy.traits
      .filter((trait) => trait.code === Game_BattlerBase.TRAIT_ELEMENT_RATE && trait.dataId === elementId)
      .reduce((r, trait) => r * trait.value, 1);
  }

  /**
   * 指定したステートの有効度を返す
   * @param {number} stateId ステートID
   * @return {number}
   */
  stateRate(stateId) {
    const isNoEffect = this._enemy.traits.find(
      (trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RESIST && trait.dataId === stateId
    );
    if (isNoEffect) {
      return 0;
    }
    return this._enemy.traits
      .filter((trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RATE && trait.dataId === stateId)
      .reduce((r, trait) => r * trait.value, 1);
  }

  /**
   * 指定したステータスの弱体有効度を返す
   * @param {number} statusId ステータスID
   * @return {number}
   */
  debuffRate(statusId) {
    return (
      this._enemy.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_DEBUFF_RATE && trait.dataId === statusId)
        .reduce((r, trait) => r * trait.value, 1) * 100
    );
  }

  maxIconsPerLine() {
    return 16;
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawWeakElementsAndStates(x, y, width) {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => this.elementRate(elementId) > 1)
      .map((elementId) => settings.elementIcons[elementId])
      .concat(
        $dataStates
          .filter((state) => state && this.stateRate(state.id) > 1 && !this.isExcludedWeakState(state.id))
          .map((state) => state.iconIndex)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          return settings.displayDebuffStatus && this.debuffRate(index) > settings.debuffStatusThreshold.weak.large;
        }).map((statusName) => settings.debuffStatusIcons[statusName].large)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          const debuffRate = this.debuffRate(index);
          return (
            settings.displayDebuffStatus &&
            debuffRate <= settings.debuffStatusThreshold.weak.large &&
            debuffRate > settings.debuffStatusThreshold.weak.small
          );
        }).map((statusName) => settings.debuffStatusIcons[statusName].small)
      );
    this.changeTextColor(this.systemColor());
    this.drawText(settings.weakElementAndStateLabel, x, y, width);

    const iconBaseY = y + this.lineHeight();
    targetIcons.forEach((icon, index) => {
      this.drawIcon(
        icon,
        x + 32 * (index % this.maxIconsPerLine()),
        iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
      );
    });
    this._weakLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
  }

  /**
   * 弱点に表示しないステートかどうか
   * @param {number} stateId ステートID
   * @return {boolean}
   */
  isExcludedWeakState(stateId) {
    return settings.excludeWeakStates.includes(stateId);
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawResistElementsAndStates(x, y, width) {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => {
        const elementRate = this.elementRate(elementId);
        return elementRate < 1 && (!settings.devideResistAndNoEffect || elementRate > 0);
      })
      .map((elementId) => settings.elementIcons[elementId])
      .concat(
        $dataStates
          .filter((state) => {
            if (!state) {
              return false;
            }
            const stateRate = this.stateRate(state.id);
            return (
              stateRate < 1 &&
              !this.isExcludedResistState(state.id) &&
              (!settings.devideResistAndNoEffect || stateRate > 0)
            );
          })
          .map((state) => state.iconIndex)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          const debuffRate = this.debuffRate(index);
          return (
            settings.displayDebuffStatus &&
            debuffRate < settings.debuffStatusThreshold.resist.large &&
            (!settings.devideResistAndNoEffect || debuffRate > 0)
          );
        }).map((statusName) => settings.debuffStatusIcons[statusName].large)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          const debuffRate = this.debuffRate(index);
          return (
            settings.displayDebuffStatus &&
            debuffRate >= settings.debuffStatusThreshold.resist.large &&
            debuffRate < settings.debuffStatusThreshold.resist.small
          );
        }).map((statusName) => settings.debuffStatusIcons[statusName].small)
      );
    this.changeTextColor(this.systemColor());
    this.drawText(settings.resistElementAndStateLabel, x, y, width);

    const iconBaseY = y + this.lineHeight();
    targetIcons.forEach((icon, index) => {
      this.drawIcon(
        icon,
        x + 32 * (index % this.maxIconsPerLine()),
        iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
      );
    });
    this._resistLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   */
  drawNoEffectsLabel(x, y, width) {
    this.changeTextColor(this.systemColor());
    this.drawText(settings.noEffectElementAndStateLabel, x, y, width);
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawNoEffectElementsAndStates(x, y, width) {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => this.elementRate(elementId) <= 0)
      .map((elementId) => settings.elementIcons[elementId])
      .concat(
        $dataStates
          .filter((state) => state && this.stateRate(state.id) <= 0 && !this.isExcludedResistState(state.id))
          .map((state) => state.iconIndex)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          return settings.displayDebuffStatus && this.debuffRate(index) <= 0;
        }).map((statusName) => settings.debuffStatusIcons[statusName].large)
      );
    this.drawNoEffectsLabel(x, y, width);

    const iconBaseY = y + this.lineHeight();
    targetIcons.forEach((icon, index) => {
      this.drawIcon(
        icon,
        x + 32 * (index % this.maxIconsPerLine()),
        iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
      );
    });
  }

  /**
   * 耐性リストに表示しないステートかどうか
   * @param {number} stateId ステートID
   * @return {boolean}
   */
  isExcludedResistState(stateId) {
    return settings.excludeResistStates.includes(stateId);
  }
}

window[Window_EnemyBookStatus.name] = Window_EnemyBookStatus;

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
  _Game_System_initialize.call(this);
  enemyBook = EnemyBook.initialBook();
};

const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function () {
  _Game_System_onBeforeSave.call(this);
  this._enemyBook = enemyBook;
};

const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function () {
  _Game_System_onAfterLoad.call(this);
  if (this._enemyBook) {
    enemyBook = this._enemyBook;
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
      enemyBook.flexPage();
    }
  } else {
    enemyBook = EnemyBook.initialBook();
  }
};

Game_System.prototype.addToEnemyBook = function (enemyId) {
  enemyBook.register(enemyId);
};

Game_System.prototype.addDropItemToEnemyBook = function (enemyId, dropIndex) {
  enemyBook.registerDropItem(enemyId, dropIndex);
};

Game_System.prototype.removeFromEnemyBook = function (enemyId) {
  enemyBook.unregister(enemyId);
};

Game_System.prototype.completeEnemyBook = function () {
  enemyBook.complete();
};

Game_System.prototype.clearEnemyBook = function () {
  enemyBook.clear();
};

Game_System.prototype.isInEnemyBook = function (enemy) {
  return enemyBook.isRegistered(enemy);
};

Game_System.prototype.isInEnemyBookDrop = function (enemy, dropIndex) {
  return enemyBook.isDropItemRegistered(enemy, dropIndex);
};

Game_System.prototype.percentCompleteEnemy = function () {
  return enemyBook.percentRegisteredEnemy();
};

Game_System.prototype.percentCompleteDrop = function () {
  return enemyBook.percentRegisteredDropItem();
};

const _Game_Troop_setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function (troopId) {
  _Game_Troop_setup.call(this, troopId);
  this.members().forEach(function (enemy) {
    if (enemy.isAppeared()) {
      $gameSystem.addToEnemyBook(enemy.enemyId());
    }
  }, this);
};

const _Game_Enemy_appear = Game_Enemy.prototype.appear;
Game_Enemy.prototype.appear = function () {
  _Game_Enemy_appear.call(this);
  $gameSystem.addToEnemyBook(this._enemyId);
};

const _Game_Enemy_transform = Game_Enemy.prototype.transform;
Game_Enemy.prototype.transform = function (enemyId) {
  _Game_Enemy_transform.call(this, enemyId);
  $gameSystem.addToEnemyBook(enemyId);
};

Game_Enemy.prototype.dropItemLots = function (dropItem) {
  return dropItem.kind > 0 && Math.random() * dropItem.denominator < this.dropItemRate();
};

/**
 * ドロップアイテムリスト生成メソッド 上書き
 */
Game_Enemy.prototype.makeDropItems = function () {
  return this.enemy().dropItems.reduce((accumlator, dropItem, index) => {
    if (this.dropItemLots(dropItem)) {
      $gameSystem.addDropItemToEnemyBook(this.enemy().id, index);
      return accumlator.concat(this.itemObject(dropItem.kind, dropItem.dataId));
    } else {
      return accumlator;
    }
  }, []);
};

const _Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
Scene_Battle.prototype.createWindowLayer = function () {
  _Scene_Battle_createWindowLayer.call(this);
  if (settings.enableInBattle) {
    this._enemyBookLayer = new WindowLayer();
    this.addChild(this._enemyBookLayer);
  }
};

const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
  _Scene_Battle_createAllWindows.call(this);
  if (settings.enableInBattle) {
    this.createEnemyBookWindows();
  }
};

const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function () {
  _Scene_Battle_createPartyCommandWindow.call(this);
  if (settings.enableInBattle) {
    this._partyCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
  }
};

const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function () {
  _Scene_Battle_createActorCommandWindow.call(this);
  if (settings.enableInBattle) {
    this._actorCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
  }
};

const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function () {
  return (
    _Scene_Battle_isAnyInputWindowActive.call(this) || (settings.enableInBattle && this._enemyBookWindows.isActive())
  );
};

Scene_Battle.prototype.inputtingWindow = function () {
  return this.inputWindows().find((inputWindow) => inputWindow.active);
};

Scene_Battle.prototype.inputWindows = function () {
  return [
    this._partyCommandWindow,
    this._actorCommandWindow,
    this._skillWindow,
    this._itemWindow,
    this._actorWindow,
    this._enemyWindow,
    this._enemyBookWindows.indexWindow,
  ];
};

Scene_Battle.prototype.createEnemyBookWindows = function () {
  this._enemyBookWindows = new EnemyBookWindows(
    this.closeEnemyBook.bind(this),
    this._enemyBookLayer,
    Scene_EnemyBook.prototype.percentWindowRect.call(this),
    Scene_EnemyBook.prototype.indexWindowRect.call(this),
    Scene_EnemyBook.prototype.mainWindowRect.call(this),
    true
  );
  this.closeEnemyBook();
};

Scene_Battle.prototype.percentWindowHeight = function () {
  return Scene_EnemyBook.prototype.percentWindowHeight.call(this);
};

Scene_Battle.prototype.indexWindowWidth = function () {
  return Scene_EnemyBook.prototype.indexWindowWidth.call(this);
};

Scene_Battle.prototype.indexWindowHeight = function () {
  return Scene_EnemyBook.prototype.indexWindowHeight.call(this);
};

Scene_Battle.prototype.closeEnemyBook = function () {
  this._enemyBookWindows.close();
  if (this._returnFromEnemyBook) {
    this._returnFromEnemyBook.activate();
    this._returnFromEnemyBook = null;
  }
};

Scene_Battle.prototype.openEnemyBook = function () {
  this._returnFromEnemyBook = this.inputtingWindow();
  if (this._returnFromEnemyBook) {
    this._returnFromEnemyBook.deactivate();
  }
  this._enemyBookWindows.open();
};

const _Window_PartyCommand_processHandling = Window_PartyCommand.prototype.processHandling;
Window_PartyCommand.prototype.processHandling = function () {
  _Window_PartyCommand_processHandling.call(this);
  if (this.isOpenAndActive()) {
    if (Input.isTriggered(settings.openKeyInBattle)) {
      this.processEnemyBook();
    }
  }
};

const _Window_ActorCommand_processHandling = Window_ActorCommand.prototype.processHandling;
Window_ActorCommand.prototype.processHandling = function () {
  _Window_ActorCommand_processHandling.call(this);
  if (this.isOpenAndActive()) {
    if (Input.isTriggered(settings.openKeyInBattle)) {
      this.processEnemyBook();
    }
  }
};

Window_Command.prototype.processEnemyBook = function () {
  SoundManager.playCursor();
  this.updateInputData();
  this.callHandler('enemyBook');
};
