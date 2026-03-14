// DarkPlasma_SharedSaveInfo 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/03/15 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 全てのセーブデータに共通のデータを定義する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command saveSharedInfo
 * @text 共有セーブに保存する
 * @desc 共有セーブデータにスイッチ・変数を保存します。
 *
 * @help
 * version: 1.0.0
 * 全てのセーブデータに共通のデータを定義します。
 * 本プラグインは単体では効力を発揮しません。
 * 拡張プラグインといっしょに利用してください。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const command_saveSharedInfo = 'saveSharedInfo';

  PluginManager.registerCommand(pluginName, command_saveSharedInfo, function () {
    DataManager.saveSharedInfo();
  });
  function DataManager_SharedSaveInfoMixIn(dataManager) {
    const _setupEventTest = dataManager.setupEventTest;
    dataManager.setupEventTest = function () {
      _setupEventTest.call(this);
      this.loadSharedInfo();
    };
    const _setupNewGame = dataManager.setupNewGame;
    dataManager.setupNewGame = function () {
      _setupNewGame.call(this);
      this.loadSharedInfo();
    };
    const _extractSaveContents = dataManager.extractSaveContents;
    dataManager.extractSaveContents = function (contents) {
      _extractSaveContents.call(this, contents);
      this.loadSharedInfo();
    };
    const _saveGame = dataManager.saveGame;
    dataManager.saveGame = function (savefileId) {
      this.saveSharedInfo();
      return _saveGame.call(this, savefileId);
    };
    dataManager.saveSharedInfo = function () {
      StorageManager.saveObject('shared', this.makeSharedInfo());
    };
    dataManager.loadSharedInfo = function () {
      this._isSharedInfoLoaded = false;
      StorageManager.loadObject('shared')
        .then((sharedInfo) => this.onLoadSharedInfo(sharedInfo))
        .catch(() => (this._isSharedInfoLoaded = true));
    };
    dataManager.onLoadSharedInfo = function (sharedInfo) {
      this._isSharedInfoLoaded = true;
      return 0;
    };
    dataManager.isSharedInfoLoaded = function () {
      return this._isSharedInfoLoaded;
    };
    dataManager.makeSharedInfo = function () {
      return {};
    };
  }
  DataManager_SharedSaveInfoMixIn(DataManager);
  function Scene_Map_SharedSwitchVariableMixIn(sceneMap) {
    const _isReady = sceneMap.isReady;
    sceneMap.isReady = function () {
      return _isReady.call(this) && DataManager.isSharedInfoLoaded();
    };
  }
  Scene_Map_SharedSwitchVariableMixIn(Scene_Map.prototype);
})();
