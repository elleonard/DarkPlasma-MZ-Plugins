// DarkPlasma_ExpandCharacterPattern 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/07/15 1.0.0 公開
 */

/*:
 * @plugindesc 歩行グラフィックのアニメーションパターンを増やす
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command expandPattern
 * @text 拡張パターン設定
 * @desc 歩行グラフィックのアニメーションパターンを設定します。ページ内で1回のみ有効です。
 * @arg maxPattern
 * @text 最大パターン数
 * @type number
 * @default 4
 * @arg defaultPattern
 * @text デフォルトパターン
 * @type number
 * @default 1
 *
 * @help
 * version: 1.0.0
 * 歩行グラフィックのアニメーションパターンを3通りよりも増やします。
 * 歩行グラフィック画像の左端から順に再生し、
 * 右端にたどり着いたら左端から再生します。
 *
 * アニメーションパターンを増やすキャラクターの歩行グラフィック画像は
 * 画像左上端から開始して1キャラ分のみとしてください。
 * 横幅は余分な空白を含めないようにしてください。
 * 高さは2キャラクター分必要になります。
 *
 * アクターのメモ欄:
 * <maxPattern:n>
 * 歩行グラフィックのアニメーションパターン数をnに設定します。
 * <defaultPattern:n>
 * 歩行グラフィックのデフォルトパターンをnに設定します。
 * 設定しない場合、デフォルトパターンは1になります。
 *
 * 本プラグインはセーブデータに以下の要素を追加します。
 * - イベントごとのアニメーションパターン拡張情報
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_expandPattern(args) {
    return {
      maxPattern: Number(args.maxPattern || 4),
      defaultPattern: Number(args.defaultPattern || 1),
    };
  }

  PluginManager.registerCommand(pluginName, 'expandPattern', () => {});
  function Game_CharacterBase_ExpandCharacterPatternMixIn(gameCharacterBase) {
    gameCharacterBase.isPatternExpanded = function () {
      return false;
    };
    gameCharacterBase.defaultPattern = function () {
      return 1;
    };
    const _resetPattern = gameCharacterBase.resetPattern;
    gameCharacterBase.resetPattern = function () {
      _resetPattern.call(this);
      this.setPattern(this.defaultPattern());
    };
    const _pattern = gameCharacterBase.pattern;
    gameCharacterBase.pattern = function () {
      if (this.isPatternExpanded()) {
        return this._pattern;
      }
      return _pattern.call(this);
    };
  }
  Game_CharacterBase_ExpandCharacterPatternMixIn(Game_CharacterBase.prototype);
  function Game_Player_ExpandCharacterPatternMixIn(gamePlayer) {
    gamePlayer.isPatternExpanded = function () {
      return !this.isInVehicle() && !!$gameParty.leader().isCharacterPatternExpanded();
    };
    const _maxPattern = gamePlayer.maxPattern;
    gamePlayer.maxPattern = function () {
      if (this.isPatternExpanded()) {
        return $gameParty.leader().maxCharacterPattern();
      }
      return _maxPattern.call(this);
    };
    const _defaultPattern = gamePlayer.defaultPattern;
    gamePlayer.defaultPattern = function () {
      if (this.isPatternExpanded()) {
        return $gameParty.leader().defaultCharacterPattern();
      }
      return _defaultPattern.call(this);
    };
  }
  Game_Player_ExpandCharacterPatternMixIn(Game_Player.prototype);
  function Game_Event_ExpandCharacterPatternMixIn(gameEvent) {
    const _setupPageSettings = gameEvent.setupPageSettings;
    gameEvent.setupPageSettings = function () {
      _setupPageSettings.call(this);
      const expandPatternCommand = this.list().find(
        (command) =>
          command.code === 357 && command.parameters[0] === pluginName && command.parameters[1] === 'expandPattern'
      );
      if (expandPatternCommand) {
        const args = parseArgs_expandPattern(expandPatternCommand.parameters[3]);
        this._isPatternExpanded = true;
        this._maxPattern = args.maxPattern;
        this._defaultPattern = args.defaultPattern;
      } else {
        this._isPatternExpanded = false;
      }
    };
    gameEvent.isPatternExpanded = function () {
      return this._isPatternExpanded || false;
    };
    const _maxPattern = gameEvent.maxPattern;
    gameEvent.maxPattern = function () {
      return this.isPatternExpanded() ? this._maxPattern : _maxPattern.call(this);
    };
    const _defaultPattern = gameEvent.defaultPattern;
    gameEvent.defaultPattern = function () {
      return this.isPatternExpanded() ? this._defaultPattern : _defaultPattern.call(this);
    };
  }
  Game_Event_ExpandCharacterPatternMixIn(Game_Event.prototype);
  function Game_Actor_ExpandCharacterPatternMixIn(gameActor) {
    gameActor.isCharacterPatternExpanded = function () {
      return !!this.actor().meta.maxPattern;
    };
    gameActor.maxCharacterPattern = function () {
      return Number(this.actor().meta.maxPattern || 4);
    };
    gameActor.defaultCharacterPattern = function () {
      return Number(this.actor().meta.defaultPattern || 1);
    };
    const _characterPatternYCount = gameActor.characterPatternYCount;
    if (!_characterPatternYCount) {
      gameActor.characterPatternYCount = function () {
        return ImageManager.isBigCharacter(this.characterName()) ? 4 : 8;
      };
    }
  }
  Game_Actor_ExpandCharacterPatternMixIn(Game_Actor.prototype);
  function Window_ExpandCharacterPatternMixIn(windowClass) {
    windowClass.drawActorCharacterWithExpandedPattern = function (actor, x, y) {
      const bitmap = ImageManager.loadCharacter(actor.characterName());
      const pw = bitmap.width / actor.maxCharacterPattern();
      const ph = bitmap.height / actor.characterPatternYCount();
      const sx = actor.defaultCharacterPattern() * pw;
      const sy = 0;
      this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };
  }
  Window_ExpandCharacterPatternMixIn(Window_Base.prototype);
  function Sprite_Character_ExpandPatternMixIn(spriteCharacter) {
    const _characterBlockX = spriteCharacter.characterBlockX;
    spriteCharacter.characterBlockX = function () {
      if (this._character.isPatternExpanded()) {
        return 0;
      }
      return _characterBlockX.call(this);
    };
    const _characterBlockY = spriteCharacter.characterBlockY;
    spriteCharacter.characterBlockY = function () {
      if (this._character.isPatternExpanded()) {
        return 0;
      }
      return _characterBlockY.call(this);
    };
    const _patternWidth = spriteCharacter.patternWidth;
    spriteCharacter.patternWidth = function () {
      if (this._character.isPatternExpanded()) {
        return this.bitmap.width / this._character.maxPattern();
      }
      return _patternWidth.call(this);
    };
  }
  Sprite_Character_ExpandPatternMixIn(Sprite_Character.prototype);
})();
