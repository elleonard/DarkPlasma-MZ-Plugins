/// <reference path="./CGGallery.d.ts" />

import { settings } from './_build/DarkPlasma_CGGallery_parameters';

class Scene_CGGallery extends Scene_Base {
  _selectWindow: Window_SelectCG;
  _backgroundSprite: Sprite;
  _sprite: Sprite_CG;

  initialize() {
    super.initialize();
    this.loadSwitches();
  }

  /**
   * overwrite if needed.
   */
  loadSwitches() { }

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
    this._sprite = new Sprite_CG("");
    this._sprite.setClickHandler(this.closeCG.bind(this));
    this.addChild(this._sprite);
  }

  commandSelectOk() {
    this._selectWindow.hide();
    this._selectWindow.deactivate();
    this._sprite.showCG(this._selectWindow.currentExt());
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
  _pictureName: string;
  _picture: Game_Picture;

  initialize() {
    super.initialize();
    this._pictureName = '';
    this._picture = new Game_Picture();
  }

  setupFrames() { }

  picture() {
    return this._picture;
  }

  /**
   * @param {string} pictureName
   */
  showCG(pictureName: string): void {
    const bitmap = ImageManager.loadPicture(pictureName);
    if (!bitmap.isReady()) {
      bitmap.addLoadListener(() => this.showCG(pictureName));
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

  updateOpacity() { }

  checkBitmap() { }

  updateBitmap() {
    const picture = this.picture();
    if (picture) {
      const pictureName = picture.name();
      if (this._pictureName !== pictureName) {
        this._pictureName = pictureName;
        this.loadBitmap();
      }
      this.visible = true;
    } else {
      this._pictureName = "";
      this.bitmap = null;
      this.visible = false;
    }
  }

  loadBitmap() {
    this.bitmap = ImageManager.loadPicture(this._pictureName);
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

type _Scene_CGGallery = typeof Scene_CGGallery;
type _Window_SelectCG = typeof Window_SelectCG;
declare global {
  var Scene_CGGallery: _Scene_CGGallery;
  var Window_SelectCG: _Window_SelectCG;
}

globalThis.Scene_CGGallery = Scene_CGGallery;
globalThis.Window_SelectCG = Window_SelectCG;
