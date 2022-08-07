import { settings } from './_build/DarkPlasma_MasterVolume_parameters';

/**
 * @param {typeof ConfigManager} configManager
 */
function ConfigManager_MasterVolumeMixIn(configManager) {
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
    this.masterVolume = config.masterVolume ? this.readVolume(config, 'masterVolume') : settings.defaultVolume;
  };
}

ConfigManager_MasterVolumeMixIn(ConfigManager);

/**
 * @param {typeof AudioManager} audioManager
 */
function AudioManager_MasterVolumeMixIn(audioManager) {
  audioManager._masterVolume = 100;

  Object.defineProperty(audioManager, 'masterVolume', {
    get: function () {
      return this._masterVolume;
    },
    set: function (value) {
      this._masterVolume = value;
      WebAudio.setMasterVolume(this._masterVolume / 100);
      Video.setVolume(this._masterVolume / 100);
    },
    configurable: true,
  });
}

AudioManager_MasterVolumeMixIn(AudioManager);

/**
 * @param {Scene_Options.prototype} sceneOptions
 */
function Scene_Options_MasterVolumeMixIn(sceneOptions) {
  const _maxCommands = sceneOptions.maxCommands;
  sceneOptions.maxCommands = function () {
    return _maxCommands.call(this) + 1;
  };
}

Scene_Options_MasterVolumeMixIn(Scene_Options.prototype);

/**
 * @param {Window_Options.prototype} windowClass
 */
function Window_Options_MasterVolumeMixIn(windowClass) {
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
