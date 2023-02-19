// DarkPlasma_SealItemCommand 1.0.4
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/02/19 1.0.4 TypeScript移行
 *                  デフォルト言語を設定
 * 2022/03/31 1.0.3 TemplateEvent.jsと併用すると戦闘テストできない不具合を修正
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/05/14 1.0.0 公開
 */

/*:
 * @plugindesc アイテムコマンドを封印する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.4
 * メモ欄に<sealItemCommand>と入力したマップにおいて、
 * アイテムコマンドを戦闘/メニュー共に使用不可にします。
 */

(() => {
  'use strict';

  /**
   * マップのメタデータを取得できるか
   * @return {boolean}
   */
  function isMapMetaDataAvailable() {
    return $dataMap && $dataMap.meta;
  }

  function Game_Map_SealItemCommandMixIn(gameMap) {
    gameMap.isItemCommandEnabled = function () {
      return !isMapMetaDataAvailable() || !$dataMap?.meta.sealItemCommand;
    };
  }
  Game_Map_SealItemCommandMixIn(Game_Map.prototype);
  function Window_MenuCommand_SealItemCommandMixIn(windowClass) {
    const _makeCommandList = windowClass.makeCommandList;
    windowClass.makeCommandList = function () {
      _makeCommandList.call(this);
      const itemCommand = this.itemCommand();
      if (itemCommand && !$gameMap.isItemCommandEnabled()) {
        itemCommand.enabled = false;
      }
    };
  }
  Window_MenuCommand_SealItemCommandMixIn(Window_MenuCommand.prototype);
  function Window_ActorCommand_SealItemCommandMixIn(windowClass) {
    const _addItemCommand = windowClass.addItemCommand;
    windowClass.addItemCommand = function () {
      _addItemCommand.call(this);
      if (!$gameMap.isItemCommandEnabled()) {
        const itemCommand = this.itemCommand();
        if (itemCommand) {
          itemCommand.enabled = false;
        }
      }
    };
  }
  Window_ActorCommand_SealItemCommandMixIn(Window_ActorCommand.prototype);
  function Window_Command_SealItemCommandMixIn(windowClass) {
    windowClass.itemCommand = function () {
      return this._list.find((command) => command.symbol === 'item');
    };
  }
  Window_Command_SealItemCommandMixIn(Window_Command.prototype);
})();
