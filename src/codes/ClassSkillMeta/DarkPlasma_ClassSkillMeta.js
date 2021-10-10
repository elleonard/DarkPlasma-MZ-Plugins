const _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function (object) {
  _DataManager_onLoad.call(this, object);
  if (object === $dataClasses) {
    object
      .filter((clazz) => clazz)
      .forEach((clazz) => {
        this.extractArrayMetadata(clazz.learnings);
      });
  }
};
