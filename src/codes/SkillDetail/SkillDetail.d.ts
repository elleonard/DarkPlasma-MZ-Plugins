/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AutoLineBreak/AutoLineBreak.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare namespace MZ {
  interface Skill {
    detail: string|undefined;
  }
}

declare interface Scene_Skill {
  _detailWindow: Window_SkillDetail
  _detailWindowLayer: WindowLayer;

  createDetailWindow(): void;
  detailWindowRect(): Rectangle;
  toggleDetailWindow(): void;
}

declare interface Scene_Battle {
  _skillDetailWindow: Window_SkillDetail;
  _skillDetailWindowLayer: WindowLayer;

  createSkillDetailWindow(): void;
  skillDetailWindowRect(): Rectangle;
  toggleSkillDetailWindow(): void;
}

declare interface Window_SkillList {
  _detailWindow: Window_SkillDetail

  setDescriptionWindow(detailWindow: Window_SkillDetail): void;
}

declare interface Window_SkillDetail extends Window_Base {
  setItem(item: DataManager.DrawableItem|null): void;
  setText(text: string): void;
  resetCursor(): void;
}
