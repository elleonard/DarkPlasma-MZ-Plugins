/// <reference path="./ImportExportSaveFile.d.ts" />

import { settings } from "./_build/DarkPlasma_ImportExportSaveFile_parameters";

const MOBILE_IMPORT_EXPORT_AREA_PADDING = 5;

function Graphics_ImportExportSaveFileMixIn(graphics: typeof Graphics) {
  const _createAllElements = graphics._createAllElements;
  graphics._createAllElements = function () {
    _createAllElements.call(this);
    this._createImportExportArea();
  };

  graphics._importExportAreaRect = function () {
    return Utils.isMobileDevice()
      ? new Rectangle(
        this._stretchWidth()/2 + MOBILE_IMPORT_EXPORT_AREA_PADDING,
        MOBILE_IMPORT_EXPORT_AREA_PADDING,
        this._stretchWidth()/2 - MOBILE_IMPORT_EXPORT_AREA_PADDING * 2,
        this._stretchHeight() - MOBILE_IMPORT_EXPORT_AREA_PADDING * 2
      )
      : new Rectangle(
        settings.textAreaRect.x,
        settings.textAreaRect.y,
        settings.textAreaRect.width,
        settings.textAreaRect.height
      );
  };

  graphics._createImportExportArea = function () {
    const rect = this._importExportAreaRect();
    this._importExportElement = document.createElement('textarea');
    this._importExportElement.style.position = 'absolute';
    this._importExportElement.style.left = `${rect.x}px`;
    this._importExportElement.style.top = `${rect.y}px`;
    this._importExportElement.style.width = `${rect.width}px`;
    this._importExportElement.style.height = `${rect.height}px`;
    this._importExportElement.style.zIndex = "98";
  };

  const _stretchWidth = graphics._stretchWidth;
  graphics._stretchWidth = function () {
    return this._importExportMode && Utils.isMobileDevice() ? _stretchWidth.call(this)/2 : _stretchWidth.call(this);
  };

  const _centerElement = graphics._centerElement;
  graphics._centerElement = function (element) {
    _centerElement.call(this, element);
    if (element === this._canvas && this._importExportMode && Utils.isMobileDevice()) {
      element.style.margin = "auto 0";
    }
  };

  graphics.showImportExportArea = function () {
    this._importExportElement.setSelectionRange(0, this._importExportElement.textLength);
    this._importExportMode = true;
    document.body.appendChild(this._importExportElement);
    this._updateAllElements();
  };

  graphics.hideImportExportArea = function () {
    this._importExportMode = false;
    document.body.removeChild(this._importExportElement);
    this._updateAllElements();
  };

  graphics.importExportAreaValue = function () {
    return this._importExportElement.value;
  };

  graphics.setImportExportAreaValue = function (text) {
    this._importExportElement.value = text;
  };

  graphics.setImportExportAreaPlaceholder = function (text) {
    this._importExportElement.placeholder = text;
  };
}

Graphics_ImportExportSaveFileMixIn(Graphics);

/**
 * ブラウザでも動かすためBufferは使用しない
 */
async function base64Encode(text: string): Promise<string> {
  return  new Promise((resolve) => resolve(btoa(encodeURIComponent(text))));
}

async function base64Decode(text: string): Promise<string> {
  return new Promise(resolve => resolve(decodeURIComponent(atob(text))));
}

function DataManager_ImportExportSaveFileMixIn(dataManager: typeof DataManager) {
  dataManager.isThisGameFile = function (savefileId) {
    if (this._globalInfo && this._globalInfo[savefileId]) {
      if (StorageManager.isLocalMode()) {
        return true;
      } else {
        const savefile = this._globalInfo[savefileId];
        return savefile.title === $dataSystem.gameTitle;
      }
    }
    return false;
  };

  dataManager.loadCompressedGamedata = async function (savefileId: number): Promise<string> {
    return StorageManager.loadObject(this.makeSavename(savefileId)).then(content => {
      return StorageManager.objectToJson({
        data: content,
        info: this._globalInfo![savefileId],
      }).then(json => base64Encode(json))
    });
  };

  dataManager.saveCompressedGamedata = async function (savefileId, encoded) {
    return base64Decode(encoded)
      .then(json => StorageManager.jsonToObject(json))
      .then(async (obj: { data: any, info: any }) => {
        return StorageManager.saveObject(this.makeSavename(savefileId), obj.data).then(() => {
          this._globalInfo![savefileId] = obj.info;
          this.saveGlobalInfo();
          return 0;
        });
      });
  };
}

DataManager_ImportExportSaveFileMixIn(DataManager);

function Scene_File_ImportExportSaveFileMixIn(sceneFile: Scene_File) {

  const _createListWindow = sceneFile.createListWindow;
  sceneFile.createListWindow = function () {
    _createListWindow.call(this);
    this.createOkCancelButton();
    if (settings.menuButtonType === MENU_BUTTON_TYPE.XY) {
      this.createImportExportButton();
    } else {
      this._listWindow.setExportHandler(this.onExportClicked.bind(this));
      this._listWindow.setImportHandler(this.onImportClicked.bind(this));
    }
  };

  const _start = sceneFile.start;
  sceneFile.start = function () {
    _start.call(this);
    this._listWindow.setTopRow(this.firstSavefileId() - 2);
    this._listWindow.select(this.firstSavefileId());
  };

  sceneFile.createOkCancelButton = function () {
    this._okButton = new Sprite_ImportExportButton(BUTTON_TYPE.OK);
    this._okButton.x = settings.okButtonPos.x;
    this._okButton.y = settings.okButtonPos.y;
    this._okButton.visible = false;
    this.addChild(this._okButton);

    this._cancelButton = new Sprite_ImportExportButton(BUTTON_TYPE.CANCEL);
    this._cancelButton.x = settings.cancelButtonPos.x;
    this._cancelButton.y = settings.cancelButtonPos.y;
    this._cancelButton.visible = false;
    this.addChild(this._cancelButton);

  }

  sceneFile.createImportExportButton = function () {
    this._importButton = new Sprite_ImportExportButton(BUTTON_TYPE.IMPORT);
    this._importButton.x = settings.importButtonPos.x;
    this._importButton.y = settings.importButtonPos.y;
    this._importButton.setClickHandler(this.onImportClicked.bind(this));
    this.addChild(this._importButton);

    this._exportButton = new Sprite_ImportExportButton(BUTTON_TYPE.EXPORT);
    this._exportButton.x = settings.exportButtonPos.x;
    this._exportButton.y = settings.exportButtonPos.y;
    this._exportButton.setClickHandler(this.onExportClicked.bind(this));
    this.addChild(this._exportButton);
  }

  sceneFile.onExportClicked = function () {
    this._listWindow.deactivate();
    DataManager.loadCompressedGamedata(this.savefileId())
      .then(base64 => Graphics.setImportExportAreaValue(base64))
      .then(() => {
        Graphics.setImportExportAreaPlaceholder("");
        Graphics.showImportExportArea();
        this._okButton.visible = true;
        this._cancelButton.visible = false;
        this._okButton.setClickHandler(this.onExportOkClicked.bind(this));
        this._cancelButton.setClickHandler(null);
        this._helpWindow.setText(settings.exportHelpText);
        SoundManager.playOk();
      })
      .catch((reason) => {
        SoundManager.playBuzzer();
        this.activateListWindow();
        console.error(reason);
      });
  }

  sceneFile.onImportClicked = function () {
    this._listWindow.deactivate();
    Graphics.setImportExportAreaValue("");
    Graphics.setImportExportAreaPlaceholder(settings.importHelpText);
    Graphics.showImportExportArea();
    this._okButton.visible = true;
    this._cancelButton.visible = true;
    this._okButton.setClickHandler(this.onImportOkClicked.bind(this));
    this._cancelButton.setClickHandler(this.onImportCancelClicked.bind(this));
    this._helpWindow.setText(settings.importHelpText);
  }

  sceneFile.onExportOkClicked = function () {
    Graphics.hideImportExportArea();
    this._okButton.visible = false;
    this.activateListWindow();
    this._helpWindow.setText(this.helpWindowText());
    this._okButton.setClickHandler(null);
    SoundManager.playOk();
  }

  sceneFile.onImportOkClicked = function () {
    const string = Graphics.importExportAreaValue();
    DataManager.saveCompressedGamedata(this.savefileId(), string)
      .then(() => {
        SoundManager.playSave();
        this._listWindow.refresh();
        this.onImportCancelClicked();
      })
      .catch(() => {
        SoundManager.playBuzzer();
        this.onImportCancelClicked();
      });
  }

  sceneFile.onImportCancelClicked = function () {
    Graphics.hideImportExportArea();
    this._okButton.visible = false;
    this._cancelButton.visible = false;
    this.activateListWindow();
    this._helpWindow.setText(this.helpWindowText());
    this._okButton.setClickHandler(null);
    this._cancelButton.setClickHandler(null);
  }

}

Scene_File_ImportExportSaveFileMixIn(Scene_File.prototype);

const MENU_BUTTON_TYPE = {
  ON_FILE: 1,
  XY: 2,
};

function Window_SavefileList_ImportExportSaveFileMixIn(windowClass: Window_SavefileList) {
  const _initialize = windowClass.initialize;
  windowClass.initialize = function (rect) {
    _initialize.call(this, rect);
    if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY) {
      this.createImportExportButton();
    }
  };

  windowClass.createImportExportButton = function () {
    this._importButton = new Sprite_ImportExportButton(BUTTON_TYPE.IMPORT);
    this.addChild(this._importButton);

    this._exportButton = new Sprite_ImportExportButton(BUTTON_TYPE.EXPORT);
    this.addChild(this._exportButton);
  }

  const _refreshCursor = windowClass.refreshCursor;
  windowClass.refreshCursor = function () {
    _refreshCursor.call(this);
    if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY && this._importButton && this._exportButton) {
      if (this._cursorAll) {
        this._importButton.visible = false;
        this._exportButton.visible = false;
      } else if (this.index() >= 0) {
        const rect = this.itemRect(this.index());
        this._exportButton.x = rect.x + rect.width - this._exportButton.width;
        this._exportButton.y = rect.y + this._exportButton.height / 2;
        this._importButton.x = this._exportButton.x - this._importButton.width - 20;
        this._importButton.y = rect.y + this._importButton.height / 2;
        this._exportButton.visible = DataManager.isThisGameFile(this.index());
        this._importButton.visible = true;
      } else {
        this._exportButton.visible = false;
        this._importButton.visible = false;
        this.setCursorRect(0, 0, 0, 0);
      }
    }
  };

  windowClass.setExportHandler = function (handler: () => void) {
    if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY) {
      this._exportButton.setClickHandler(handler);
    }
  }

  windowClass.setImportHandler = function (handler) {
    if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY) {
      this._importButton.setClickHandler(handler);
    }
  }

  const _processTouch = windowClass.processTouch;
  windowClass.processTouch = function () {
    if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY && (this._importButton.isBeingTouched() || this._exportButton.isBeingTouched())) {
      return;
    }
    _processTouch.call(this);
  };
}

Window_SavefileList_ImportExportSaveFileMixIn(Window_SavefileList.prototype);

const BUTTON_TYPE = {
  OK: 'buttonOk',
  CANCEL: 'buttonCancel',
  IMPORT: 'buttonImport',
  EXPORT: 'buttonExport',
};

class Sprite_ImportExportButton extends Sprite_Button {
  public setupFrames(): void {
    this.loadButtonImage();
  }

  imageFilename() {
    switch (this._buttonType) {
      case BUTTON_TYPE.OK:
        return settings.buttonImages.ok;
      case BUTTON_TYPE.CANCEL:
        return settings.buttonImages.cancel;
      case BUTTON_TYPE.IMPORT:
        return settings.buttonImages.import;
      case BUTTON_TYPE.EXPORT:
        return settings.buttonImages.export;
      default:
        throw `不正なボタン種別です。 ${this._buttonType}`;
    }
  }

  public loadButtonImage(): void {
    this.bitmap = ImageManager.loadSystem(this.imageFilename());
    this.bitmap.addLoadListener(() => {
      const h = this.bitmap!.height;
      const w = this.bitmap!.width;
      this.setColdFrame(0, 0, w, h / 2);
      this.setHotFrame(0, h / 2, w, h / 2);
      this.updateFrame();
      this.updateOpacity();
    });
  }

  public checkBitmap(): void { }

  public onClick(): void {
    if (this._clickHandler) {
      this._clickHandler();
    }
  }
}
