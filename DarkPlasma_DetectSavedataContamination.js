// DarkPlasma_DetectSavedataContamination 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/28 1.0.0 公開
 */

/*:
 * @plugindesc セーブデータの汚染を検出する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param detectBeforeSave
 * @desc ゲームセーブ直前にセーブデータ汚染の検出を行います。セーブに時間がかかるようになります。
 * @text セーブ前に検出
 * @type boolean
 * @default true
 *
 * @param showClean
 * @desc 検出結果に含まれる汚染レベル 汚染なし を表示します。
 * @text 汚染なしを表示
 * @type boolean
 * @default false
 *
 * @param showGood
 * @desc 検出結果に含まれる汚染レベル 汚染なしと推定 を表示します。
 * @text 汚染なしと推定を表示
 * @type boolean
 * @default false
 *
 * @param showWarn
 * @desc 検出結果に含まれる 汚染の可能性あり を表示します。
 * @text 汚染の可能性ありを表示
 * @type boolean
 * @default true
 *
 * @command detect
 * @text 汚染を検出する
 * @desc セーブデータ汚染を検出します。結果を開発者コンソールに表示します。
 *
 * @help
 * version: 1.0.0
 * プラグインやスクリプトによるセーブデータの汚染を検出します。
 *
 * セーブデータに含まれるオブジェクトのクラス名を元に汚染を検知します。
 * 以下の基準で汚染レベルをオブジェクトごとに判定します。
 *
 * 汚染なし: 元々セーブデータに含まれるクラス名である
 * 汚染なしと推定: 元々セーブデータに含まれないが、Game_で始まる独自クラスである
 * 汚染の可能性あり: 上記以外の独自クラスである
 * 汚染: セーブデータに含まれない想定のクラス名である
 *
 * 本プラグインはセーブデータに異常なオブジェクトが含まれていないか検出するための
 * 開発用プラグインです。
 * ゲームをデプロイメントする際にはOFFにすることを推奨します。
 *
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const command_detect = 'detect';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    detectBeforeSave: String(pluginParameters.detectBeforeSave || true) === 'true',
    showClean: String(pluginParameters.showClean || false) === 'true',
    showGood: String(pluginParameters.showGood || false) === 'true',
    showWarn: String(pluginParameters.showWarn || true) === 'true',
  };

  PluginManager.registerCommand(pluginName, command_detect, function () {
    DataManager.consoleSaveContentsContamination();
  });
  function DataManager_DetectSavedataContaminationMixIn(dataManager) {
    const _saveGame = dataManager.saveGame;
    dataManager.saveGame = function (savefileId) {
      if (settings.detectBeforeSave) {
        this.consoleSaveContentsContamination();
      }
      return _saveGame.call(this, savefileId);
    };
    dataManager.consoleSaveContentsContamination = function () {
      console.log('セーブデータ汚染の検出を開始します。');
      this.detectSaveContentsContamination().forEach((contamination) => {
        switch (contamination.level) {
          case 'bad':
            if (contamination.className === 'no name') {
              console.error(
                `コンストラクタを持たないオブジェクトがセーブデータを汚染しています。クラスツリーを参考に原因を特定し、除去してください。`,
              );
            } else {
              console.error(
                `クラス名: ${contamination.className} はセーブデータを汚染しています。クラスツリーを参考に原因を特定し、除去してください。`,
              );
            }
            console.error(contamination.tree);
            break;
          case 'warn':
            if (settings.showWarn) {
              console.warn(`クラス名: ${contamination.className} はセーブデータを汚染している可能性があります。`);
              console.warn(contamination.tree);
            }
            break;
          case 'good':
            if (settings.showGood) {
              console.log(`クラス名: ${contamination.className} がセーブデータを汚染している可能性は低いです。`);
              console.log(contamination.tree);
            }
            break;
          case 'clean':
            if (settings.showClean) {
              console.log(`クラス名: ${contamination.className} はセーブデータに含まれていても問題ありません。`);
              console.log(contamination.tree);
            }
            break;
        }
      });
      console.log('セーブデータ汚染の検出を完了しました。');
    };
    dataManager.detectSaveContentsContamination = function () {
      const saveContents = this.makeSaveContents();
      return Object.keys(saveContents).flatMap((key) =>
        this.detectContaminationObject(saveContents[key], 0, { ancestor: [] }),
      );
    };
    dataManager.detectContaminationObject = function (object, depth, tree) {
      const result = [];
      if (depth >= JsonEx.maxDepth) {
        throw new Error('Object too deep');
      }
      const type = Object.prototype.toString.call(object);
      if (type === '[object Object]' || type === '[object Array]') {
        if (!object.constructor) {
          result.push({
            className: 'no name',
            tree: {
              ancestor: [...tree.ancestor],
            },
            level: 'bad',
          });
        } else {
          const constructorName = object.constructor.name;
          const contaminationLevel = this.contaminationLevelForClassName(constructorName);
          const newTree = {
            ancestor: [...tree.ancestor.concat(constructorName)],
          };
          for (const key of Object.keys(object)) {
            result.push(...this.detectContaminationObject(object[key], depth + 1, newTree));
          }
          result.push({
            className: constructorName,
            tree: tree,
            level: contaminationLevel,
          });
        }
      }
      return result;
    };
    dataManager.contaminationLevelForClassName = function (className) {
      if (this.cleanContaminationLevelClassNames().includes(className)) {
        return 'clean';
      }
      if (this.badContaminationLevelClassNames().includes(className) || !(className in globalThis)) {
        return 'bad';
      }
      if (className.startsWith('Scene_') || className.startsWith('Sprite_') || className.startsWith('Window_')) {
        return 'bad';
      }
      if (className.startsWith('Game_') || this.whitelistContaminationLevelClassNames().includes(className)) {
        return 'good';
      }
      return 'warn';
    };
    dataManager.cleanContaminationLevelClassNames = function () {
      return [
        'Object',
        'Array',
        'Game_System',
        'Game_Screen',
        'Game_Picture',
        'Game_Item',
        'Game_Timer',
        'Game_Switches',
        'Game_Variables',
        'Game_SelfSwitches',
        'Game_Actors',
        'Game_Party',
        'Game_Map',
        'Game_CommonEvent',
        'Game_Player',
        'Game_Follower',
        'Game_Followers',
        'Game_Vehicle',
        'Game_Event',
        'Game_Interpreter',
        'Game_ActionResult', // 戦闘終了時に必ずクリアされるが、空状態のGame_ActionResultが含まれるのは正常
      ];
    };
    dataManager.badContaminationLevelClassNames = function () {
      return [
        'Game_Temp',
        'Game_Message',
        'Game_Troop',
        'Game_Enemy',
        'Game_Action', // 戦闘終了時に必ずクリアされるため、正常なセーブデータには含まれない
      ];
    };
    /**
     * 汚染なしと推定される独自クラス名を列挙する
     */
    dataManager.whitelistContaminationLevelClassNames = function () {
      return [
        'Filter_Controller', // FilterControllerMZ
      ];
    };
  }
  DataManager_DetectSavedataContaminationMixIn(DataManager);
})();
