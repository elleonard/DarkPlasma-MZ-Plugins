/**
 * @template TScene
 * @param {TScene} SceneClass
 * @return {TScene}
 * @mixin
 */
export const Scene_BookLayoutMixIn = (SceneClass) =>
  class extends SceneClass {
    /**
     * @return {Rectangle}
     */
    percentWindowRect() {
      return new Rectangle(0, 0, Graphics.boxWidth / 3, this.percentWindowHeight());
    }

    /**
     * @return {number}
     */
    percentWindowHeight() {
      return this.calcWindowHeight(2, false);
    }

    /**
     * @return {Rectangle}
     */
    indexWindowRect() {
      return new Rectangle(0, this.percentWindowHeight(), this.indexWindowWidth(), this.indexWindowHeight());
    }

    /**
     * @return {number}
     */
    indexWindowWidth() {
      return Math.floor(Graphics.boxWidth / 3);
    }

    /**
     * @return {number}
     */
    indexWindowHeight() {
      return Graphics.boxHeight - this.percentWindowHeight();
    }

    /**
     * @return {Rectangle}
     */
    mainWindowRect() {
      const x = this.indexWindowWidth();
      const y = 0;
      return new Rectangle(x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
    }
  };
