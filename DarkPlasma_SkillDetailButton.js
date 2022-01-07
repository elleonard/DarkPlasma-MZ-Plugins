// DarkPlasma_SkillDetailButton 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/01/07 1.0.0 公開
 */

/*:ja
 * @plugindesc スキルの詳細説明文表示ボタン
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SkillDetail
 *
 * @param showButtonImage
 * @text 表示ボタン画像
 * @type file
 * @dir img
 *
 * @param hideButtonImage
 * @text 非表示ボタン画像
 * @type file
 * @dir img
 *
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param scale
 * @desc ボタン画像のサイズ倍率（％）
 * @text サイズ倍率
 * @type number
 * @default 100
 *
 * @help
 * version: 1.0.0
 * スキルの詳細説明文表示を切り替えるボタン画像を表示します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_SkillDetail version:1.0.0
 */

(() => {
  'use strict';

  class Sprite_ToggleButton extends Sprite_Clickable {
    initialize(toggleHandler) {
      super.initialize(null);
      this._handler = toggleHandler;
      this.loadButtonImage();
      this.scale.x = this.scaleXY();
      this.scale.y = this.scaleXY();
      this.x = this.positionX();
      this.y = this.positionY();
      this.hide();
    }

    /**
     * @return {number}
     */
    scaleXY() {
      return 1;
    }

    /**
     * @return {number}
     */
    positionX() {
      return 0;
    }

    /**
     * @return {number}
     */
    positionY() {
      return 0;
    }

    /**
     * @return {string}
     */
    onImageName() {
      return '';
    }

    /**
     * @return {string}
     */
    offImageName() {
      return '';
    }

    loadButtonImage() {
      this._onBitmap = ImageManager.loadBitmap('img/', this.onImageName());
      this._offBitmap = ImageManager.loadBitmap('img/', this.offImageName());
      this.bitmap = this._onBitmap;
    }

    onClick() {
      this._handler();
    }

    /**
     * @param {boolean} on
     */
    setImage(on) {
      this.bitmap = on ? this._onBitmap : this._offBitmap;
    }
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    showButtonImage: String(pluginParameters.showButtonImage || ''),
    hideButtonImage: String(pluginParameters.hideButtonImage || ''),
    x: Number(pluginParameters.x || 0),
    y: Number(pluginParameters.y || 0),
    scale: Number(pluginParameters.scale || 100),
  };

  /**
   * @param {Scene_Skill.prototype} sceneSkill
   */
  function Scene_Skill_SkillDetailButtonMixIn(sceneSkill) {
    const _createDetailWindow = sceneSkill.createDetailWindow;
    sceneSkill.createDetailWindow = function () {
      _createDetailWindow.call(this);
      this._toggleDetailButton = new Sprite_ToggleSkillDetailButton(this.toggleDetailWindowByButton.bind(this));
      this.addChild(this._toggleDetailButton);
    };

    sceneSkill.toggleDetailWindowByButton = function () {
      SoundManager.playCursor();
      this.toggleDetailWindow();
    };

    const _update = sceneSkill.update;
    sceneSkill.update = function () {
      _update.call(this);
      this.updateToggleDetailButton();
    };

    sceneSkill.updateToggleDetailButton = function () {
      this._toggleDetailButton.visible = this._detailWindow.visible || this._itemWindow.active;
      this._toggleDetailButton.setImage(!this._detailWindow.visible);
    };
  }

  Scene_Skill_SkillDetailButtonMixIn(Scene_Skill.prototype);

  class Sprite_ToggleSkillDetailButton extends Sprite_ToggleButton {
    scaleXY() {
      return settings.scale / 100;
    }

    positionX() {
      return settings.x;
    }

    positionY() {
      return settings.y;
    }

    onImageName() {
      return settings.showButtonImage;
    }

    offImageName() {
      return settings.hideButtonImage;
    }
  }
})();
