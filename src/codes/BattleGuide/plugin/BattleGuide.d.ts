/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../../common/scene/battleInputtingWindowInterface.d.ts" />
/// <reference path="../../../common/scene/battleCancelButtonToEdgeInterface.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />
/// <reference path="../../ManualText/ManualText.d.ts" />
/// <reference path="../../ManualText/ManualTextExport.d.ts" />

type SettingsGuide = {
  title: string,
  texts: string[],
  glossaryItem: number,
  condition: {
    switchId: number,
    variableId: number,
    threshold: number,
  },
};

declare interface Scene_Battle {
  _guideWindowLayer: WindowLayer;
  _guideListWindow: Window_BattleGuideList;
  _guideTextWindow: Window_battleGuideText;
  _returnFromGuide: Window_Selectable|null;

  createGuideListWindow(): void;
  createGuideTextWindow(): void;
  guideListWindowRect(): Rectangle;
  guideTextWindowRect(): Rectangle;

  openGuide(): void;
  onCancelGuideList(): void;
  onTurnGuidePage(): void;
}
