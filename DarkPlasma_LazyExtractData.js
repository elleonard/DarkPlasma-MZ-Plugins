// DarkPlasma_LazyExtractData 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/25 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc データベース遅延読み込みパート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * データベースの構造に依存するようなmetaタグなどを
 * 遅延して展開するためのプラグインです。
 *
 * 本プラグインは単体では動作しません。
 * 拡張プラグインと一緒に利用してください。
 */

(() => {
  'use strict';

  function DataManager_LazyExtractDataMixIn(dataManager) {
    dataManager.lazyExtractData = function () {
      this._lazyExtractData.forEach((data) => this.lazyExtractMetadata(data));
    };
    dataManager.pushLazyExtractData = function (data) {
      if (!this._lazyExtractData) {
        this._lazyExtractData = [];
      }
      this._lazyExtractData.push(data);
    };
    dataManager.lazyExtractMetadata = function (data) {};
  }
  DataManager_LazyExtractDataMixIn(DataManager);
  function Scene_Boot_LazyExtractDataMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      DataManager.lazyExtractData();
    };
  }
  Scene_Boot_LazyExtractDataMixIn(Scene_Boot.prototype);
})();
