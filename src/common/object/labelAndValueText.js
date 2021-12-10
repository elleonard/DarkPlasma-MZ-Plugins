export class LabelAndValueText {
  /**
   * @param {string} label
   * @param {?string} valueText
   */
  constructor(label, valueText) {
    this._label = label;
    this._valueText = valueText;
  }

  /**
   * @return {string}
   */
  get label() {
    return this._label;
  }

  /**
   * @return {string}
   */
  get valueText() {
    return this._valueText || '';
  }
}
