/// <reference path="./CharacterText.d.ts" />

import { pluginName } from '../../common/pluginName';
import { command_hideAll, command_register, parseArgs_register } from './_build/DarkPlasma_CharacterText_commands';
import { settings } from './_build/DarkPlasma_CharacterText_parameters';

PluginManager.registerCommand(pluginName, command_register, function (args) {
});

PluginManager.registerCommand(pluginName, command_hideAll, function () {
  $gameTemp.requestHideAllCharacterTexts();
});

function Game_Temp_CharacterTextMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._hideAllCharacterTextsRequest = false;
    this._setupCharacterTextRequests = [];
    this._mustShowCharacterTextCache = {};
  };

  gameTemp.requestHideAllCharacterTexts = function () {
    this._hideAllCharacterTextsRequest = true;
  };

  gameTemp.clearHideAllCharacterTextsRequest = function () {
    this._hideAllCharacterTextsRequest = false;
  };

  gameTemp.isHideAllCharacterTextsRequested = function () {
    return this._hideAllCharacterTextsRequest;
  };

  gameTemp.requestSetupCharacterText = function (request) {
    this._setupCharacterTextRequests.push(request);
  };

  gameTemp.clearSetupCharacterTextRequests = function () {
    this._setupCharacterTextRequests = [];
  };

  gameTemp.setupCharacterTextRequests = function () {
    return this._setupCharacterTextRequests;
  };

  gameTemp.setMustShowCharacterTextCache = function (mapId, eventId, mustShow) {
    this._mustShowCharacterTextCache[`${mapId}_${eventId}`] = mustShow;
  };

  gameTemp.mustShowCharacterTextCache = function (mapId, eventId) {
    return this._mustShowCharacterTextCache[`${mapId}_${eventId}`];
  };
}

Game_Temp_CharacterTextMixIn(Game_Temp.prototype);

function Game_Character_CharacterTextMixIn(gameCharacter: Game_Character) {
  gameCharacter.mustShowText = function () {
    return false;
  };

  gameCharacter.hasText = function () {
    return false;
  };

  gameCharacter.requestSetupCharacterText = function () {};
}

Game_Character_CharacterTextMixIn(Game_Character.prototype);

function Game_Event_CharacterTextMixIn(gameEvent: Game_Event) {
  const _setupPageSettings = gameEvent.setupPageSettings;
  gameEvent.setupPageSettings = function () {
    _setupPageSettings.call(this);
    this.requestSetupCharacterText();
  };

  gameEvent.mustShowText = function () {
    return $gameTemp.mustShowCharacterTextCache(this._mapId, this._eventId) && !this.isTransparent();
  };

  gameEvent.hasText = function () {
    return !!this.event().meta.characterText;
  };

  gameEvent.requestSetupCharacterText = function () {
    if (this.hasText() && this.page()) {
      const registerCommand = this.list()
        .find(command => command.code === 357
          && Utils.extractFileName(command.parameters[0]) === pluginName
          && command.parameters[1] === command_register);
      if (registerCommand) {
        const parsedArgs = parseArgs_register(registerCommand.parameters[3]);
        $gameTemp.requestSetupCharacterText({
          text: parsedArgs.text,
          character: this,
          offset: {
            x: parsedArgs.offsetX,
            y: parsedArgs.offsetY,
          },
        });
        $gameTemp.setMustShowCharacterTextCache(this._mapId, this._eventId, true);
      } else {
        $gameTemp.setMustShowCharacterTextCache(this._mapId, this._eventId, false);
      }
    }
  };
}

Game_Event_CharacterTextMixIn(Game_Event.prototype);

function Spriteset_Map_CharacterTextMixIn(spritesetMap: Spriteset_Map) {
  const _initialize = spritesetMap.initialize;
  spritesetMap.initialize = function() {
    this._characterTexts = [];
    _initialize.call(this);
  };

  const _createCharacters = spritesetMap.createCharacters;
  spritesetMap.createCharacters = function () {
    _createCharacters.call(this);
    $gameMap.events().filter(event => event.hasText()).forEach(event => this.createCharacterText(event));
  };

  spritesetMap.createCharacterText = function (character) {
    const sprite = new Sprite_CharacterText(character);
    this._characterTexts.push(sprite);
    this._tilemap.addChild(sprite);
    character.requestSetupCharacterText();
  };

  spritesetMap.setupCharacterText = function (request) {
    this._characterTexts
      .find(sprite => sprite.isCharacter(request.character))
      ?.setup(request.text, request.offset.x, request.offset.y);
  };

  const _update = spritesetMap.update;
  spritesetMap.update = function () {
    _update.call(this);
    this.updateCharacterTexts();
  };

  spritesetMap.updateCharacterTexts = function () {
    if ($gameTemp.isHideAllCharacterTextsRequested()) {
      this.hideAllCharacterTexts();
      $gameTemp.clearHideAllCharacterTextsRequest();
    }
    const setupRequests = $gameTemp.setupCharacterTextRequests();
    setupRequests.forEach(request => this.setupCharacterText(request));
    $gameTemp.clearSetupCharacterTextRequests();
  };

  spritesetMap.hideAllCharacterTexts = function () {
    this._characterTexts.forEach(sprite => sprite.hide());
  };
}

Spriteset_Map_CharacterTextMixIn(Spriteset_Map.prototype);

class Sprite_CharacterText extends Sprite {
  _text: string;
  _character?: Game_Character;
  _offsetX: number;
  _offsetY: number;
  _forceHidden: boolean;

  constructor(character: Game_Character) {
    super();
    this._character = character;
  }

  isCharacter(character: Game_Character) {
    return this._character === character;
  }

  setup(text: string, offsetX: number, offsetY: number) {
    this.anchor.x = 0.5;
    this._text = text;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this.createBitmap();
    this.updatePosition();
    this.draw();
  }

  createBitmap() {
    this.bitmap = new Bitmap(
      Math.floor(this._text.length * settings.fontSize * 1.5),
      Math.floor(settings.fontSize * 1.5)
    );
    this.bitmap.fontSize = settings.fontSize;
  }

  update() {
    super.update();
    this.updatePosition();
  }

  updatePosition() {
    if (this._character) {
      this.x = this._character.screenX() + this._offsetX;
      this.y = this._character.screenY() + this._offsetY;
      this.z = this._character.screenZ() - 1;
    }
  }

  public hide(): void {
    this._forceHidden = true;
    super.hide();
  }

  public updateVisibility(): void {
    super.updateVisibility();
    this.visible = !this._forceHidden && !!this._character?.mustShowText();
  }

  draw() {
    this.bitmap?.clear();
    this.bitmap?.drawText(this._text, 0, 0, this.bitmap.width, this.bitmap.height, 'center');
  }
}
