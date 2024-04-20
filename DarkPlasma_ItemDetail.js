// DarkPlasma_ItemDetail 1.0.5
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/04/20 1.0.5 共通化した実装を基底プラグインに分離
 * 2024/04/17 1.0.4 詳細説明を開けるウィンドウの実装を共通ファイルに切り出す
 *            1.0.3 詳細説明ウィンドウの実装を共通ファイルに切り出す
 * 2023/10/20 1.0.2 型の指定を修正 (動作に影響なし)
 *            1.0.1 詳細ウィンドウの表示位置がズレる不具合を修正
 *            1.0.0 公開
 */

/*:
 * @plugindesc アイテムの詳細説明文を表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @base DarkPlasma_DisplayDatabaseDetailWindow
 * @orderAfter DarkPlasma_CustomKeyHandler
 * @orderAfter DarkPlasma_DisplayDatabaseDetailWindow
 *
 * @param openDetailKey
 * @desc 詳細説明を開くためのボタン
 * @text 詳細説明ボタン
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @param heightAdjustment
 * @desc 詳細ウィンドウコンテンツの高さ補正。
 * @text 詳細高さ補正
 * @type number
 * @default 32
 *
 * @help
 * version: 1.0.5
 * アイテム画面のアイテムにカーソルを合わせて特定のボタンを押すと
 * アイテム詳細説明画面を開きます。
 *
 * アイテムのメモ欄に下記のような記述で詳細説明を記述できます。
 * <detail:詳細説明文。
 * ～～～～。>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.3.0
 * DarkPlasma_DisplayDatabaseDetailWindow version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 * DarkPlasma_DisplayDatabaseDetailWindow
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    openDetailKey: String(pluginParameters.openDetailKey || `shift`),
    heightAdjustment: Number(pluginParameters.heightAdjustment || 32),
  };

  function Scene_Item_DetailMixIn(sceneItem) {
    const _create = sceneItem.create;
    sceneItem.create = function () {
      _create.call(this);
      this.createDetailWindow();
    };
    const _createItemWindow = sceneItem.createItemWindow;
    sceneItem.createItemWindow = function () {
      _createItemWindow.call(this);
      this._itemWindow.setHandler('detail', () => this.toggleDetailWindow());
    };
    sceneItem.createDetailWindow = function () {
      this._detailWindowLayer = new WindowLayer();
      this._detailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._detailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._detailWindowLayer);
      this._detailWindow = new Window_ItemDetail(this.detailWindowRect());
      this._detailWindowLayer.addChild(this._detailWindow);
      this._itemWindow.setDetailWindow(this._detailWindow);
    };
    sceneItem.detailWindowRect = function () {
      return this.itemWindowRect();
    };
    sceneItem.toggleDetailWindow = function () {
      this._itemWindow.activate();
      this._detailWindow.scrollTo(0, 0);
      if (!this._detailWindow.visible) {
        this._detailWindow.show();
      } else {
        this._detailWindow.hide();
      }
    };
  }
  Scene_Item_DetailMixIn(Scene_Item.prototype);
  Window_WithDetailWindowMixIn(settings.openDetailKey, Window_ItemList.prototype);
  class Window_ItemDetail extends Window_DetailText {
    heightAdjustment() {
      return settings.heightAdjustment;
    }
  }
})();
