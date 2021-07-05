// DarkPlasma_CGGallery 2.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.1 MZ 1.3.2に対応
 * 2021/06/27 1.0.0 公開
 */

/*:ja
 * @plugindesc CGギャラリーシーンを提供する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param cgs
 * @desc CGの情報を登録します。
 * @text CG一覧
 * @type struct<CG>[]
 * @default []
 *
 * @param selectWindowWidth
 * @desc CG一覧ウィンドウの横幅を指定します。
 * @text ウィンドウ幅
 * @type number
 * @default 300
 *
 * @param selectWindowHeight
 * @desc CG一覧ウィンドウの高さを指定します。
 * @text ウィンドウ高さ
 * @type number
 * @default 300
 *
 * @param secretTitle
 * @desc 閲覧条件を満たさないCGのタイトル表示
 * @text 未開放タイトル
 * @type string
 * @default ？？？？
 *
 * @param backgroundImage
 * @desc CGギャラリーシーンの背景画像を指定します。
 * @text 背景画像
 * @type file
 * @dir img
 *
 * @help
 * version: 2.0.1
 * CGギャラリーシーンを提供します。
 *
 * 下記スクリプトによってシーンを開くことができます。
 * SceneManager.push(Scene_CGGallery);
 */
/*~struct~CG:
 * @param file
 * @desc 表示するCGの画像ファイルを指定します。
 * @text ファイル
 * @type file
 * @dir img/pictures
 *
 * @param switchId
 * @desc CGが閲覧可能になる条件のスイッチを指定します。
 * @text スイッチ
 * @type switch
 * @default 0
 *
 * @param title
 * @desc CGのタイトルを指定します。
 * @text タイトル
 * @type string
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    cgs: JSON.parse(pluginParameters.cgs || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          file: String(parsed.file || ''),
          switchId: Number(parsed.switchId || 0),
          title: String(parsed.title || ''),
        };
      })(e || '{}');
    }),
    selectWindowWidth: Number(pluginParameters.selectWindowWidth || 300),
    selectWindowHeight: Number(pluginParameters.selectWindowHeight || 300),
    secretTitle: String(pluginParameters.secretTitle || '？？？？'),
    backgroundImage: String(pluginParameters.backgroundImage || ''),
  };

  class Scene_CGGallery extends Scene_Base {
    initialize() {
      super.initialize();
      this.loadSwitches();
    }

    /**
     * overwrite if needed.
     */
    loadSwitches() {}

    create() {
      super.create();
      this.createBackground();
      this.createWindowLayer();
      this.createSelectWindow();
      this.createSprite();
    }

    createBackground() {
      if (settings.backgroundImage) {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadBitmap('img/', settings.backgroundImage);
        this.addChild(this._backgroundSprite);
      }
    }

    createSelectWindow() {
      this._selectWindow = new Window_SelectCG(this.selectWindowRect());
      this._selectWindow.setHandler('ok', this.commandSelectOk.bind(this));
      this._selectWindow.setHandler('cancel', this.commandSelectCancel.bind(this));
      this.addWindow(this._selectWindow);
    }

    selectWindowRect() {
      return new Rectangle(
        Graphics.boxWidth / 2 - settings.selectWindowWidth / 2,
        Graphics.boxHeight / 2 - settings.selectWindowHeight / 2,
        settings.selectWindowWidth,
        settings.selectWindowHeight
      );
    }

    createSprite() {
      this._sprite = new Sprite_CG();
      this._sprite.setClickHandler(this.closeCG.bind(this));
      this.addChild(this._sprite);
    }

    commandSelectOk() {
      this._selectWindow.hide();
      this._selectWindow.deactivate();
      this._sprite.show(this._selectWindow.currentExt());
    }

    commandSelectCancel() {
      this.popScene();
    }

    closeCG() {
      this._sprite.hide();
      this._selectWindow.activate();
      this._selectWindow.show();
    }

    update() {
      super.update();
      if (this._sprite.visible) {
        if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
          this.closeCG();
        }
      }
    }
  }

  class Sprite_CG extends Sprite_Button {
    initialize() {
      super.initialize();
      this._pictureName = '';
      this._picture = new Game_Picture();
    }

    setupFrames() {}

    picture() {
      return this._picture;
    }

    /**
     * @param {string} pictureName
     */
    show(pictureName) {
      const bitmap = ImageManager.loadPicture(pictureName);
      if (!bitmap.isReady()) {
        bitmap.addLoadListener(() => this.show(pictureName));
        return;
      }
      this.picture().show(pictureName, 0, 0, 0, 100, 100, 255, 0);
      this.updateBitmap();
    }

    hide() {
      this.picture().initBasic();
      this.updateBitmap();
    }

    update() {
      if (this.visible) {
        this.processTouch();
      }
    }

    updateOpacity() {}

    checkBitmap() {}

    updateBitmap() {
      Sprite_Picture.prototype.updateBitmap.call(this);
    }

    loadBitmap() {
      Sprite_Picture.prototype.loadBitmap.call(this);
    }
  }

  class Window_SelectCG extends Window_Command {
    makeCommandList() {
      settings.cgs.forEach((cg, index) => {
        const isEnabled = $gameSwitches.value(cg.switchId);
        this.addCommand(isEnabled ? cg.title : settings.secretTitle, `cg_${index}`, isEnabled, cg.file);
      });
      this.addCommand('戻る', 'cancel');
    }

    itemTextAlign() {
      return 'left';
    }
  }

  window[Scene_CGGallery.name] = Scene_CGGallery;
  window[Window_SelectCG.name] = Window_SelectCG;
})();
