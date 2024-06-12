// DarkPlasma_CharacterText 2.0.1
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/06/13 2.0.1 有効なページがないイベントにメタタグを設定するとエラーになる不具合を修正
 * 2024/04/21 2.0.0 シーンが切り替わるとテキストが消える不具合を修正
 *                  Spriteset_Mapの一部メソッドのインターフェースに関する破壊的な変更
 * 2024/02/15 1.0.1 有効なページがないイベントにメタタグを設定するとエラーになる不具合を修正
 * 2023/11/01 1.0.0 公開
 */

/*:
 * @plugindesc マップ上のキャラクター近傍にテキストを表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param fontSize
 * @text フォントサイズ
 * @type number
 * @default 21
 *
 * @command register
 * @text テキストを登録する
 * @desc 本コマンドを記述したページが有効になっている間、対象イベントにテキストを表示します。本コマンド自体は何もしません。
 * @arg text
 * @text テキスト
 * @type string
 * @arg offsetX
 * @text Xオフセット
 * @type number
 * @default 0
 * @min -1000
 * @arg offsetY
 * @text Yオフセット
 * @type number
 * @default -72
 * @min -1000
 *
 * @command hideAll
 * @text テキストを非表示にする
 * @desc マップ上に表示しているテキストをすべて一時的に非表示にします。
 *
 * @help
 * version: 2.0.1
 * マップ上のキャラクターの近傍にテキストを表示します。
 *
 * 表示したいイベントのメモ欄に <characterText> と記述し、
 * 表示したいページにテキストを登録するプラグインコマンドを記述してください。
 *
 * 一時的に非表示にするプラグインコマンドで一度非表示になったテキストは
 * マップ移動を行うと再度表示されます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_register(args) {
    return {
      text: String(args.text || ``),
      offsetX: Number(args.offsetX || 0),
      offsetY: Number(args.offsetY || -72),
    };
  }

  const command_register = 'register';

  const command_hideAll = 'hideAll';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    fontSize: Number(pluginParameters.fontSize || 21),
  };

  PluginManager.registerCommand(pluginName, command_register, function (args) {});
  PluginManager.registerCommand(pluginName, command_hideAll, function () {
    $gameTemp.requestHideAllCharacterTexts();
  });
  function Game_Temp_CharacterTextMixIn(gameTemp) {
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
  function Game_Character_CharacterTextMixIn(gameCharacter) {
    gameCharacter.mustShowText = function () {
      return false;
    };
    gameCharacter.hasText = function () {
      return false;
    };
    gameCharacter.requestSetupCharacterText = function () {};
  }
  Game_Character_CharacterTextMixIn(Game_Character.prototype);
  function Game_Event_CharacterTextMixIn(gameEvent) {
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
        const registerCommand = this.list().find(
          (command) =>
            command.code === 357 &&
            Utils.extractFileName(command.parameters[0]) === pluginName &&
            command.parameters[1] === command_register,
        );
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
  function Spriteset_Map_CharacterTextMixIn(spritesetMap) {
    const _initialize = spritesetMap.initialize;
    spritesetMap.initialize = function () {
      this._characterTexts = [];
      _initialize.call(this);
    };
    const _createCharacters = spritesetMap.createCharacters;
    spritesetMap.createCharacters = function () {
      _createCharacters.call(this);
      $gameMap
        .events()
        .filter((event) => event.hasText())
        .forEach((event) => this.createCharacterText(event));
    };
    spritesetMap.createCharacterText = function (character) {
      const sprite = new Sprite_CharacterText(character);
      this._characterTexts.push(sprite);
      this._tilemap.addChild(sprite);
      character.requestSetupCharacterText();
    };
    spritesetMap.setupCharacterText = function (request) {
      this._characterTexts
        .find((sprite) => sprite.isCharacter(request.character))
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
      setupRequests.forEach((request) => this.setupCharacterText(request));
      $gameTemp.clearSetupCharacterTextRequests();
    };
    spritesetMap.hideAllCharacterTexts = function () {
      this._characterTexts.forEach((sprite) => sprite.hide());
    };
  }
  Spriteset_Map_CharacterTextMixIn(Spriteset_Map.prototype);
  class Sprite_CharacterText extends Sprite {
    constructor(character) {
      super();
      this._character = character;
    }
    isCharacter(character) {
      return this._character === character;
    }
    setup(text, offsetX, offsetY) {
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
        Math.floor(settings.fontSize * 1.5),
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
    hide() {
      this._forceHidden = true;
      super.hide();
    }
    updateVisibility() {
      super.updateVisibility();
      this.visible = !this._forceHidden && !!this._character?.mustShowText();
    }
    draw() {
      this.bitmap?.clear();
      this.bitmap?.drawText(this._text, 0, 0, this.bitmap.width, this.bitmap.height, 'center');
    }
  }
})();
