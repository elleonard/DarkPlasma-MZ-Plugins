/// <reference path="./EnemyBook.d.ts" />
import { Scene_BookLayoutMixIn } from '../../../common/scene/bookLayoutMixIn';
import { LabelAndValueText } from '../../../common/object/labelAndValueText';
import { pluginName } from './../../../common/pluginName';
import { settings } from './../config/_build/DarkPlasma_EnemyBook_parameters';
import { Window_LabelAndValueTexts } from '../../../common/window/labelAndValueTextsWindow';
import { orderIdSort } from '../../../common/orderIdSort';

const STATUS_NAMES: ('mhp'|'mmp'|'atk'|'def'|'mat'|'mdf'|'agi'|'luk')[] = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

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
function isRegisterableEnemy(enemy: MZ.Enemy): boolean {
  return !!enemy && !!enemy.name && enemy.meta.book !== 'no';
}

/**
 * 図鑑登録可能なエネミー一覧
 * @return {MZ.Enemy[]}
 */
function registerableEnemies(): MZ.Enemy[] {
  return $dataEnemies.filter((enemy) => isRegisterableEnemy(enemy)).sort(orderIdSort);
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
  _pages: (EnemyBookPage|null)[];
  /**
   * @param {EnemyBookPage[]} pages ページ一覧
   */
  constructor(pages: (EnemyBookPage|null)[]) {
    this._pages = pages;
  }

  /**
   * 初期状態（何も登録されていない）図鑑を返す
   * @return {EnemyBook}
   */
  static initialBook(): EnemyBook {
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

  flexPage(): void {
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
   */
  percentRegisteredEnemy(): number {
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
   */
  percentRegisteredDropItem(): number {
    const registerableDropItemCount = registerableEnemies().reduce(
      (previous, current) => previous + current.dropItems.filter((dropItem) => dropItem.kind > 0).length,
      0
    );
    if (registerableDropItemCount === 0) {
      return 0;
    }
    const registeredDropItemCount = this._pages.reduce((previous, page, enemyId) => {
      if (!page || !page.isRegistered || !$dataEnemies[enemyId] || !isRegisterableEnemy($dataEnemies[enemyId])) {
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
  isRegistered(enemy: MZ.Enemy): boolean {
    if (enemy && this._pages[enemy.id]) {
      return this._pages[enemy.id]!.isRegistered;
    }
    return false;
  }

  /**
   * ドロップアイテムが登録済みかどうか
   * @param {MZ.Enemy} enemy 敵データ
   * @param {number} index ドロップアイテム番号
   */
  isDropItemRegistered(enemy: MZ.Enemy, index: number) {
    if (enemy && this._pages[enemy.id]) {
      return this._pages[enemy.id]!.isDropItemRegistered(index);
    }
    return false;
  }

  /**
   * 図鑑に指定したエネミーを登録する
   */
  register(enemyId: number): void {
    if (this._pages[enemyId]) {
      this._pages[enemyId]!.register();
    }
  }

  /**
   * 図鑑に指定したエネミーのドロップアイテムを登録する
   */
  registerDropItem(enemyId: number, index: number): void {
    if (this._pages[enemyId]) {
      this._pages[enemyId]!.registerDropItem(index);
    }
  }

  /**
   * 図鑑から指定したエネミーを登録解除する
   */
  unregister(enemyId: number): void {
    if (this._pages[enemyId]) {
      this._pages[enemyId]!.unregister();
    }
  }

  /**
   * 図鑑を完成させる
   */
  complete(): void {
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
  clear(): void {
    this._pages.filter((page) => page).forEach((page) => page!.unregister());
  }
}

class EnemyBookPage {
  _isRegistered: boolean;
  _dropItems: boolean[];
  /**
   * @param {boolean} isRegistered 登録フラグ
   * @param {boolean[]} dropItems ドロップアイテムごとに登録フラグ
   */
  constructor(isRegistered: boolean, dropItems: boolean[]) {
    this._isRegistered = isRegistered;
    this._dropItems = dropItems;
  }

  get isRegistered() {
    return this._isRegistered;
  }

  isDropItemRegistered(index: number): boolean {
    return this._dropItems[index];
  }

  registeredDropItemCount(enemy: MZ.Enemy): number {
    return this._dropItems.filter((dropItem, index) => dropItem && enemy.dropItems[index].kind > 0).length;
  }

  register(): void {
    this._isRegistered = true;
  }

  registerDropItem(index: number): void {
    this._dropItems[index] = true;
  }

  unregister(): void {
    this._isRegistered = false;
    this._dropItems = this._dropItems.map((_) => false);
  }
}

/**
 * 敵図鑑情報
 * Game_Systemからのみ直接アクセスされる
 */
let enemyBook: EnemyBook|null = null;

function enemyBookInstance(): EnemyBook {
  if (!enemyBook) {
    enemyBook = EnemyBook.initialBook();
  }
  return enemyBook;
}

/**
 * エネミー図鑑シーン
 */
class Scene_EnemyBook extends Scene_BookLayoutMixIn(Scene_MenuBase) {
  _enemyBookWindows: EnemyBookWindows;
  create(): void {
    super.create();
    this.createEnemyBookWindows();
  }

  createEnemyBookWindows(): void {
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

class EnemyBookWindows {
  _isInBattle: boolean;
  _percentWindow: Window_EnemyBookPercent;
  _indexWindow: Window_EnemyBookIndex;
  _statusWindow: Window_EnemyBookStatus;
  /**
   * @param {function} cancelHandler キャンセル時の挙動
   * @param {WindowLayer} parentLayer 親レイヤー
   * @param {Rectangle} percentWindowRect
   * @param {Rectangle} indexWindowRect
   * @param {Rectangle} statusWindowRect
   * @param {boolean} isInBattle
   */
  constructor(
    cancelHandler: () => void,
    parentLayer: WindowLayer,
    percentWindowRect: Rectangle,
    indexWindowRect: Rectangle,
    statusWindowRect: Rectangle,
    isInBattle: boolean
  ) {
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

  close(): void {
    this._percentWindow.hide();
    this._indexWindow.hide();
    this._indexWindow.deactivate();
    this._statusWindow.hide();
  }

  open(): void {
    this._percentWindow.show();
    this._indexWindow.show();
    this._indexWindow.activate();
    this._statusWindow.show();
  }

  isActive(): boolean {
    return this._indexWindow.active;
  }

  get indexWindow() {
    return this._indexWindow;
  }

  get statusWindow() {
    return this._statusWindow;
  }

  get percentWindow() {
    return this._percentWindow;
  }
}

/**
 * 登録率表示ウィンドウ
 */
class Window_EnemyBookPercent extends Window_LabelAndValueTexts {
  labelAndValueTexts() {
    return [
      new LabelAndValueText(settings.enemyPercentLabel, `${$gameSystem.percentCompleteEnemy().toFixed(1)}％`),
      new LabelAndValueText(settings.dropItemPercentLabel, `${$gameSystem.percentCompleteDrop().toFixed(1)}％`),
    ];
  }
}

/**
 * エネミー図鑑目次
 */
class Window_EnemyBookIndex extends Window_Selectable {
  _statusWindow: Window_EnemyBookStatus;

  _isInBattle: boolean;
  _list: MZ.Enemy[];

  static lastTopRow: number;
  static lastIndex: number;

  initialize(rect: Rectangle, isInBattle: boolean): void {
    super.initialize(rect);
    this._isInBattle = isInBattle;
    this.refresh();
    this.forcusOnFirst();
    this.activate();
  }

  forcusOnFirst(): void {
    this.setTopRow(Window_EnemyBookIndex.lastTopRow);
    this.select(Window_EnemyBookIndex.lastIndex);
  }

  /**
   * @return {number}
   */
  maxCols(): number {
    return 1;
  }

  /**
   * @return {number}
   */
  maxItems(): number {
    return this._list ? this._list.length : 0;
  }

  /**
   * @param {Window_EnemyBookStatus} statusWindow ステータスウィンドウ
   */
  setStatusWindow(statusWindow: Window_EnemyBookStatus): void {
    this._statusWindow = statusWindow;
    this.updateStatus();
  }

  update(): void {
    super.update();
    this.updateStatus();
  }

  updateStatus(): void {
    if (this._statusWindow) {
      const enemy = this._list[this.index()];
      this._statusWindow.setEnemy(enemy);
    }
  }

  makeItemList(): void {
    this._list = registerableEnemies();
  }

  refresh(): void {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
  }

  /**
   * @return {boolean}
   */
  isCurrentItemEnabled(): boolean {
    return this.isEnabled(this.index());
  }

  /**
   * @param {number} index インデックス
   * @return {boolean}
   */
  isEnabled(index: number): boolean {
    const enemy = this._list[index];
    return $gameSystem.isInEnemyBook(enemy);
  }

  /**
   * @param {number} index インデックス
   */
  drawItem(index: number): void {
    const enemy = this._list[index];
    const rect = this.itemRect(index);
    let name: string;
    if (this.mustHighlight(enemy)) {
      this.changeTextColor(this.highlightColorString(enemy));
    }
    if ($gameSystem.isInEnemyBook(enemy)) {
      name = enemy.name;
    } else {
      this.changePaintOpacity(!settings.grayOutUnknown);
      name = settings.unknownData;
    }
    this.drawText(name, rect.x, rect.y, rect.width);
    this.changePaintOpacity(true);
    this.resetTextColor();
  }

  /**
   * ハイライトすべきか
   * @param {MZ.Enemy} enemy
   * @return {boolean}
   */
  mustHighlight(enemy: MZ.Enemy): boolean {
    return false;
  }

  highlightColorString(enemy: MZ.Enemy): string {
    return typeof settings.highlightColor === "string"
      ? settings.highlightColor
      : ColorManager.textColor(settings.highlightColor);
  }

  processOk() {}

  processCancel() {
    super.processCancel();
    Window_EnemyBookIndex.lastTopRow = this.topRow();
    Window_EnemyBookIndex.lastIndex = this.index();
  }

  enemy(index: number): MZ.Enemy|undefined {
    return this._list[index];
  }

  currentEnemy(): MZ.Enemy|undefined {
    return this.enemy(this.index());
  }
}

Window_EnemyBookIndex.lastTopRow = 0;
Window_EnemyBookIndex.lastIndex = 0;

/**
 * 図鑑ステータスウィンドウ
 */
class Window_EnemyBookStatus extends Window_Base {
  _enemy: MZ.Enemy|null;
  _enemySprite: Sprite;

  _weakLines: number;
  _resistLines: number;
  initialize(rect: Rectangle): void {
    super.initialize(rect);
    this._enemy = null;
    this.setupEnemySprite();
    this.refresh();
  }

  setupEnemySprite(): void {
    this._enemySprite = new Sprite();
    this._enemySprite.anchor.x = 0.5;
    this._enemySprite.anchor.y = 0.5;
    this._enemySprite.x = settings.enemyImageView.x;
    this._enemySprite.y = settings.enemyImageView.y;
    this.addChildToBack(this._enemySprite);
  }

  contentsHeight(): number {
    const maxHeight = this.height;
    return maxHeight - this.itemPadding() * 2;
  }

  /**
   * @param {MZ.Enemy} enemy 敵キャラ情報
   */
  setEnemy(enemy: MZ.Enemy): void {
    if (this._enemy !== enemy) {
      this._enemy = enemy;
      this.refresh();
    }
  }

  update(): void {
    super.update();
    /**
     * データベースで拡大率が設定されていない場合は自動調整
     */
    if (this._enemySprite.bitmap && this._enemy && !this._enemy.meta.scaleInBook) {
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

  refresh(): void {
    const enemy = this._enemy;
    this.contents.clear();

    if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
      this._enemySprite.bitmap = null;
      return;
    }

    const name = enemy.battlerName;
    let bitmap;
    if ($gameSystem.isSideView()) {
      bitmap = ImageManager.loadSvEnemy(name);
    } else {
      bitmap = ImageManager.loadEnemy(name);
    }
    this._enemySprite.bitmap = bitmap;
    if (enemy.meta.scaleInBook) {
      const scale = Number(enemy.meta.scaleInBook);
      this._enemySprite.scale.x = scale / 100;
      this._enemySprite.scale.y = scale / 100;
    }
    this._enemySprite.setHue(enemy.battlerHue);

    this.resetTextColor();
    this.drawText(enemy.name, 0, 0, 0);

    this.drawPage();
  }

  drawPage(): void {
    const enemy = this._enemy!;
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

    if (enemy.meta.desc1) {
      this.drawTextEx(String(enemy.meta.desc1), this.descriptionX(), this.descriptionY());
    }
    if (enemy.meta.desc2) {
      this.drawTextEx(String(enemy.meta.desc2), this.descriptionX(), this.descriptionY() + lineHeight);
    }
  }

  descriptionX(): number {
    return settings.devideResistAndNoEffect ? this.contentsWidth() / 2 + this.itemPadding() / 2 : 0;
  }

  descriptionY(): number {
    return this.itemPadding() + this.lineHeight() * 14;
  }

  /**
   * レベルを描画する
   */
  drawLevel(x: number, y: number): void {
    const enemy = this._enemy;
    if (enemy && enemy.level) {
      this.changeTextColor(this.systemColor());
      this.drawText(`Lv.`, x, y, 160);
      this.resetTextColor();
      this.drawText(`${enemy.level}`, x + 160, y, 60, 'right');
    }
  }

  /**
   * ステータスを描画する
   */
  drawStatus(x: number, y: number): void {
    const lineHeight = this.lineHeight();
    const enemy = this._enemy!;
    [...Array(8).keys()].forEach((i) => {
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(i), x, y, 160);
      this.resetTextColor();
      this.drawText(`${enemy.params[i]}`, x + 160, y, 60, 'right');
      y += lineHeight;
    });
  }

  /**
   * 経験値とゴールドを描画する
   */
  drawExpAndGold(x: number, y: number): void {
    const enemy = this._enemy!;
    this.resetTextColor();
    this.drawText(`${enemy.exp}`, x, y, 0);
    x += this.textWidth(`${enemy.exp}`) + 6;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.expA, x, y, 0);
    x += this.textWidth(TextManager.expA + '  ');

    this.resetTextColor();
    this.drawText(`${enemy.gold}`, x, y, 0);
    x += this.textWidth(`${enemy.gold}`) + 6;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.currencyUnit, x, y, 0);
  }

  /**
   * ドロップアイテムを描画する
   */
  drawDropItems(x: number, y: number, rewardsWidth: number): void {
    const enemy = this._enemy!;
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
   */
  drawDropRate(denominator: number, x: number, y: number, width: number): void {
    if (!settings.displayDropRate || !denominator) {
      return;
    }
    switch (settings.dropRateFormat) {
      case DROP_RATE_FORMAT.PERCENT:
        const dropRate = Number(100 / denominator).toFixed(1);
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
  elementRate(elementId: number): number {
    return this._enemy!.traits
      .filter((trait) => trait.code === Game_BattlerBase.TRAIT_ELEMENT_RATE && trait.dataId === elementId)
      .reduce((r, trait) => r * trait.value, 1);
  }

  /**
   * 指定したステートの有効度を返す
   * @param {number} stateId ステートID
   * @return {number}
   */
  stateRate(stateId: number): number {
    const isNoEffect = this._enemy!.traits.find(
      (trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RESIST && trait.dataId === stateId
    );
    if (isNoEffect) {
      return 0;
    }
    return this._enemy!.traits
      .filter((trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RATE && trait.dataId === stateId)
      .reduce((r, trait) => r * trait.value, 1);
  }

  /**
   * 指定したステータスの弱体有効度を返す
   * @param {number} statusId ステータスID
   * @return {number}
   */
  debuffRate(statusId: number): number {
    return (
      this._enemy!.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_DEBUFF_RATE && trait.dataId === statusId)
        .reduce((r, trait) => r * trait.value, 1) * 100
    );
  }

  maxIconsPerLine(): number {
    return 16;
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawWeakElementsAndStates(x: number, y: number, width: number): void {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => this.elementRate(elementId) > 1)
      .map((elementId) => $gameSystem.elementIconIndex(elementId))
      .concat(
        $dataStates
          .filter((state) => state && this.stateRate(state.id) > 1 && !this.isExcludedWeakState(state.id))
          .map((state) => state.iconIndex)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          return settings.displayDebuffStatus && this.debuffRate(index) > settings.debuffStatusThreshold.weak.large;
        }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName))
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          const debuffRate = this.debuffRate(index);
          return (
            settings.displayDebuffStatus &&
            debuffRate <= settings.debuffStatusThreshold.weak.large &&
            debuffRate > settings.debuffStatusThreshold.weak.small
          );
        }).map((statusName) => $gameSystem.smallDebuffStatusIconIndex(statusName))
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
  isExcludedWeakState(stateId: number): boolean {
    return settings.excludeWeakStates.includes(stateId);
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawResistElementsAndStates(x: number, y: number, width: number): void {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => {
        const elementRate = this.elementRate(elementId);
        return elementRate < 1 && (!settings.devideResistAndNoEffect || elementRate > 0);
      })
      .map((elementId) => $gameSystem.elementIconIndex(elementId))
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
        }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName))
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          const debuffRate = this.debuffRate(index);
          return (
            settings.displayDebuffStatus &&
            debuffRate >= settings.debuffStatusThreshold.resist.large &&
            debuffRate < settings.debuffStatusThreshold.resist.small
          );
        }).map((statusName) => $gameSystem.smallDebuffStatusIconIndex(statusName))
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
  drawNoEffectsLabel(x: number, y: number, width: number): void {
    this.changeTextColor(this.systemColor());
    this.drawText(settings.noEffectElementAndStateLabel, x, y, width);
  }

  /**
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 横幅
   */
  drawNoEffectElementsAndStates(x: number, y: number, width: number): void {
    const targetIcons = $dataSystem.elements
      .map((_, index) => index)
      .filter((elementId) => this.elementRate(elementId) <= 0)
      .map((elementId) => $gameSystem.elementIconIndex(elementId))
      .concat(
        $dataStates
          .filter((state) => state && this.stateRate(state.id) <= 0 && !this.isExcludedResistState(state.id))
          .map((state) => state.iconIndex)
      )
      .concat(
        STATUS_NAMES.filter((_, index) => {
          return settings.displayDebuffStatus && this.debuffRate(index) <= 0;
        }).map((statusName) => $gameSystem.largeDebuffStatusIconIndex(statusName))
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
  isExcludedResistState(stateId: number): boolean {
    return settings.excludeResistStates.includes(stateId);
  }
}

function Game_System_EnemyBookMixIn(gameSystem: Game_System) {
  const _initialize = gameSystem.initialize;
  gameSystem.initialize = function () {
    _initialize.call(this);
    enemyBook = EnemyBook.initialBook();
    this._enemyBook = enemyBookInstance();
  };
  
  const _Game_System_onAfterLoad = gameSystem.onAfterLoad;
  gameSystem.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (this._enemyBook) {
      enemyBook = this._enemyBook;
      if ($gameSystem.versionId() !== $dataSystem.versionId) {
        enemyBookInstance().flexPage();
      }
    } else {
      enemyBook = EnemyBook.initialBook();
      this._enemyBook = enemyBookInstance();
    }
  };
  
  gameSystem.addToEnemyBook = function (enemyId) {
    enemyBookInstance().register(enemyId);
  };
  
  gameSystem.addDropItemToEnemyBook = function (enemyId, dropIndex) {
    enemyBookInstance().registerDropItem(enemyId, dropIndex);
  };
  
  gameSystem.removeFromEnemyBook = function (enemyId) {
    enemyBookInstance().unregister(enemyId);
  };
  
  gameSystem.completeEnemyBook = function () {
    enemyBookInstance().complete();
  };
  
  gameSystem.clearEnemyBook = function () {
    enemyBookInstance().clear();
  };
  
  gameSystem.isInEnemyBook = function (enemy) {
    return enemyBookInstance().isRegistered(enemy);
  };
  
  gameSystem.isInEnemyBookDrop = function (enemy, dropIndex) {
    return enemyBookInstance().isDropItemRegistered(enemy, dropIndex);
  };
  
  gameSystem.percentCompleteEnemy = function () {
    return enemyBookInstance().percentRegisteredEnemy();
  };
  
  gameSystem.percentCompleteDrop = function () {
    return enemyBookInstance().percentRegisteredDropItem();
  };
}

Game_System_EnemyBookMixIn(Game_System.prototype);

function Game_Troop_EnemyBookMixIn(gameTroop: Game_Troop) {
  const _setup = gameTroop.setup;
  gameTroop.setup = function (troopId) {
    _setup.call(this, troopId);
    this.members().forEach(function (enemy) {
      if (enemy.isAppeared()) {
        $gameSystem.addToEnemyBook(enemy.enemyId());
      }
    }, this);
  };
}

Game_Troop_EnemyBookMixIn(Game_Troop.prototype);

function Game_Enemy_EnemyBookMixIn(gameEnemy: Game_Enemy) {
  const _appear = gameEnemy.appear;
  gameEnemy.appear = function () {
    _appear.call(this);
    $gameSystem.addToEnemyBook(this._enemyId);
  };
  
  const _transform = gameEnemy.transform;
  gameEnemy.transform = function (enemyId) {
    _transform.call(this, enemyId);
    $gameSystem.addToEnemyBook(enemyId);
  };
  
  gameEnemy.dropItemLots = function (dropItem) {
    return dropItem.kind > 0 && Math.random() * dropItem.denominator < this.dropItemRate();
  };
  
  /**
   * ドロップアイテムリスト生成メソッド 上書き
   */
  gameEnemy.makeDropItems = function () {
    return this.enemy().dropItems.reduce((accumlator: (MZ.Item|MZ.Weapon|MZ.Armor)[], dropItem, index) => {
      const dropItemObject = this.itemObject(dropItem.kind, dropItem.dataId);
      if (dropItemObject && this.dropItemLots(dropItem)) {
        $gameSystem.addDropItemToEnemyBook(this.enemy().id, index);
        return accumlator.concat(dropItemObject);
      } else {
        return accumlator;
      }
    }, []);
  };
}

Game_Enemy_EnemyBookMixIn(Game_Enemy.prototype);

type _EnemyBook = typeof EnemyBook;
type _EnemyBookPage = typeof EnemyBookPage;
type _Scene_EnemyBook = typeof Scene_EnemyBook;
type _EnemyBookWindows = typeof EnemyBookWindows;
type _Window_EnemyBookPercent = typeof Window_EnemyBookPercent;
type _Window_EnemyBookIndex = typeof Window_EnemyBookIndex;
type _Window_EnemyBookStatus = typeof Window_EnemyBookStatus;

declare global {
  var EnemyBook: _EnemyBook;
  var EnemyBookPage: _EnemyBookPage;
  var Scene_EnemyBook: _Scene_EnemyBook;
  var EnemyBookWindows: _EnemyBookWindows;
  var Window_EnemyBookPercent: _Window_EnemyBookPercent;
  var Window_EnemyBookIndex: _Window_EnemyBookIndex;
  var Window_EnemyBookStatus: _Window_EnemyBookStatus;
}

globalThis.EnemyBook = EnemyBook;
globalThis.EnemyBookPage = EnemyBookPage;
globalThis.Scene_EnemyBook = Scene_EnemyBook;
globalThis.EnemyBookWindows = EnemyBookWindows;
globalThis.Window_EnemyBookPercent = Window_EnemyBookPercent;
globalThis.Window_EnemyBookIndex = Window_EnemyBookIndex;
globalThis.Window_EnemyBookStatus = Window_EnemyBookStatus;
