const _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function (object) {
  _DataManager_onLoad.call(this, object);
  if (object === $dataClasses) {
    object
      .filter((clazz: MZ.Class) => clazz)
      .forEach((clazz: MZ.Class) => {
        this.extractArrayMetadata(clazz.learnings);
      });
  }
};
