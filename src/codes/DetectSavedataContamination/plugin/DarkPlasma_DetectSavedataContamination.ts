/// <reference path="./DetectSavedataContamination.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_detect } from "../config/_build/DarkPlasma_DetectSavedataContamination_commands";
import { settings } from "../config/_build/DarkPlasma_DetectSavedataContamination_parameters";

PluginManager.registerCommand(pluginName, command_detect, function () {
  DataManager.consoleSaveContentsContamination();
});

function DataManager_DetectSavedataContaminationMixIn(dataManager: typeof DataManager) {
  const _saveGame = dataManager.saveGame;
  dataManager.saveGame = function (savefileId) {
    if (settings.detectBeforeSave) {
      this.consoleSaveContentsContamination();
    }
    return _saveGame.call(this, savefileId);
  };

  dataManager.consoleSaveContentsContamination = function () {
    console.log("セーブデータ汚染の検出を開始します。");
    this.detectSaveContentsContamination().forEach(contamination => {
      switch (contamination.level) {
        case "bad":
          if (contamination.className === "no name") {
            console.error(`コンストラクタを持たないオブジェクトがセーブデータを汚染しています。クラスツリーを参考に原因を特定し、除去してください。`);
          } else {
            console.error(`クラス名: ${contamination.className} はセーブデータを汚染しています。クラスツリーを参考に原因を特定し、除去してください。`);
          }
          console.error(contamination.tree);
          break;
        case "warn":
          if (settings.showWarn) {
            console.warn(`クラス名: ${contamination.className} はセーブデータを汚染している可能性があります。`);
            console.warn(contamination.tree);
          }
          break;
        case "good":
          if (settings.showGood) {
            console.log(`クラス名: ${contamination.className} がセーブデータを汚染している可能性は低いです。`);
            console.log(contamination.tree);
          }
          break;
        case "clean":
          if (settings.showClean) {
            console.log(`クラス名: ${contamination.className} はセーブデータに含まれていても問題ありません。`);
            console.log(contamination.tree);
          }
          break;
      }
    });
    console.log("セーブデータ汚染の検出を完了しました。");
  };

  dataManager.detectSaveContentsContamination = function () {
    const saveContents = this.makeSaveContents();
    return (Object.keys(saveContents) as (keyof DataManager.SaveContents)[])
      .flatMap(key => this.detectContaminationObject(saveContents[key], 0, { ancestor: [] }));
  };

  dataManager.detectContaminationObject = function (object, depth, tree) {
    const result: SaveContentsContamination[] = [];
    if (depth >= JsonEx.maxDepth) {
      throw new Error("Object too deep");
    }
    const type = Object.prototype.toString.call(object);
    if (type === "[object Object]" || type === "[object Array]") {
      if (!object.constructor) {
        result.push({
          className: "no name",
          tree: {
            ancestor: [...tree.ancestor],
          },
          level: "bad",
        });
      } else {
        const constructorName: string = object.constructor.name;
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
      return "clean";
    }
    if (this.badContaminationLevelClassNames().includes(className) || !(className in globalThis)) {
      return "bad";
    }
    if (className.startsWith("Scene_") || className.startsWith("Sprite_") || className.startsWith("Window_")) {
      return "bad";
    }
    if (className.startsWith("Game_") || this.whitelistContaminationLevelClassNames().includes(className)) {
      return "good";
    }
    return "warn";
  };

  dataManager.cleanContaminationLevelClassNames = function () {
    return [
      "Object",
      "Array",
      "Game_System",
      "Game_Screen",
      "Game_Picture",
      "Game_Item",
      "Game_Timer",
      "Game_Switches",
      "Game_Variables",
      "Game_SelfSwitches",
      "Game_Actors",
      "Game_Party",
      "Game_Map",
      "Game_CommonEvent",
      "Game_Player",
      "Game_Follower",
      "Game_Followers",
      "Game_Vehicle",
      "Game_Event",
      "Game_Interpreter",
    
      "Game_ActionResult",  // 戦闘終了時に必ずクリアされるが、空状態のGame_ActionResultが含まれるのは正常
    ];
  };

  dataManager.badContaminationLevelClassNames = function () {
    return [
      "Game_Temp",
      "Game_Message",
      "Game_Troop",
      "Game_Enemy",

      "Game_Action",  // 戦闘終了時に必ずクリアされるため、正常なセーブデータには含まれない
    ];
  };

  /**
   * 汚染なしと推定される独自クラス名を列挙する
   */
  dataManager.whitelistContaminationLevelClassNames = function () {
    return settings.whitelist;
  };
}

DataManager_DetectSavedataContaminationMixIn(DataManager);
