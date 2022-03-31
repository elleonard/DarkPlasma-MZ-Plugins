// DarkPlasma_SealItemCommand 1.0.3
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/03/31 1.0.3 TemplateEvent.jsと併用すると戦闘テストできない不具合を修正
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/05/14 1.0.0 公開
 */

/*:ja
 * @plugindesc アイテムコマンドを封印する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.3
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

  Game_Map.prototype.isItemCommandEnabled = function () {
    return !isMapMetaDataAvailable() || !$dataMap.meta.sealItemCommand;
  };

  const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
  Window_MenuCommand.prototype.makeCommandList = function () {
    _Window_MenuCommand_makeCommandList.call(this);
    const itemCommand = this.itemCommand();
    if (itemCommand && !$gameMap.isItemCommandEnabled()) {
      itemCommand.enabled = false;
    }
  };

  const _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
  Window_ActorCommand.prototype.addItemCommand = function () {
    _Window_ActorCommand_addItemCommand.call(this);
    if (!$gameMap.isItemCommandEnabled()) {
      this._list.find((command) => command.symbol === 'item').enabled = false;
    }
  };

  Window_Command.prototype.itemCommand = function () {
    return this._list.find((command) => command.symbol === 'item');
  };
})();
