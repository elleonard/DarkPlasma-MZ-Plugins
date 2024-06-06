/// <reference path="./ChangeImageWithPattern.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_hackChangeImage, command_unfixPattern, parseArgs_hackChangeImage, parseArgs_unfixPattern } from '../config/_build/DarkPlasma_ChangeImageWithPattern_commands';

PluginManager.registerCommand(pluginName, command_hackChangeImage, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_hackChangeImage(args);
  const target = parsedArgs.target === 1
    ? this.character(parsedArgs.targetEventId)
    : this.character(parsedArgs.target);
  target?.setChangeImageWith({
    direction: parsedArgs.direction,
    pattern: parsedArgs.pattern,
    fixPattern: parsedArgs.fixPattern,
  });
});

PluginManager.registerCommand(pluginName, command_unfixPattern, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_unfixPattern(args);
  const target = parsedArgs.target === 1
    ? this.character(parsedArgs.targetEventId)
    : this.character(parsedArgs.target);
  target?.unfixPattern();
});

function Game_Character_ChangeImageWithPatternMixIn(gameCharacter: Game_Character) {
  const _initMembers = gameCharacter.initMembers;
  gameCharacter.initMembers = function () {
    _initMembers.call(this);
    this._changeImageWith = {
      direction: 0,
      pattern: 1,
      fixPattern: false,
    };
    this._isPatternFixed = false;
  };

  gameCharacter.setChangeImageWith = function (changeImageWith) {
    this.setChangeImageWithDirection(changeImageWith.direction);
    this.setChangeImageWithPattern(changeImageWith.pattern);
    this.setChangeImageWithFixPattern(changeImageWith.fixPattern);
  };

  gameCharacter.setChangeImageWithDirection = function (direction) {
    this._changeImageWith.direction = direction;
  };

  gameCharacter.setChangeImageWithPattern = function (pattern) {
    this._changeImageWith.pattern = pattern;
  };

  gameCharacter.setChangeImageWithFixPattern = function (fixPattern) {
    this._changeImageWith.fixPattern = fixPattern;
  };

  const _processMoveCommand = gameCharacter.processMoveCommand;
  gameCharacter.processMoveCommand = function (command) {
    _processMoveCommand.call(this, command);
    if (command.code === Game_Character.ROUTE_CHANGE_IMAGE) {
      if (this._changeImageWith.direction) {
        /**
         * 明示的に指定するため、向き固定を貫通する
         */
        const isDirectionFixed = this.isDirectionFixed();
        this.setDirectionFix(false);
        this.setDirection(this._changeImageWith.direction);
        this.setDirectionFix(isDirectionFixed);
      }
      this.setPattern(this._changeImageWith.pattern);
      if (this._changeImageWith.fixPattern) {
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
