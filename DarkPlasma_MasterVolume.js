// DarkPlasma_MasterVolume 1.0.2
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/06/14 1.0.2 typescript移行
 *                  初期値の設定が効かない不具合を修正
 * 2022/08/07 1.0.1 マスターボリューム0で保存するとデフォルトに戻される不具合を修正
 *            1.0.0 公開
 */

/*:
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
 * version: 1.0.2
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
    optionName: String(pluginParameters.optionName || `全体 音量`),
    defaultVolume: Number(pluginParameters.defaultVolume || 100),
    offset: Number(pluginParameters.offset || 20),
  };

  function WebAudio_MasterVolumeMixIn(webAudio) {
    const _initialize = webAudio.initialize;
    webAudio.initialize = function () {
      const result = _initialize.call(this);
      this.setMasterVolume(settings.defaultVolume);
      return result;
    };
  }
  WebAudio_MasterVolumeMixIn(WebAudio);
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
      this.masterVolume = Number.isFinite(config.masterVolume)
        ? this.readVolume(config, 'masterVolume')
        : settings.defaultVolume;
    };
  }
  ConfigManager_MasterVolumeMixIn(ConfigManager);
  function AudioManager_MasterVolumeMixIn(audioManager) {
    Object.defineProperty(audioManager, 'masterVolume', {
      get: function () {
        return this._masterVolume;
      },
      set: function (value) {
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
  function Scene_Options_MasterVolumeMixIn(sceneOptions) {
    const _maxCommands = sceneOptions.maxCommands;
    sceneOptions.maxCommands = function () {
      return _maxCommands.call(this) + 1;
    };
  }
  Scene_Options_MasterVolumeMixIn(Scene_Options.prototype);
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
