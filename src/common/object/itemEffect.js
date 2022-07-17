export class ItemEffect {
  /**
   * @param {number} code
   * @param {?number} dataId
   * @param {?number} value1
   * @param {?number} value2
   */
  constructor(code, dataId, value1, value2) {
    this._code = code;
    this._dataId = dataId || 0;
    this._value1 = value1 || 0;
    this._value2 = value2 || 0;
  }

  /**
   * @return {number}
   */
  get code() {
    return this._code;
  }

  /**
   * @return {number}
   */
  get dataId() {
    return this._dataId;
  }

  /**
   * @return {number}
   */
  get value1() {
    return this._value1;
  }

  /**
   * @return {number}
   */
  get value2() {
    return this._value2;
  }
}
