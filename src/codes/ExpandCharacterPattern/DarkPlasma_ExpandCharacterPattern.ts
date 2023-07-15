/// <reference path="./ExpandCharacterPattern.d.ts" />

import { pluginName } from '../../common/pluginName';
import { parseArgs_expandPattern } from './_build/DarkPlasma_ExpandCharacterPattern_commands';

PluginManager.registerCommand(pluginName, 'expandPattern', () => { });

function Game_CharacterBase_ExpandCharacterPatternMixIn(gameCharacterBase: Game_CharacterBase) {
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

function Game_Player_ExpandCharacterPatternMixIn(gamePlayer: Game_Player) {
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

function Game_Event_ExpandCharacterPatternMixIn(gameEvent: Game_Event) {
  const _setupPageSettings = gameEvent.setupPageSettings;
  gameEvent.setupPageSettings = function () {
    _setupPageSettings.call(this);
    const expandPatternCommand = this.list().find(command =>
      command.code === 357
      && command.parameters[0] === pluginName
      && command.parameters[1] === 'expandPattern'
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

function Game_Actor_ExpandCharacterPatternMixIn(gameActor: Game_Actor) {
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

function Window_ExpandCharacterPatternMixIn(windowClass: Window_Base) {
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

function Sprite_Character_ExpandPatternMixIn(spriteCharacter: Sprite_Character) {
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
      return this.bitmap!.width / this._character.maxPattern();
    }
    return _patternWidth.call(this);
  };
}

Sprite_Character_ExpandPatternMixIn(Sprite_Character.prototype);
