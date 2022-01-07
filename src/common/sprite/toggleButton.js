export class Sprite_ToggleButton extends Sprite_Clickable {
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
