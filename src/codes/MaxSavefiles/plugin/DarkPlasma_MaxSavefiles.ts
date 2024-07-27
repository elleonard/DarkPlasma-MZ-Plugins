/// <reference path="./MaxSavefiles.d.ts" />

import { settings } from '../config/_build/DarkPlasma_MaxSavefiles_parameters';

function DataManager_MaxSavefilesMixIn(dataManager: typeof DataManager) {
  dataManager.maxSavefiles = function () {
    return settings.maxSavefiles;
  };
}

DataManager_MaxSavefilesMixIn(DataManager);
