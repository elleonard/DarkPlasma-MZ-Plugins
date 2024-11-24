// DarkPlasma_Formation 4.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/24 4.0.2 マウスオーバーで切り替える判定を並び替え時以外はしないように変更
 * 2024/10/30 4.0.1 先頭の顔グラビットマップロード時の処理が正常に動作していない不具合の修正
 * 2024/10/17 4.0.0 マウスオーバーで選択ウィンドウを切り替える機能追加 (Breaking Change)
 * 2023/12/09 3.0.0 座標系オフセットに関するプログラム上のインターフェース変更 (Breaking Change)
 * 2023/10/02 2.1.3 待機メンバーウィンドウにメンバーがいない際にカーソルが操作不能になる不具合を修正
 * 2023/09/04 2.1.2 キャラクター横配置の総数・間隔をウィンドウサイズに応じて変わるように変更
 * 2023/08/06 2.1.1 キャンセルキーの挙動が意図通りでない不具合を修正
 * 2023/07/29 2.1.0 ウィンドウ遷移時のindex計算インターフェース公開
 *            2.0.2 左端、右端にカーソルがいることの抽象化
 * 2023/06/18 2.0.1 戦闘メンバーの上限が奇数だった場合に戦闘メンバーと待機メンバーを行き来すると正常に動作しない不具合を修正
 * 2023/06/17 2.0.0 待機メンバーウィンドウを縦スクロールする機能追加
 * 2023/03/07 1.4.2 FesCursor.jsとの競合を解消
 * 2022/09/10 1.4.1 FormationInBattleと組み合わせて戦闘開始時にエラーで停止する不具合を修正
 * 2022/09/04 1.4.0 typescript移行
 *                  左右キーでカーソルをラップするように修正
 * 2022/08/02 1.3.3 リファクタ
 * 2022/07/31 1.3.2 リファクタ
 *            1.3.1 リファクタ
 *            1.3.0 ヘルプウィンドウ表示設定を追加
 * 2021/09/08 1.2.5 並び替えで全滅できる不具合を修正
 * 2021/07/05 1.2.4 MZ 1.3.2に対応
 * 2021/06/23 1.2.3' $つき画像を歩行グラとするアクターを左向きに表示できない不具合を修正
 *            1.2.2 画面サイズとUIエリアのサイズが異なる場合にカーソルがズレて表示される不具合の修正
 * 2021/06/22 1.2.1 サブフォルダからの読み込みに対応
 * 2020/12/30 1.2.0 戻るボタン左右のスペース設定を追加
 *            1.1.0 タッチUIで戻るボタン表示を追加
 *            1.0.7 webブラウザ向けにデプロイした場合に正常に動作しない不具合を修正
 * 2020/12/17 1.0.6 戦闘メンバーの最大数が奇数の場合に上下キーを押した際の挙動を修正
 * 2020/12/15 1.0.5 戦闘メンバーの最大数に応じてウィンドウの表示サイズを変更する
 *            1.0.4 キャラグラが正面向きの時、正しく表示されない不具合を修正
 * 2020/12/14 1.0.3 強制入れ替え後に並び替えウィンドウが正しくリフレッシュされない不具合を修正
 * 2020/10/10 1.0.2 リファクタ
 * 2020/09/23 1.0.1 ヘルプにメニューの並び替えについて追記
 * 2020/09/13 1.0.0 公開
 */

/*:
 * @plugindesc 並び替えシーン
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param characterWidth
 * @desc キャラクター歩行グラフィックの横サイズ
 * @text キャラグラの横サイズ
 * @type number
 * @default 48
 *
 * @param characterHeight
 * @desc キャラクター歩行グラフィックの縦サイズ
 * @text キャラグラの縦サイズ
 * @type number
 * @default 48
 *
 * @param characterDirectionToLeft
 * @desc キャラクターグラフィックを左向きで表示するかどうか
 * @text キャラグラ左向き
 * @type boolean
 * @default true
 *
 * @param inheritMenuBackground
 * @desc メニュー系の画面から遷移した場合に背景を引き継ぐかどうか
 * @text メニュー背景使用
 * @type boolean
 * @default true
 *
 * @param cancelButtonLeftMergin
 * @desc キャンセルボタンとヘルプウィンドウの間の幅
 * @text キャンセル左スペース
 * @type number
 * @default 4
 *
 * @param cancelButtonRightMergin
 * @desc キャンセルボタンと画面端の間の幅
 * @text キャンセル右スペース
 * @type number
 * @default 4
 *
 * @param showHelpWindow
 * @desc OFFにすると最上部のヘルプウィンドウを非表示にして装備・ステータスウィンドウをその分広くします。
 * @text ヘルプウィンドウを表示
 * @type boolean
 * @default true
 *
 * @command openFormationScene
 * @text 並び替えシーンを開く
 *
 * @help
 * version: 4.0.2
 * 並び替えシーンを提供します。
 *
 * プラグインコマンドで並び替えシーンを開始できます。
 *
 * メニューの並び替えコマンドの挙動はこのプラグインだけでは変わりません。
 * メニューの挙動を変えるプラグインと併用することで、変えることができます。
 * 例えば、DarkPlasma_FormationInMenuや
 * トリアコンタンさんのMenuSubCommandがご利用いただけます。
 *
 * バージョン4.0.0以降、FormationInBattleも
 * 3.0.0に更新する必要があることに注意してください。
 *
 * 並び替えシーン開始スクリプト:
 * SceneManager.push(Scene_Formation);
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    characterWidth: Number(pluginParameters.characterWidth || 48),
    characterHeight: Number(pluginParameters.characterHeight || 48),
    characterDirectionToLeft: String(pluginParameters.characterDirectionToLeft || true) === 'true',
    inheritMenuBackground: String(pluginParameters.inheritMenuBackground || true) === 'true',
    cancelButtonLeftMergin: Number(pluginParameters.cancelButtonLeftMergin || 4),
    cancelButtonRightMergin: Number(pluginParameters.cancelButtonRightMergin || 4),
    showHelpWindow: String(pluginParameters.showHelpWindow || true) === 'true',
  };

  const command_openFormationScene = 'openFormationScene';

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
  PluginManager.registerCommand(pluginName, command_openFormationScene, function () {
    SceneManager.push(Scene_Formation);
  });
  SceneManager.isPreviousSceneExtendsMenuBase = function () {
    return !!this._previousClass && new this._previousClass() instanceof Scene_MenuBase;
  };
  function Game_Temp_FormationMixIn(gameTemp) {
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
  function Scene_FormationMixIn(sceneClass) {
    return class extends sceneClass {
      /**
       * @return {Rectangle}
       */
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
      /**
       * @return {Rectangle}
       */
      statusWindowRect() {
        return new Rectangle(
          0,
          this.formationHelpWindow().height + this.waitingMemberWindowHeight(),
          this.formationStatusWindowWidth(),
          this.formationStatusWindowHeight(),
        );
      }
      formationStatusWindowWidth() {
        return Graphics.boxWidth;
      }
      formationStatusWindowHeight() {
        return this.calcWindowHeight(4, false);
      }
      /**
       * @return {Rectangle}
       */
      battleMemberWindowRect() {
        return new Rectangle(
          0,
          this.formationHelpWindow().height,
          this.battleMemberWindowWidth(),
          this.waitingMemberWindowHeight(),
        );
      }
      battleMemberWindowWidth() {
        const characterSpacing = Window_FormationBattleMember.prototype.spacing();
        return settings.characterHeight > DEFAULT_CHARACTER_SIZE
          ? (settings.characterWidth + characterSpacing) * $gameParty.maxBattleMembers()
          : (settings.characterWidth + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
      }
      /**
       * @return {Rectangle}
       */
      waitingMemberWindowRect() {
        return new Rectangle(
          this.formationBattleMemberWindow().width,
          this.formationHelpWindow().height,
          Graphics.boxWidth - this.formationBattleMemberWindow().width,
          this.waitingMemberWindowHeight(),
        );
      }
      waitingMemberWindowHeight() {
        return settings.characterHeight > DEFAULT_CHARACTER_SIZE
          ? settings.characterHeight + WAITING_WINDOW_PADDING
          : settings.characterHeight * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
      }
      cancelButtonWidth() {
        return 0;
      }
      formationHelpWindow() {
        return new Window_Help(new Rectangle(0, 0, 0, 0));
      }
      formationBattleMemberWindow() {
        return new Window_FormationBattleMember(new Rectangle(0, 0, 0, 0));
      }
      formationWaitingMemberWindow() {
        return new Window_FormationWaitingMember(new Rectangle(0, 0, 0, 0));
      }
      formationStatusWindow() {
        return new Window_FormationStatus(new Rectangle(0, 0, 0, 0));
      }
      formationStatusParamsWindow() {
        return new Window_StatusParams(new Rectangle(0, 0, 0, 0));
      }
      formationEquipStatusWindow() {
        return new Window_StatusEquip(new Rectangle(0, 0, 0, 0));
      }
      currentActiveWindow() {
        return this._currentWindow;
      }
      pendingWindow() {
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
      selectWindowRect() {
        return new Rectangle(
          0,
          this.formationWaitingMemberWindow().y,
          Graphics.boxWidth,
          this.formationWaitingMemberWindow().height,
        );
      }
      onFormationOk() {
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
      onFormationCancel() {
        if ((this.pendingWindow()?.pendingIndex() ?? -1) >= 0) {
          this.pendingWindow()?.setPendingIndex(-1);
          this.currentActiveWindow().activate();
        } else {
          this.quitFromFormation();
        }
      }
      quitFromFormation() {}
      activateWaitingMemberWindow() {
        if (this.formationWaitingMemberWindow().maxItems() > 0) {
          this.formationBattleMemberWindow().deactivate();
          this.formationWaitingMemberWindow().activate();
          this.formationWaitingMemberWindow().smoothSelect(this.targetIndexOfActivateWaitingMember());
          this._currentWindow = this.formationWaitingMemberWindow();
        }
      }
      targetIndexOfActivateWaitingMember() {
        let rowOffset = this.formationBattleMemberWindow().row() - this.formationBattleMemberWindow().topRow();
        let targetIndex = () =>
          (this.formationWaitingMemberWindow().topRow() + rowOffset) * this.formationWaitingMemberWindow().maxCols();
        while (targetIndex() >= this.formationWaitingMemberWindow().maxItems()) {
          rowOffset--;
        }
        return targetIndex();
      }
      activateBattleMemberWindow() {
        this.formationWaitingMemberWindow().deactivate();
        this.formationBattleMemberWindow().activate();
        this.formationBattleMemberWindow().smoothSelect(this.targetIndexOfActivateBattleMember());
        this._currentWindow = this.formationBattleMemberWindow();
      }
      targetIndexOfActivateBattleMember() {
        let rowOffset = this.formationWaitingMemberWindow().row() - this.formationWaitingMemberWindow().topRow();
        let colOffset = this.formationBattleMemberWindow().maxCols() - 1;
        let targetIndex = () =>
          (this.formationBattleMemberWindow().topRow() + rowOffset) * this.formationBattleMemberWindow().maxCols() +
          colOffset;
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
    constructor() {
      super(...arguments);
      this._backgroundSprite = null;
      this._cancelButton = null;
      this._helpWindow = null;
      this._statusWindow = null;
      this._statusParamsWindow = null;
      this._equipWindow = null;
      this._battleMemberWindow = null;
      this._waitingMemberWindow = null;
    }
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
      this._battleMemberWindow.activate();
      this._currentWindow = this._battleMemberWindow;
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
      return this._helpWindow;
    }
    createStatusWindow() {
      this._statusWindow = new Window_FormationStatus(this.statusWindowRect());
      this.addWindow(this._statusWindow);
    }
    formationStatusWindow() {
      return this._statusWindow;
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
        this.formationStatusParamsWindowHeight(),
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
        this._statusParamsWindow.height,
      );
    }
    formationEquipStatusWindow() {
      return this._equipWindow;
    }
    createBattleMemberWindow() {
      this._battleMemberWindow = new Window_FormationBattleMember(this.battleMemberWindowRect());
      this._battleMemberWindow.setHandler('ok', () => this.onFormationOk());
      this.addWindow(this._battleMemberWindow);
    }
    formationBattleMemberWindow() {
      return this._battleMemberWindow;
    }
    createWaitingMemberWindow() {
      this._waitingMemberWindow = new Window_FormationWaitingMember(this.waitingMemberWindowRect());
      this.addWindow(this._waitingMemberWindow);
    }
    formationWaitingMemberWindow() {
      return this._waitingMemberWindow;
    }
    quitFromFormation() {
      $gamePlayer.refresh();
      this.popScene();
    }
  }
  globalThis.Scene_Formation = Scene_Formation;
  class Window_FormationStatus extends Window_SkillStatus {
    loadFaceImages() {
      super.loadFaceImages();
      /**
       * 先頭の顔グラビットマップの読み込みが間に合わなかった時のため
       * ロード完了時にリフレッシュする
       */
      ImageManager.loadFace($gameParty.leader().faceName()).addLoadListener(() => this.refresh());
    }
    numVisibleRows() {
      return 4;
    }
    windowHeight() {
      return this.fittingHeight(this.numVisibleRows());
    }
  }
  class Window_FormationMember extends Window_StatusBase {
    constructor() {
      super(...arguments);
      this._statusWindow = null;
      this._statusParamsWindow = null;
      this._equipWindow = null;
    }
    initialize(rect) {
      super.initialize(rect);
      this._bitmapsMustBeRedraw = [];
      this._pendingIndex = -1;
      this.refresh();
    }
    setActivateAnotherWindow(func) {
      this._activateAnotherWindow = func;
    }
    setActivateByHover(func) {
      this._activateByHover = func;
    }
    setStatusWindow(statusWindow) {
      this._statusWindow = statusWindow;
    }
    setStatusParamsWindow(statusParamsWindow) {
      this._statusParamsWindow = statusParamsWindow;
    }
    setEquipWindow(equipWindow) {
      this._equipWindow = equipWindow;
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
    actor() {
      return $gameParty.allMembers()[this.index()];
    }
    members() {
      return [];
    }
    maxItems() {
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
    overallHeight() {
      return this.maxRows() * this.itemHeight();
    }
    itemRect(index) {
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
    setPendingIndex(pendingIndex) {
      if (this._pendingIndex !== pendingIndex) {
        this._pendingIndex = pendingIndex;
        this.refresh();
      }
    }
    select(index) {
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
    drawAllItems() {
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
    refreshCursor() {
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
    processTouch() {
      if (!this.active && this.visible && TouchInput.isHovered() && this.hitIndex() >= 0 && this._activateByHover) {
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
    maxColsForRect() {
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
    cursorRight(wrap) {
      if (this.isAtRightEnd()) {
        this._activateAnotherWindow();
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorRight();
      }
    }
    cursorLeft(wrap) {
      /**
       * 直感に反するため、左端で左キーを押したときは何もしない
       */
      if (!this.isAtLeftEnd()) {
        super.cursorLeft();
      }
    }
  }
  class Window_FormationWaitingMember extends Window_FormationMember {
    actor() {
      return this.index() >= 0 ? $gameParty.allMembers()[this.index() + $gameParty.battleMembers().length] : undefined;
    }
    pendingIndexInParty() {
      return this.pendingIndex() >= 0 ? this.pendingIndex() + $gameParty.battleMembers().length : -1;
    }
    indexInParty() {
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
    cursorLeft(wrap) {
      if (this.index() % this.maxCols() === 0) {
        this._activateAnotherWindow();
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorLeft();
      }
    }
    cursorRight(wrap) {
      if (!this.isAtRightEnd()) {
        super.cursorRight();
      }
    }
  }
  globalThis.Window_FormationStatus = Window_FormationStatus;
  globalThis.Window_FormationBattleMember = Window_FormationBattleMember;
  globalThis.Window_FormationWaitingMember = Window_FormationWaitingMember;
})();
