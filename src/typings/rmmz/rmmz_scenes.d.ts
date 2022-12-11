//=============================================================================
// rmmz_scenes.js v1.6.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * The superclass of all scenes within the game.
 */
declare class Scene_Base extends Stage {
  public constructor();

  public _started: boolean;
  public _active: boolean;
  public _fadeSign: number;
  public _fadeDuration: number;
  public _fadeWhite: number;
  public _fadeOpacity: number;
  public _colorFilter: ColorFilter;
  public _windowLayer: WindowLayer | undefined;

  public filters: ColorFilter[];

  public initialize(...args: any[]): void;

  public create(): void;
  public isActive(): boolean;
  public isReady(): boolean;
  public start(): void;
  public update(): void;
  public stop(): void;
  public isStarted(): boolean;
  public isBusy(): boolean;
  public isFading(): boolean;
  public terminate(): void;

  public createWindowLayer(): void;
  public addWindow(window: Window_Base): void;

  public startFadeIn(duration: number, white?: boolean): void;
  public startFadeOut(duration: number, white?: boolean): void;
  public createColorFilter(): void;
  public updateColorFilter(): void;
  public updateFade(): void;

  public updateChildren(): void;
  public popScene(): void;
  public checkGameover(): void;

  public fadeOutAll(): void;
  public fadeSpeed(): number;
  public slowFadeSpeed(): number;

  public scaleSprite(sprite: Sprite): void;
  public centerSprite(sprite: Sprite): void;

  public isBottomHelpMode(): boolean;
  public isBottomButtonMode(): boolean;
  public isRightInputMode(): boolean;

  public mainCommandWidth(): number;
  public buttonAreaTop(): number;
  public buttonAreaBottom(): number;
  public buttonAreaHeight(): number;
  public buttonY(): number;

  public calcWindowHeight(numLines: number, selectable: boolean): number;

  public requestAutosave(): void;
  public isAutosaveEnabled(): boolean;
  public executeAutosave(): void;
  public onAutosaveSuccess(): void;
  public onAutosaveFailue(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class for initializing the entire game.
 */
declare class Scene_Boot extends Scene_Base {
  public constructor();

  public _databaseLoaded: boolean;

  public static loadSystemImages(): void;

  public initialize(...args: any[]): void;

  public create(): void;
  public isReady(): boolean;
  public onDatabaseLoaded(): void;
  public setEncryptionInfo(): void;
  public loadSystemImages(): void;
  public loadPlayerData(): void;
  public loadGameFonts(): void;
  public isPlayerDataLoaded(): boolean;
  public start(): void;
  public startNormalGame(): void;

  public resizeScreen(): void;
  public adjustBoxSize(): void;
  public adjustWindow(): void;

  public updateDocumentTitle(): void;
  public checkPlayerLocation(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the title screen.
 */
declare class Scene_Title extends Scene_Base {
  public constructor();

  public _backSprite1: Sprite;
  public _backSprite2: Sprite;
  public _gameTitleSprite: Sprite;
  public _windowLayer: WindowLayer;
  public _commandWindow: Window_TitleCommand;

  public initialize(...args: any[]): void;

  public create(): void;
  public start(): void;
  public update(): void;
  public isBusy(): boolean;
  public terminate(): void;

  public createBackground(): void;
  public createForeground(): void;
  public drawGameTitle(): void;
  public adjustBackground(): void;

  public createCommandWindow(): void;
  public commandWindowRect(): Rectangle;
  public commandNewGame(): void;
  public commandContinue(): void;
  public commandOptions(): void;

  public playTitleMusic(): void;
}

//-----------------------------------------------------------------------------
// Scene_Message
//
// The superclass of Scene_Map and Scene_Battle.
declare class Scene_Message extends Scene_Base {
  public constructor();

  public _messageWindow: Window_Message;
  public _scrollTextWindow: Window_ScrollText;
  public _goldWindow: Window_Gold;
  public _nameBoxWindow: Window_NameBox;
  public _choiceListWindow: Window_ChoiceList;
  public _numberInputWindow: Window_NumberInput;
  public _eventItemWindow: Window_EventItem;

  public initialize(): void;
  public isMessageWindowClosing(): boolean;
  public createAllWindows(): void;
  public createMessageWindow(): void;
  public messageWindowRect(): Rectangle;
  public createScrollTextWindow(): void;
  public scrollTextWindowRect(): Rectangle;
  public createGoldWindow(): void;
  public goldWindowRect(): Rectangle;
  public createNameBoxWindow(): void;
  public createChoiceListWindow(): void;
  public createNumberInputWindow(): void;
  public createEventItemWindow(): void;
  public eventItemWindowRect(): Rectangle;
  public associateWindows(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the map screen.
 */
declare class Scene_Map extends Scene_Message {
  public constructor();

  public _waitCount: number;
  public _encounterEffectDuration: number;
  public _mapLoaded: boolean;
  public _touchCount: number;
  public _transfer: boolean;
  public _spriteset: Spriteset_Map | undefined;
  public _mapNameWindow: Window_MapName | undefined;
  public _menuButton: Sprite_Button;
  public menuCalling: boolean | undefined;

  public initialize(...args: any[]): void;

  public create(): void;
  public isReady(): boolean;
  public onMapLoaded(): void;
  public onTranfer(): void;
  public start(): void;
  public onTransferEnd(): void;
  public shouldAutosave(): boolean;

  public update(): void;
  public updateMainMultiply(): void;
  public updateMain(): void;
  public isPlayerActive(): boolean;
  public isFastForward(): boolean;

  public stop(): void;
  public isBusy(): boolean;
  public terminate(): void;

  public needsFadeIn(): boolean;
  public needsSlowFadeOut(): boolean;

  public updateWaitCount(): boolean;
  public updateDestination(): void;
  public updateMenuButton(): void;
  public hideMenuButton(): void;
  public updateMapNameWindow(): void;

  public isMenuEnabled(): boolean;
  public isMapTouchOk(): boolean;
  public processMapTouch(): void;

  public isAnyButtonPressed(): boolean;
  public onMapTouch(): void;

  public isSceneChangeOk(): boolean;
  public updateScene(): void;

  public createDisplayObjects(): void;
  public createSpriteset(): void;
  public createAllWindows(): void;
  public createMapNameWindow(): void;
  public mapNameWindowRect(): Rectangle;

  public createButtons(): void;
  public createMenuButton(): void;

  public updateTransferPlayer(): void;
  public updateEncounter(): void;
  public updateCallMenu(): void;
  public isMenuCalled(): boolean;
  public callMenu(): void;

  public updateCallDebug(): void;
  public isDebugCalled(): boolean;

  public fadeInForTransfer(): void;
  public fadeOutForTransfer(): void;

  public launchBattle(): void;
  public stopAudioOnBattleStart(): void;
  public startEncounterEffect(): void;
  public updateEncounterEffect(): void;
  public snapForBattleBackground(): void;
  public startFlashForEncounter(duration: number): void;
  public encounterEffectSpeed(): number;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of all the menu-type scenes.
 */
declare class Scene_MenuBase extends Scene_Base {
  public constructor();

  public _actor: Game_Actor;
  public _backgroundSprite: Sprite;
  public _windowLayer: WindowLayer;
  public _helpWindow: Window_Help | undefined;

  public initialize(...args: any[]): void;

  public create(): void;

  public helpAreaTop(): number;
  public helpAreaBottom(): number;
  public helpAreaHeight(): number;
  public mainAreaTop(): number;
  public mainAreaBottom(): number;
  public mainAreaHeight(): number;

  public actor(): Game_Actor;
  public updateActor(): void;

  public createBackground(): void;
  public setBackgroundOpacity(opacity: number): void;
  public createHelpWindow(): void;
  public helpWindowRect(): Rectangle;
  public createButtons(): void;
  public needsCancelButton(): boolean;
  public createCancelButton(): void;
  public needsPageButtons(): boolean;
  public createPageButtons(): void;
  public updatePageButtons(): void;
  public arePageButtonsEnabled(): boolean;

  public nextActor(): void;
  public previousActor(): void;
  public onActorChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the menu screen.
 */
declare class Scene_Menu extends Scene_MenuBase {
  public constructor();

  public _commandWindow: Window_MenuCommand;
  public _goldWindow: Window_Gold;
  public _statusWindow: Window_MenuStatus;

  public initialize(...args: any[]): void;

  public create(): void;
  public start(): void;
  public createCommandWindow(): void;
  public commandWindowRect(): Rectangle;
  public createGoldWindow(): void;
  public goldWindowRect(): Rectangle;
  public createStatusWindow(): void;
  public statusWindowRect(): Rectangle;

  public commandItem(): void;
  public commandPersonal(): void;
  public commandFormation(): void;
  public commandOptions(): void;
  public commandSave(): void;
  public commandGameEnd(): void;

  public onPersonalOk(): void;
  public onPersonalCancel(): void;
  public onFormationOk(): void;
  public onFormationCancel(): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Scene_Item and Scene_Skill.
 */
declare class Scene_ItemBase extends Scene_MenuBase {
  public constructor();

  public _actorWindow: Window_MenuActor | undefined;
  public _itemWindow: Scene_ItemBase.ItemWindow | undefined;

  public initialize(...args: any[]): void;

  public create(): void;
  public createActorWindow(): void;

  public item(): DataManager.Item | null;
  public user(): Game_Actor | null;

  public isCursorLeft(): boolean;
  public showSubWindow(window: Window_Base): void;
  public hideSubWindow(window: Window_Base): void;

  public onActorOk(): void;
  public onActorCancel(): void;

  public determineItem(): void;
  public useItem(): void;
  public activateItemWindow(): void;
  public itemTargetActors(): Game_Actor[];
  public canUse(): boolean;
  public isItemEffectsValid(): boolean;
  public applyItem(): void;
  public checkCommonEvent(): void;
}

declare namespace Scene_ItemBase {
  interface ItemWindow extends Window_Selectable {
    item(): DataManager.Item | null;
  }
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the item screen.
 */
declare class Scene_Item extends Scene_ItemBase {
  public constructor();

  public _helpWindow: Window_Help;
  public _categoryWindow: Window_ItemCategory;
  public _itemWindow: Window_ItemList;
  public _actorWindow: Window_MenuActor;

  public initialize(...args: any[]): void;

  public create(): void;
  public createCategoryWindow(): void;
  public createItemWindow(): void;

  public user(): Game_Actor;

  public onCategoryOk(): void;
  public onItemOk(): void;
  public onItemCancel(): void;

  public playSeForItem(): void;
  public useItem(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the skill screen.
 */
declare class Scene_Skill extends Scene_ItemBase {
  public constructor();

  public _helpWindow: Window_Help;
  public _skillTypeWindow: Window_SkillType;
  public _statusWindow: Window_SkillStatus;
  public _itemWindow: Window_SkillList;
  public _actorWindow: Window_MenuActor;

  public initialize(...args: any[]): void;

  public create(): void;
  public createSkillTypeWindow(): void;
  public createStatusWindow(): void;
  public createItemWindow(): void;

  public skillTypeWindowRect(): Rectangle;
  public statusWindowRect(): Rectangle;
  public itemWindowRect(): Rectangle;

  public needsPageButons(): boolean;
  public arePageButtonsEnabled(): boolean;

  public refreshActor(): void;

  public user(): Game_Actor;

  public commandSkill(): void;
  public onItemOk(): void;
  public onItemCancel(): void;

  public playSeForItem(): void;
  public useItem(): void;

  public onActorChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the equipment screen.
 */
declare class Scene_Equip extends Scene_MenuBase {
  public constructor();

  public _helpWindow: Window_Help;
  public _statusWindow: Window_EquipStatus;
  public _commandWindow: Window_EquipCommand;
  public _slotWindow: Window_EquipSlot;
  public _itemWindow: Window_EquipItem;

  public initialize(...args: any[]): void;

  public create(): void;
  public createStatusWindow(): void;
  public statusWindowRect(): Rectangle;
  public createCommandWindow(): void;
  public commandWindowRect(): Rectangle;
  public createSlotWindow(): void;
  public slotWindowRect(): Rectangle;
  public createItemWindow(): void;
  public itemWindowRect(): Rectangle;
  public statusWidth(): number;

  public needsPageButtons(): boolean;
  public arePageButtonsEnabled(): boolean;

  public refreshActor(): void;

  public commandEquip(): void;
  public commandOptimize(): void;
  public commandClear(): void;

  public onSlotOk(): void;
  public onSlotCancel(): void;
  public onItemOk(): void;
  public executeEquipChange(): void;
  public onItemCancel(): void;
  public onActorChange(): void;

  public hideItemWindow(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the status screen.
 */
declare class Scene_Status extends Scene_MenuBase {
  public constructor();

  public _profileWindow: Window_Help;
  public _statusWindow: Window_Status;
  public _statusParamsWindow: Window_StatusParams;
  public _statusEquipWindow: Window_StatusEquip;

  public initialize(...args: any[]): void;

  public create(): void;
  public helpAreaHeight(): number;
  public createProfileWindow(): void;
  public profileWindowRect(): Rectangle;
  public createStatusWindow(): void;
  public stattusWindowRect(): Rectangle;
  public createStatusParamsWindow(): void;
  public statusParamsWindowRect(): Rectangle;
  public createStatusEquipWindow(): void;
  public statusEquipWindowRect(): Rectangle;
  public statusParamsWidth(): number;
  public statusParamsHeight(): number;
  public profileHeight(): number;

  public start(): void;
  public needsPageButtons(): boolean;
  public refreshActor(): void;

  public onActorChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the options screen.
 */
declare class Scene_Options extends Scene_MenuBase {
  public constructor();

  public _optionsWindow: Window_Options;

  public initialize(...args: any[]): void;

  public create(): void;
  public terminate(): void;
  public createOptionsWindow(): void;
  public optionsWindowRect(): Rectangle;
  public maxCommands(): number;
  public maxVisibleCommands(): number;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Scene_Save and Scene_Load.
 */
declare class Scene_File extends Scene_MenuBase {
  public constructor();

  public _helpWindow: Window_Help;
  public _listWindow: Window_SavefileList;

  public initialize(...args: any[]): void;

  public create(): void;
  public start(): void;

  public savefileId(): number;

  public createHelpWindow(): void;
  public createListWindow(): void;

  public mode(): string | null;
  public activateListWindow(): void;
  public helpWindowText(): string;
  public firstSavefileIndex(): number;

  public onSavefileOk(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the save screen.
 */
declare class Scene_Save extends Scene_File {
  public constructor();

  public initialize(...args: any[]): void;

  public mode(): string;
  public helpWindowText(): string;
  public firstSavefileIndex(): number;

  public onSavefileOk(): void;
  public onSaveSuccess(): void;
  public onSaveFailure(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the load screen.
 */
declare class Scene_Load extends Scene_File {
  public constructor();

  public _loadSuccess: boolean;

  public initialize(...args: any[]): void;

  public terminate(): void;

  public mode(): string;
  public helpWindowText(): string;
  public firstSavefileIndex(): number;

  public onSavefileOk(): void;
  public onLoadSuccess(): void;
  public onLoadFailure(): void;

  public reloadMapIfUpdated(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the game end screen.
 */
declare class Scene_GameEnd extends Scene_MenuBase {
  public constructor();

  public _commandWindow: Window_GameEnd;

  public initialize(...args: any[]): void;

  public create(): void;
  public stop(): void;

  public createBackground(): void;
  public createCommandWindow(): void;

  public commandToTitle(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the shop screen.
 */
type Shop_Goods = [number, number, number, number][];
declare class Scene_Shop extends Scene_MenuBase {
  public constructor();

  public _goods: Shop_Goods[];
  public _purchaseOnly: boolean;
  public _item: MZ.Item | MZ.Weapon | MZ.Armor | null;
  public _helpWindow: Window_Help;
  public _goldWindow: Window_Gold;
  public _commandWindow: Window_ShopCommand;
  public _dummyWindow: Window_Base;
  public _numberWindow: Window_ShopNumber;
  public _statusWindow: Window_ShopStatus;
  public _buyWindow: Window_ShopBuy;
  public _categoryWindow: Window_ItemCategory;
  public _sellWindow: Window_ShopSell;

  public initialize(...args: any[]): void;

  public prepare(goods: Shop_Goods[], purchaseOnly: boolean): void;
  public create(): void;
  public createGoldWindow(): void;
  public goldWindowRect(): Rectangle;
  public createCommandWindow(): void;
  public commandWindowRect(): Rectangle;
  public createDummyWindow(): void;
  public dummyWindowRect(): Rectangle;
  public createNumberWindow(): void;
  public numberWindowRect(): Rectangle;
  public createStatusWindow(): void;
  public statusWindowRect(): Rectangle;
  public createBuyWindow(): void;
  public buyWindowRect(): Rectangle;
  public createCategoryWindow(): void;
  public categoryWindowRect(): Rectangle;
  public createSellWindow(): void;
  public sellWindowRect(): Rectangle;

  public statusWidth(): number;

  public activateBuyWindow(): void;
  public activateSellWindow(): void;
  public commandBuy(): void;
  public commandSell(): void;

  public onBuyOk(): void;
  public onBuyCancel(): void;
  public onCategoryOk(): void;
  public onCategoryCancel(): void;
  public onSellOk(): void;
  public onSellCancel(): void;
  public onNumberOk(): void;
  public onNumberCancel(): void;

  public doBuy(number: number): void;
  public doSell(number: number): void;
  public endNumberInput(): void;

  public maxBuy(): number;
  public maxSell(): number;
  public money(): number;
  public currencyUnit(): string;
  public buyingPrice(): number;
  public sellingPrice(): number;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the name input screen.
 */
declare class Scene_Name extends Scene_MenuBase {
  public constructor();

  public _actorId: number;
  public _maxLength: number;
  public _actor: Game_Actor;
  public _editWindow: Window_NameEdit;
  public _inputWindow: Window_NameInput;

  public initialize(...args: any[]): void;

  public prepare(actorId: number, maxLength: number): void;
  public create(): void;
  public start(): void;

  public createEditWindow(): void;
  public createInputWindow(): void;

  public onInputOk(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the debug screen.
 */
declare class Scene_Debug extends Scene_MenuBase {
  public constructor();

  public _rangeWindow: Window_DebugRange;
  public _editWindow: Window_DebugEdit;
  public _debugHelpWindow: Window_Base;

  public initialize(...args: any[]): void;

  public create(): void;

  public createRangeWindow(): void;
  public createEditWindow(): void;
  public createDebugHelpWindow(): void;

  public onRangeOk(): void;
  public onEditCancel(): void;

  public refreshHelpWindow(): void;
  public helpText(): string;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the battle screen.
 */
declare class Scene_Battle extends Scene_Message {
  public constructor();

  public _spriteset: Spriteset_Battle;
  public _windowLayer: WindowLayer;
  public _logWindow: Window_BattleLog;
  public _statusWindow: Window_BattleStatus;
  public _partyCommandWindow: Window_PartyCommand;
  public _actorCommandWindow: Window_ActorCommand;
  public _helpWindow: Window_Help;
  public _skillWindow: Window_BattleSkill;
  public _itemWindow: Window_BattleItem;
  public _actorWindow: Window_BattleActor;
  public _enemyWindow: Window_BattleEnemy;
  public _messageWindow: Window_Message;
  public _scrollTextWindow: Window_ScrollText;

  public initialize(...args: any[]): void;

  public create(): void;
  public start(): void;
  public update(): void;
  public updateVisibility(): void;
  public updateBattleProcess(): void;
  public isTimeActive(): boolean;
  public isAnyInputWindowActive(): boolean;
  public changeInputWindow(): void;
  public stop(): void;
  public terminate(): void;

  public shouldAutosave(): boolean;
  public needsSlowFadeOut(): boolean;
  public updateLogWindowVisibility(): void;
  public updateStatusWindowVisibility(): void;
  public shouldOpenStatusWindow(): boolean;
  public updateWindowPositions(): void;
  public statusWindowX(): number;
  public updateInputWindowVisibility(): void;
  public needsInputWindowChange(): boolean;
  public updateCancelButton(): void;

  public createDisplayObjects(): void;
  public createSpriteset(): void;
  public createAllWindows(): void;
  public createLogWindow(): void;
  public logWindowRect(): Rectangle;
  public createStatusWindow(): void;
  public statusWindowRect(): Rectangle;
  public createPartyCommandWindow(): void;
  public partyCommandWindowRect(): Rectangle;
  public createActorCommandWindow(): void;
  public actorCommandWindowRect(): Rectangle;
  public createHelpWindow(): void;
  public helpWindowRect(): Rectangle;
  public createSkillWindow(): void;
  public skillWindowRect(): Rectangle;
  public createItemWindow(): void;
  public itemWindowRect(): Rectangle;
  public createActorWindow(): void;
  public actorWindowRect(): Rectangle;
  public createEnemyWindow(): void;
  public enemyWindowRect(): Rectangle;

  public helpAreaTop(): number;
  public helpAreaBottom(): number;
  public helpAreaHeight(): number;
  public buttonAreaTop(): number;
  public windowAreaHeight(): number;

  public createButtons(): void;
  public createCancelButton(): void;

  public closeCommandWindows(): void;
  public hideSubInputWindows(): void;

  public startPartyCommandSelection(): void;
  public commandFight(): void;
  public commandEscape(): void;
  public startActorCommandSelection(): void;
  public commandAttack(): void;
  public commandSkill(): void;
  public commandGuard(): void;
  public commandItem(): void;
  public commandCancel(): void;
  public selectNextCommand(): void;
  public selectPreviousCommand(): void;
  public startActorSelection(): void;
  public onActorOk(): void;
  public onActorCancel(): void;
  public startEnemySelection(): void;
  public onEnemyOk(): void;
  public onEnemyCancel(): void;
  public onSkillOk(): void;
  public onSkillCancel(): void;
  public onItemOk(): void;
  public onItemCancel(): void;
  public onSelectAction(): void;
  public endCommandSelection(): void;
}

//-----------------------------------------------------------------------------
/**
 * The scene class of the game over screen.
 */
declare class Scene_Gameover extends Scene_Base {
  public constructor();

  public _backSprite: Sprite;

  public initialize(...args: any[]): void;

  public create(): void;
  public start(): void;
  public update(): void;
  public stop(): void;
  public terminate(): void;

  public playGameoverMusic(): void;
  public createBackground(): void;

  public isTriggered(): boolean;
  public gotoTitle(): void;
}
