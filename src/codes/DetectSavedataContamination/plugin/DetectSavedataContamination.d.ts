/// <reference path="../../../typings/rmmz.d.ts" />

type SaveContentsTree = {
  ancestor: string[];
};

type SaveContentsContamination = {
  className: string;
  tree: SaveContentsTree;
  level: ContaminationLevel;
};

/**
 * 汚染レベル
 * clean: 汚染なし（元々セーブデータに含まれるものしか含まれていない）
 * good: 汚染なしと推定（独自のクラスをセーブデータに追加しているが Game_ と名前がついており、命名規則に違反していない）
 * warn: 汚染の可能性あり（独自のクラスをセーブデータに追加しており、 Game_ と名前がついていない）
 * bad: 汚染されている（セーブデータに含まれない想定のもの (コンストラクタなしのオブジェクトや、Scene,Sprite,Windowクラス)が含まれる）
 */
type ContaminationLevel = "clean"|"good"|"warn"|"bad";

declare namespace DataManager {
  function consoleSaveContentsContamination(): void;
  function detectSaveContentsContamination(): SaveContentsContamination[];
  function detectContaminationObject(object: any, depth: number, tree: SaveContentsTree): SaveContentsContamination[];
  function contaminationLevelForClassName(className: string): ContaminationLevel;
  function cleanContaminationLevelClassNames(): string[];
  function badContaminationLevelClassNames(): string[];
  function whitelistContaminationLevelClassNames(): string[];
}
