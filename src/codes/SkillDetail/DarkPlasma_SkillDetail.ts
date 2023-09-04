import { settings } from './_build/DarkPlasma_SkillDetail_parameters';

const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  if ($dataSkills && this.isSkill(data)) {
    if (data.meta.detail) {
      data.detail = String(data.meta.detail).replace(/^(\r|\n| |\t)+/, '');
    }
  }
};

function Scene_Skill_SkillDetailMixIn(sceneSkill: Scene_Skill) {
  const _create = sceneSkill.create;
  sceneSkill.create = function () {
    _create.call(this);
    this.createDetailWindow();
  };

  const _createItemWindow = sceneSkill.createItemWindow;
  sceneSkill.createItemWindow = function () {
    _createItemWindow.call(this);
    this._itemWindow.setHandler('detail', this.toggleDetailWindow.bind(this));
  };

  sceneSkill.toggleDetailWindow = function () {
    this._itemWindow.activate();
    if (!this._detailWindow.visible) {
      this._detailWindow.show();
      this._detailWindow.resetCursor();
    } else {
      this._detailWindow.hide();
      this._detailWindow.resetCursor();
    }
  };

  sceneSkill.createDetailWindow = function () {
    this._detailWindowLayer = new WindowLayer();
    this._detailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._detailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._detailWindowLayer);
    this._detailWindow = new Window_SkillDetail(this.detailWindowRect());
    this._detailWindowLayer.addChild(this._detailWindow);
    this._itemWindow.setDescriptionWindow(this._detailWindow);
  };

  sceneSkill.detailWindowRect = function () {
    return this.itemWindowRect();
  };
}

Scene_Skill_SkillDetailMixIn(Scene_Skill.prototype);

Window_CustomKeyHandlerMixIn(settings.openDetailKey, Window_SkillList.prototype, 'detail');

function Window_SkillDetailMixIn(windowClass: Window_SkillList) {
  windowClass.setDescriptionWindow = function (detailWindow) {
    this._detailWindow = detailWindow;
    this.callUpdateHelp();
  };

  const _setHelpWindowItem = windowClass.setHelpWindowItem;
  windowClass.setHelpWindowItem = function (item) {
    _setHelpWindowItem.call(this, item);
    if (this._detailWindow) {
      this._detailWindow.setItem(item);
    }
  };

  const _isCursorMovable = windowClass.isCursorMovable;
  windowClass.isCursorMovable = function () {
    if (this._detailWindow) {
      return _isCursorMovable.call(this) && !this._detailWindow.visible;
    }
    return _isCursorMovable.call(this);
  };

  const _isOkEnabled = windowClass.isOkEnabled;
  windowClass.isOkEnabled = function () {
    if (this._detailWindow) {
      return _isOkEnabled.call(this) && !this._detailWindow.visible;
    }
    return _isOkEnabled.call(this);
  };

  const _processCancel = windowClass.processCancel;
  windowClass.processCancel = function () {
    if (this._detailWindow) {
      this._detailWindow.hide();
      this._detailWindow.resetCursor();
    }
    _processCancel.call(this);
  };
}

Window_SkillDetailMixIn(Window_SkillList.prototype);

class Window_SkillDetail extends Window_Base {
  _text: string;
  _cursor: number;
  _textHeight: number;
  _lineCount: number;

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this._text = '';
    this.opacity = 255;
    this._cursor = 0;
    this.hide();
  }

  drawDetail(detail: string) {
    this.drawTextEx(detail, this.lineWidthMargin ? this.lineWidthMargin() : 0, this.baseLineHeight());
  }

  baseLineHeight(): number {
    return -this._cursor * this.lineHeight();
  }

  refresh() {
    this.contents.clear();
    this.drawDetail(this._text);
  }

  setItem(item: MZ.Skill) {
    this.setText(item && item.detail ? item.detail : '');
  }

  setText(text: string) {
    if (this._text !== text) {
      this._text = text;
      this._textHeight = this.calcHeight();
      this._lineCount = Math.floor(this._textHeight / this.lineHeight());
      this.refresh();
    }
  }

  calcHeight(): number {
    if (this._text) {
      return this.textSizeEx(this._text).height;
    }
    return 0;
  }

  /**
   * 1画面で表示する最大行数
   */
  maxLine() {
    return Math.floor(this.contentsHeight() / this.lineHeight());
  }

  clear() {
    this.setText('');
  }

  update() {
    super.update();
    this.updateArrows();
    this.processCursorMove();
  }

  updateArrows() {
    this.upArrowVisible = this._cursor > 0;
    this.downArrowVisible = !this.isCursorMax();
  }

  processCursorMove() {
    if (this.isCursorMovable()) {
      if (Input.isRepeated('down')) {
        this.cursorDown();
      }
      if (Input.isRepeated('up')) {
        this.cursorUp();
      }
    }
  }

  isCursorMovable(): boolean {
    return this.visible;
  }

  cursorUp() {
    if (this._cursor > 0) {
      this._cursor--;
      this.refresh();
    }
  }

  cursorDown() {
    if (!this.isCursorMax()) {
      this._cursor++;
      this.refresh();
    }
  }

  isCursorMax(): boolean {
    return this.maxLine() + this._cursor >= this._lineCount;
  }

  resetCursor() {
    if (this._cursor > 0) {
      this._cursor = 0;
      this.refresh();
    }
  }
}

type _Window_SkillDetail = typeof Window_SkillDetail;
declare global {
  function Window_SkillDetailMixIn(windowClass: Window_SkillList): void;
  var Window_SkillDetail: _Window_SkillDetail;
}
globalThis.Window_SkillDetailMixIn = Window_SkillDetailMixIn;
globalThis.Window_SkillDetail = Window_SkillDetail;
