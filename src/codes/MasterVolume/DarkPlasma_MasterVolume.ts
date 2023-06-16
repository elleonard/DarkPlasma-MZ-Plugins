/// <reference path="./MasterVolume.d.ts" />

import { settings } from './_build/DarkPlasma_MasterVolume_parameters';

function WebAudio_MasterVolumeMixIn(webAudio: typeof WebAudio) {
  const _initialize = webAudio.initialize;
  webAudio.initialize = function () {
    const result = _initialize.call(this);
    this.setMasterVolume(settings.defaultVolume/100);
    return result;
  };
}

WebAudio_MasterVolumeMixIn(WebAudio);

function ConfigManager_MasterVolumeMixIn(configManager: typeof ConfigManager) {
  Object.defineProperty(configManager, 'masterVolume', {
    get: function () {
      return AudioManager._masterVolume;
    },
    set: function (value) {
      AudioManager.masterVolume = value;
    },
    configurable: true,
  });

  const _makeData = configManager.makeData;
  configManager.makeData = function () {
    const config = _makeData.call(this);
    config.masterVolume = this.masterVolume;
    return config;
  };

  const _applyData = configManager.applyData;
  configManager.applyData = function (config) {
    _applyData.call(this, config);
    this.masterVolume = Number.isFinite(config.masterVolume)
      ? this.readVolume(config, 'masterVolume')
      : settings.defaultVolume;
  };
}

ConfigManager_MasterVolumeMixIn(ConfigManager);

function AudioManager_MasterVolumeMixIn(audioManager: typeof AudioManager) {
  Object.defineProperty(audioManager, 'masterVolume', {
    get: function () {
      return this._masterVolume;
    },
    set: function (this: typeof AudioManager, value) {
      this._masterVolume = value;
      WebAudio.setMasterVolume(this._masterVolume / 100);
      Video.setVolume(this._masterVolume / 100);
      if (this._currentBgm) {
        this.updateBgmParameters(this._currentBgm);
      }
    },
    configurable: true,
  });

  audioManager.masterVolume = settings.defaultVolume;
}

AudioManager_MasterVolumeMixIn(AudioManager);

function Scene_Options_MasterVolumeMixIn(sceneOptions: Scene_Options) {
  const _maxCommands = sceneOptions.maxCommands;
  sceneOptions.maxCommands = function () {
    return _maxCommands.call(this) + 1;
  };
}

Scene_Options_MasterVolumeMixIn(Scene_Options.prototype);

function Window_Options_MasterVolumeMixIn(windowClass: Window_Options) {
  const _addVolumeOptions = windowClass.addVolumeOptions;
  windowClass.addVolumeOptions = function () {
    this.addCommand(settings.optionName, 'masterVolume');
    _addVolumeOptions.call(this);
  };

  windowClass.volumeOffset = function () {
    return settings.offset;
  };
}

Window_Options_MasterVolumeMixIn(Window_Options.prototype);
