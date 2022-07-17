import { settings } from './_build/DarkPlasma_AllocateUniqueEffectCode_parameters';

let uniqueEffectCode = settings.startOfUniqueEffectCode;

class UniqueEffectCodeCache {
  constructor() {
    this._cache = {};
    this._cacheById = {};
  }

  /**
   * @param {string} pluginName プラグイン名
   * @param {number} localId プラグイン内で一意なID
   */
  allocate(pluginName, localId) {
    const key = this.key(pluginName, localId);
    if (!this._cache[key]) {
      this._cache[key] = new UniqueEffectCode(uniqueEffectCode);
      this._cacheById[uniqueEffectCode] = this._cache[key];
      uniqueEffectCode++;
    }
    return this._cache[key];
  }

  /**
   * @param {string} pluginName プラグイン名
   * @param {number} localId プラグイン内で一意なID
   * @return {string}
   */
  key(pluginName, localId) {
    return `${pluginName}_${localId}`;
  }

  /**
   * @param {string} pluginName
   * @param {number} localId
   * @return {number|undefined}
   */
  effectCodeOf(pluginName, localId) {
    const key = this.key(pluginName, localId);
    return this._cache[key] ? this._cache[key].code : undefined;
  }
}

const uniqueEffectCodeCache = new UniqueEffectCodeCache();
globalThis.uniqueEffectCodeCache = uniqueEffectCodeCache;

class UniqueEffectCode {
  /**
   * @param {number} code 効果コードID
   */
  constructor(code) {
    this._code = code;
  }

  get code() {
    return this._code;
  }
}
