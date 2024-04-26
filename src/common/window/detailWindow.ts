export class Window_DetailText extends Window_Scrollable {
  _text: string;

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this._text = '';
    this.hide();
  }

  setItem(item: DataManager.NoteHolder|null) {
    this.setText(this.detailText(item));
  }

  setText(text: string) {
    if (this._text !== text) {
      this._text = text;
      this.refresh();
    }
  }

  detailText(item: DataManager.NoteHolder|null): string {
    const detailText = String(item?.meta.detail || '')
    return this.mustTrimText() ? detailText.trim() : detailText;
  }

  mustTrimText() {
    return true;
  }

  drawDetail(detail: string) {
    this.drawTextEx(detail, 0, this.baseLineY());
  }

  baseLineY() {
    return -(this.scrollBaseY()/this.scrollBlockHeight()) * this.lineHeight();
  }

  public scrollBlockHeight(): number {
    return this.lineHeight();
  }

  public overallHeight(): number {
    return this.textSizeEx(this._text).height + this.heightAdjustment();
  }

  heightAdjustment() {
    return 32;
  }

  public paint(): void {
    this.contents.clear();
    this.drawDetail(this._text);
  }

  refresh() {
    this.paint();
  }

  public update(): void {
    super.update();
    this.processCursorMove();
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

  isCursorMovable() {
    return this.visible;
  }

  cursorDown() {
    if (this.scrollY() <= this.maxScrollY()) {
      this.smoothScrollDown(1);
    }
  }

  cursorUp() {
    if (this.scrollY() > 0) {
      this.smoothScrollUp(1);
    }
  }
}
