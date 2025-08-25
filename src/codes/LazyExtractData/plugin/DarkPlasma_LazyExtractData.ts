/// <reference path="./LazyExtractData.d.ts" />

function DataManager_LazyExtractDataMixIn(dataManager: typeof DataManager) {
  dataManager.lazyExtractData = function () {
    this._lazyExtractData.forEach(data => this.lazyExtractMetadata(data));
  };

  dataManager.pushLazyExtractData = function (data) {
    if (!this._lazyExtractData) {
      this._lazyExtractData = [];
    }
    this._lazyExtractData.push(data);
  };

  dataManager.lazyExtractMetadata = function (data) {};
}

DataManager_LazyExtractDataMixIn(DataManager);

function Scene_Boot_LazyExtractDataMixIn(sceneBoot: Scene_Boot) {
  const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
  sceneBoot.onDatabaseLoaded = function () {
    _onDatabaseLoaded.call(this);
    DataManager.lazyExtractData();
  };
}

Scene_Boot_LazyExtractDataMixIn(Scene_Boot.prototype);
