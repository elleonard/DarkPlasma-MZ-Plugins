// DarkPlasma_ChangeImageWithPattern 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/06/13 1.0.1 導入前のセーブデータをロードするとエラーになる不具合の修正
 * 2024/06/07 1.0.0 公開
 */

/*:
 * @plugindesc 画像の変更で向きやパターンを設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command hackChangeImage
 * @text 画像の変更カスタム
 * @desc 対象の画像の変更コマンドをカスタマイズします。
 * @arg target
 * @desc 画像の変更をカスタマイズする対象を選びます。
 * @text 対象
 * @type select
 * @option プレイヤー
 * @value -1
 * @option このイベント
 * @value 0
 * @option 他のイベント
 * @value 1
 * @default 0
 * @arg targetEventId
 * @desc 対象が他のイベントの場合のみ、対象となるイベントIDを設定します。
 * @text 対象イベントID
 * @type number
 * @default 0
 * @arg direction
 * @desc 画像の変更によって、キャラクターの向きを設定します。
 * @text 向き
 * @type select
 * @option 変更しない
 * @value 0
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @option 上
 * @value 8
 * @default 0
 * @arg pattern
 * @desc 画像の変更によって、キャラクターのパターンを設定します。
 * @text パターン
 * @type select
 * @option 左
 * @value 0
 * @option 真ん中
 * @value 1
 * @option 右
 * @value 2
 * @default 1
 * @arg fixPattern
 * @desc 画像の変更によってキャラクターのパターンを固定します。
 * @text パターンを固定する
 * @type boolean
 * @default true
 *
 * @command unfixPattern
 * @text パターン固定の解除
 * @desc パターン固定状態を解除します。
 * @arg target
 * @desc 画像の変更をカスタマイズする対象を選びます。
 * @text 対象
 * @type select
 * @option プレイヤー
 * @value -1
 * @option このイベント
 * @value 0
 * @option 他のイベント
 * @value 1
 * @default 0
 * @arg targetEventId
 * @desc 対象が他のイベントの場合のみ、対象となるイベントIDを設定します。
 * @text 対象イベントID
 * @type number
 * @default 0
 *
 * @help
 * version: 1.0.1
 * 画像の変更で向きやパターンを設定できるようにします。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_hackChangeImage(args) {
    return {
      target: Number(args.target || 0),
      targetEventId: Number(args.targetEventId || 0),
      direction: Number(args.direction || 0),
      pattern: Number(args.pattern || 1),
      fixPattern: String(args.fixPattern || true) === 'true',
    };
  }

  function parseArgs_unfixPattern(args) {
    return {
      target: Number(args.target || 0),
      targetEventId: Number(args.targetEventId || 0),
    };
  }

  const command_hackChangeImage = 'hackChangeImage';

  const command_unfixPattern = 'unfixPattern';

  PluginManager.registerCommand(pluginName, command_hackChangeImage, function (args) {
    const parsedArgs = parseArgs_hackChangeImage(args);
    const target =
      parsedArgs.target === 1 ? this.character(parsedArgs.targetEventId) : this.character(parsedArgs.target);
    target?.setChangeImageWith({
      direction: parsedArgs.direction,
      pattern: parsedArgs.pattern,
      fixPattern: parsedArgs.fixPattern,
    });
  });
  PluginManager.registerCommand(pluginName, command_unfixPattern, function (args) {
    const parsedArgs = parseArgs_unfixPattern(args);
    const target =
      parsedArgs.target === 1 ? this.character(parsedArgs.targetEventId) : this.character(parsedArgs.target);
    target?.unfixPattern();
  });
  function Game_Character_ChangeImageWithPatternMixIn(gameCharacter) {
    const _initMembers = gameCharacter.initMembers;
    gameCharacter.initMembers = function () {
      _initMembers.call(this);
      this._changeImageWith = this.changeImageWith();
      this._isPatternFixed = false;
    };
    gameCharacter.changeImageWith = function () {
      return (
        this._changeImageWith || {
          direction: 0,
          pattern: 1,
          fixPattern: false,
        }
      );
    };
    gameCharacter.setChangeImageWith = function (changeImageWith) {
      this._changeImageWith = changeImageWith;
    };
    gameCharacter.setChangeImageWithDirection = function (direction) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.direction = direction;
    };
    gameCharacter.setChangeImageWithPattern = function (pattern) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.pattern = pattern;
    };
    gameCharacter.setChangeImageWithFixPattern = function (fixPattern) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.fixPattern = fixPattern;
    };
    const _processMoveCommand = gameCharacter.processMoveCommand;
    gameCharacter.processMoveCommand = function (command) {
      _processMoveCommand.call(this, command);
      if (command.code === Game_Character.ROUTE_CHANGE_IMAGE) {
        if (this.changeImageWith().direction) {
          /**
           * 明示的に指定するため、向き固定を貫通する
           */
          const isDirectionFixed = this.isDirectionFixed();
          this.setDirectionFix(false);
          this.setDirection(this.changeImageWith().direction);
          this.setDirectionFix(isDirectionFixed);
        }
        this.setPattern(this.changeImageWith().pattern);
        if (this.changeImageWith().fixPattern) {
          this.fixPattern();
        }
      }
    };
    const _updatePattern = gameCharacter.updatePattern;
    gameCharacter.updatePattern = function () {
      if (this.isPatternFixed()) {
        return;
      }
      _updatePattern.call(this);
    };
    gameCharacter.isPatternFixed = function () {
      return this._isPatternFixed;
    };
    gameCharacter.fixPattern = function () {
      this._isPatternFixed = true;
    };
    gameCharacter.unfixPattern = function () {
      this._isPatternFixed = false;
    };
  }
  Game_Character_ChangeImageWithPatternMixIn(Game_Character.prototype);
})();
