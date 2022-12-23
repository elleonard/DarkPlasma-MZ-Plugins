// DarkPlasma_ImportExportSaveFile 1.1.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/12/23 1.1.0 インポート時の説明文をplaceholderに変更
 * 2022/12/22 1.0.0 リファクタ
 *            0.0.1 公開
 */

/*:ja
 * @plugindesc セーブデータのインポート・エクスポート機能
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param textAreaRect
 * @text セーブデータ表示エリア
 * @type struct<Rectangle>
 * @default {"x":"208", "y":"100", "width":"400", "height":"400"}
 *
 * @param okButtonPos
 * @text OKボタン座標
 * @type struct<Point>
 * @default {"x":"308", "y":"520"}
 *
 * @param cancelButtonPos
 * @text キャンセルボタン座標
 * @type struct<Point>
 * @default {"x":"508", "y":"520"}
 *
 * @param menuButtonType
 * @text イン/エクスポートボタン位置
 * @type select
 * @option 選択中のセーブファイル上
 * @value 1
 * @option 指定した座標
 * @value 2
 * @default 1
 *
 * @param importButtonPos
 * @desc イン/エクスポートボタン位置設定が指定した座標である場合に有効です。
 * @text インポートボタン座標
 * @type struct<Point>
 * @default {"x":"680", "y":"16"}
 *
 * @param exportButtonPos
 * @desc イン/エクスポートボタン位置設定が指定した座標である場合に有効です。
 * @text エクスポートボタン座標
 * @type struct<Point>
 * @default {"x":"750", "y":"16"}
 *
 * @param exportHelpText
 * @text エクスポート説明文
 * @type string
 * @default 表示されているテキストを保存してください。
 *
 * @param importHelpText
 * @text インポート説明文
 * @type string
 * @default セーブデータのテキストを貼り付けてください。
 *
 * @param buttonImages
 * @text ボタン画像
 * @type struct<ButtonImage>
 * @default {"ok":"buttonOk", "cancel":"buttonCancel", "import":"buttonImport", "export":"buttonExport"}
 *
 * @help
 * version: 1.1.0
 * 本プラグインはkienさんの「セーブデータのインポート・エクスポート」を
 * MZ移植したものです。
 *
 * このプラグインが動作するには以下の画像ファイルが
 * img/system内に存在する必要があります：
 *
 * 'buttonOk' :
 * インポート・エクスポート画面においてユーザーの
 * アクションを決定するボタンとして表示されます。
 * 'buttonCancel' : インポート画面において
 * インポートを行わずにセーブ・ロード画面に戻るボタンとして表示されます。
 * 'buttonImport' : セーブ・ロード画面において
 * インポート画面に移行するためのボタンとして表示されます。
 * 'buttonExport' : セーブ・ロード画面において
 * エクスポート画面に移行するためのボタンとして表示されます。
 *
 * 画像はデフォルト素材の'ButtonSet'と同様、
 * 上半分にデフォルト状態、
 * 下半分に押された状態の画像として作成してください。
 */
/*~struct~Rectangle:
 * @param x
 * @text X座標
 * @type number
 *
 * @param y
 * @text Y座標
 * @type number
 *
 * @param width
 * @text 横幅
 * @type number
 *
 * @param height
 * @text 高さ
 * @type number
 */
/*~struct~Point:
 * @param x
 * @text X座標
 * @type number
 *
 * @param y
 * @text Y座標
 * @type number
 */
/*~struct~ButtonImage:
 * @param ok
 * @text OKボタン
 * @type file
 * @default buttonOk
 * @dir img/system
 *
 * @param cancel
 * @text キャンセルボタン
 * @type file
 * @default buttonCancel
 * @dir img/system
 *
 * @param import
 * @text インポートボタン
 * @type file
 * @default buttonImport
 * @dir img/system
 *
 * @param export
 * @text エクスポートボタン
 * @type file
 * @default buttonExport
 * @dir img/system
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    textAreaRect: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
        width: Number(parsed.width || 0),
        height: Number(parsed.height || 0),
      };
    })(pluginParameters.textAreaRect || '{"x":"208", "y":"100", "width":"400", "height":"400"}'),
    okButtonPos: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
      };
    })(pluginParameters.okButtonPos || '{"x":"308", "y":"520"}'),
    cancelButtonPos: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
      };
    })(pluginParameters.cancelButtonPos || '{"x":"508", "y":"520"}'),
    menuButtonType: Number(pluginParameters.menuButtonType || 1),
    importButtonPos: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
      };
    })(pluginParameters.importButtonPos || '{"x":"680", "y":"16"}'),
    exportButtonPos: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
      };
    })(pluginParameters.exportButtonPos || '{"x":"750", "y":"16"}'),
    exportHelpText: String(pluginParameters.exportHelpText || '表示されているテキストを保存してください。'),
    importHelpText: String(pluginParameters.importHelpText || 'セーブデータのテキストを貼り付けてください。'),
    buttonImages: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        ok: String(parsed.ok || 'buttonOk'),
        cancel: String(parsed.cancel || 'buttonCancel'),
        import: String(parsed.import || 'buttonImport'),
        export: String(parsed.export || 'buttonExport'),
      };
    })(
      pluginParameters.buttonImages ||
        '{"ok":"buttonOk", "cancel":"buttonCancel", "import":"buttonImport", "export":"buttonExport"}'
    ),
  };

  function Graphics_ImportExportSaveFileMixIn(graphics) {
    const _createAllElements = graphics._createAllElements;
    graphics._createAllElements = function () {
      _createAllElements.call(this);
      this._createImportExportArea();
    };
    graphics._createImportExportArea = function () {
      this._importExportElement = document.createElement('textarea');
      this._importExportElement.style.position = 'absolute';
      this._importExportElement.style.left = `${settings.textAreaRect.x}px`;
      this._importExportElement.style.top = `${settings.textAreaRect.y}px`;
      this._importExportElement.style.width = `${settings.textAreaRect.width}px`;
      this._importExportElement.style.height = `${settings.textAreaRect.height}px`;
      this._importExportElement.style.zIndex = '98';
    };
    graphics.showImportExportArea = function () {
      this._importExportElement.setSelectionRange(0, this._importExportElement.textLength);
      document.body.appendChild(this._importExportElement);
    };
    graphics.hideImportExportArea = function () {
      document.body.removeChild(this._importExportElement);
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
  async function base64Encode(text) {
    return new Promise((resolve) => resolve(btoa(encodeURIComponent(text))));
  }
  async function base64Decode(text) {
    return new Promise((resolve) => resolve(decodeURIComponent(atob(text))));
  }
  function DataManager_ImportExportSaveFileMixIn(dataManager) {
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
    dataManager.loadCompressedGamedata = async function (savefileId) {
      return StorageManager.loadObject(this.makeSavename(savefileId)).then((content) => {
        return StorageManager.objectToJson({
          data: content,
          info: this._globalInfo[savefileId],
        }).then((json) => base64Encode(json));
      });
    };
    dataManager.saveCompressedGamedata = async function (savefileId, encoded) {
      return base64Decode(encoded)
        .then((json) => StorageManager.jsonToObject(json))
        .then(async (obj) => {
          return StorageManager.saveObject(this.makeSavename(savefileId), obj.data).then(() => {
            this._globalInfo[savefileId] = obj.info;
            this.saveGlobalInfo();
            return 0;
          });
        });
    };
  }
  DataManager_ImportExportSaveFileMixIn(DataManager);
  function Scene_File_ImportExportSaveFileMixIn(sceneFile) {
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
    };
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
    };
    sceneFile.onExportClicked = function () {
      this._listWindow.deactivate();
      DataManager.loadCompressedGamedata(this.savefileId())
        .then((base64) => Graphics.setImportExportAreaValue(base64))
        .then(() => {
          Graphics.setImportExportAreaPlaceholder('');
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
    };
    sceneFile.onImportClicked = function () {
      this._listWindow.deactivate();
      Graphics.setImportExportAreaValue('');
      Graphics.setImportExportAreaPlaceholder(settings.importHelpText);
      Graphics.showImportExportArea();
      this._okButton.visible = true;
      this._cancelButton.visible = true;
      this._okButton.setClickHandler(this.onImportOkClicked.bind(this));
      this._cancelButton.setClickHandler(this.onImportCancelClicked.bind(this));
      this._helpWindow.setText(settings.importHelpText);
    };
    sceneFile.onExportOkClicked = function () {
      Graphics.hideImportExportArea();
      this._okButton.visible = false;
      this.activateListWindow();
      this._helpWindow.setText(this.helpWindowText());
      this._okButton.setClickHandler(null);
      SoundManager.playOk();
    };
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
    };
    sceneFile.onImportCancelClicked = function () {
      Graphics.hideImportExportArea();
      this._okButton.visible = false;
      this._cancelButton.visible = false;
      this.activateListWindow();
      this._helpWindow.setText(this.helpWindowText());
      this._okButton.setClickHandler(null);
      this._cancelButton.setClickHandler(null);
    };
  }
  Scene_File_ImportExportSaveFileMixIn(Scene_File.prototype);
  const MENU_BUTTON_TYPE = {
    ON_FILE: 1,
    XY: 2,
  };
  function Window_SavefileList_ImportExportSaveFileMixIn(windowClass) {
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
    };
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
    windowClass.setExportHandler = function (handler) {
      if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY) {
        this._exportButton.setClickHandler(handler);
      }
    };
    windowClass.setImportHandler = function (handler) {
      if (settings.menuButtonType !== MENU_BUTTON_TYPE.XY) {
        this._importButton.setClickHandler(handler);
      }
    };
    const _processTouch = windowClass.processTouch;
    windowClass.processTouch = function () {
      if (
        settings.menuButtonType !== MENU_BUTTON_TYPE.XY &&
        (this._importButton.isBeingTouched() || this._exportButton.isBeingTouched())
      ) {
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
    setupFrames() {
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
    loadButtonImage() {
      this.bitmap = ImageManager.loadSystem(this.imageFilename());
      this.bitmap.addLoadListener(() => {
        const h = this.bitmap.height;
        const w = this.bitmap.width;
        this.setColdFrame(0, 0, w, h / 2);
        this.setHotFrame(0, h / 2, w, h / 2);
        this.updateFrame();
        this.updateOpacity();
      });
    }
    checkBitmap() {}
    onClick() {
      if (this._clickHandler) {
        this._clickHandler();
      }
    }
  }
})();
