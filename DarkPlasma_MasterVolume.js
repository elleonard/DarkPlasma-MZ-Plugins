// DarkPlasma_MasterVolume 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/07 1.0.0 公開
 */

/*:ja
 * @plugindesc マスターボリュームを設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param optionName
 * @text 設定項目名
 * @type string
 * @default 全体 音量
 *
 * @param defaultVolume
 * @text 初期値
 * @type number
 * @default 100
 * @max 100
 *
 * @param offset
 * @text 音量の増減量
 * @type number
 * @default 20
 *
 * @help
 * version: 1.0.0
 * オプション画面にマスターボリュームを追加します。
 * BGM/BGS/ME/SEすべての音量を一括調整できます。
 *
 * 本プラグインはゲームアツマールでは使用できません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    optionName: String(pluginParameters.optionName || '全体 音量'),
    defaultVolume: Number(pluginParameters.defaultVolume || 100),
    offset: Number(pluginParameters.offset || 20),
  };

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
})();
