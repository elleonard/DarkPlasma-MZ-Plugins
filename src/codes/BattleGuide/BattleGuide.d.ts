/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../../common/scene/battleInputtingWindowInterface.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />
/// <reference path="../ManualText/ManualText.d.ts" />
/// <reference path="../ManualText/ManualTextExport.d.ts" />

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
  createGuideListWindow(): void;
  createGuideTextWindow(): void;
  guideListWindowRect(): Rectangle;
  guideTextWindowRect(): Rectangle;

  openGuide(): void;
  onCancelGuideList(): void;
  onTurnGuidePage(): void;
}
