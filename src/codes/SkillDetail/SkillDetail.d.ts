/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AutoLineBreak/AutoLineBreak.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />
/// <reference path="../DisplayDatabaseDetailWindow/plugin/DisplayDatabaseDetailWindow.d.ts" />

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

declare class Window_DetailText extends Window_Scrollable {
}

declare interface Window_SkillDetail extends Window_DetailText {
}
