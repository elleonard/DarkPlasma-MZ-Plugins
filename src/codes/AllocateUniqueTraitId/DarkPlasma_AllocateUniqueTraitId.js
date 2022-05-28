import { settings } from './_build/DarkPlasma_AllocateUniqueTraitId_parameters';

let uniqueTraitId = settings.startIdOfUniqueTraitId;

class UniqueTraitIdCache {
  constructor() {
    this._cache = {};
    this._cacheById = {};
  }

  /**
   * 独自のtraitIdを確保する
   * @param {string} pluginName プラグイン名
   * @param {number} localId プラグイン内で一意なID
   * @param {string} name 特徴名
   * @return {UniqueTraitId}
   */
  allocate(pluginName, localId, name) {
    const key = this.key(pluginName, localId);
    if (!this._cache[key]) {
      this._cache[key] = new UniqueTraitId(uniqueTraitId, name);
      this._cacheById[uniqueTraitId] = this._cache[key];
      uniqueTraitId++;
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

  traitIdOf(pluginName, localId) {
    const key = this.key(pluginName, localId);
    return this._cache[key] ? this._cache[key].id : undefined;
  }

  /**
   * 特徴名を取得する
   * @param {string} pluginName プラグイン名
   * @param {number} localId プラグイン内で一意なID
   * @return {string}
   */
  nameOf(pluginName, localId) {
    const key = this.key(pluginName, localId);
    return this._cache[key] ? this._cache[key].name : undefined;
  }

  /**
   * 特徴名
   * @param {number} id 特徴ID
   * @return {string}
   */
  nameByTraitId(id) {
    return this._cacheById[id] ? this._cacheById[id].name : undefined;
  }
}

const uniqueTraitIdCache = new UniqueTraitIdCache();

globalThis.uniqueTraitIdCache = uniqueTraitIdCache;

class UniqueTraitId {
  /**
   * @param {number} id 特徴ID
   * @param {string} name 特徴名
   */
  constructor(id, name) {
    this._id = id;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
