//=============================================================================
// rpg_windows.js v1.3.4
//=============================================================================

import { Rectangle } from 'pixi.js';

//-----------------------------------------------------------------------------
/**
 * The superclass of all windows within the game.
 */
declare class Window_Base extends Window {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public static _iconWidth: number;
  public static _iconHeight: number;
  public static _faceWidth: number;
  public static _faceHeight: number;

  public _opening: boolean;
  public _closing: boolean;
  public _dimmerSprite: Sprite | undefined;

  public initialize(...args: any[]): void;

  public lineHeight(): number;
  public standardFontFace(): string;
  public standardFontSize(): number;
  public standardPadding(): number;
  public textPadding(): number;
  public standardBackOpacity(): number;

  public loadWindowskin(): void;

  public updatePadding(): void;
  public updateBackOpacity(): void;

  public contentsWidth(): number;
  public contentsHeight(): number;
  public fittingHeight(numLines: number): number;

  public updateTone(): void;

  public createContents(): void;
  public resetFontSettings(): void;
  public resetTextColor(): void;

  public update(): void;
  public updateOpen(): void;
  public updateClose(): void;

  public open(): void;
  public close(): void;
  public isOpening(): boolean;
  public isClosing(): boolean;

  public show(): void;
  public hide(): void;
  public activate(): void;
  public deactivate(): void;

  public textColor(n: number): string;
  public normalColor(): string;
  public systemColor(): string;
  public crisisColor(): string;
  public deathColor(): string;
  public gaugeBackColor(): string;
  public hpGaugeColor1(): string;
  public hpGaugeColor2(): string;
  public mpGaugeColor1(): string;
  public mpGaugeColor2(): string;
  public mpCostColor(): string;
  public powerUpColor(): string;
  public powerDownColor(): string;
  public tpGaugeColor1(): string;
  public tpGaugeColor2(): string;
  public tpCostColor(): string;
  public pendingColor(): string;

  public translucentOpacity(): number;
  public changeTextColor(color: string): void;
  public changePaintOpacity(enabled: boolean): void;

  public drawText(text: string, x: number, y: number, maxWidth: number, align?: string): void;
  public textWidth(text: string): number;
  public drawTextEx(text: string, x: number, y: number): number;
  public textSizeEx(text: string);
  public createTextState(text: string, x: number, y: number, width: number): Window_Base.TextState;
  public processAllText(textState: Window_Base.TextState): void;
  public flushTextState(textState: Window_Base.TextState): void;

  public convertEscapeCharacters(text: string): string;
  public actorName(n: number): string;
  public partyMemberName(n: number): string;
  public processCharacter(textState: Window_Base.TextState): void;
  public processNormalCharacter(textState: Window_Base.TextState): void;
  public processNewLine(textState: Window_Base.TextState): void;
  public processNewPage(textState: Window_Base.TextState): void;
  public obtainEscapeCode(textState: Window_Base.TextState): string;
  public obtainEscapeParam(textState: Window_Base.TextState): number;
  public processEscapeCharacter(code: string, textState: Window_Base.TextState): void;
  public processDrawIcon(iconIndex: number, textState: Window_Base.TextState): void;

  public makeFontBigger(): void;
  public makeFontSmaller(): void;
  public calcTextHeight(textState: Window_Base.TextState, all: boolean): number;

  public drawIcon(iconIndex: number, x: number, y: number): void;
  public drawFace(faceName: string, faceIndex: number, x: number, y: number, width?: number, height?: number): void;
  public drawCharacter(characterName: string, characterIndex: number, x: number, y: number): void;
  public drawGauge(x: number, y: number, width: number, rate: number, color1: string, color2: string): void;
  public hpColor(actor: Game_Actor): string;
  public mpColor(actor: Game_Actor): string;
  public tpColor(actor: Game_Actor): string;
  public drawActorCharacter(actor: Game_Actor, x: number, y: number): void;
  public drawActorFace(actor: Game_Actor, x: number, y: number, width?: number, height?: number): void;
  public drawActorName(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorClass(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorNickname(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorLevel(actor: Game_Actor, x: number, y: number): void;
  public drawActorIcons(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawCurrentAndMax(
    current: number,
    max: number,
    x: number,
    y: number,
    width: number,
    color1: string,
    color2: string
  ): void;
  public drawActorHp(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorMp(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorTp(actor: Game_Actor, x: number, y: number, width?: number): void;
  public drawActorSimpleStatus(actor: Game_Actor, x: number, y: number, width: number): void;
  public drawItemName(item: DataManager.Item | null, x: number, y: number, width?: number): void;
  public drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number): void;

  public paramchangeTextColor(change: number): string;

  public setBackgroundType(type: number): void;
  public showBackgroundDimmer(): void;
  public hideBackgroundDimmer(): void;
  public updateBackgroundDimmer(): void;
  public refreshDimmerBitmap(): void;
  public dimColor1(): string;
  public dimColor2(): string;

  public canvasToLocalX(x: number): number;
  public canvasToLocalY(y: number): number;
}

declare namespace Window_Base {
  interface TextState {
    text: string;
    index: number;
    x: number;
    y: number;
    left: number;
    height: number;
    buffer: string;
  }
}

//-----------------------------------------------------------------------------
/**
 * The window class with cursor movement and scroll functions.
 */
declare class Window_Selectable extends Window_Base {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _index: number;
  public _cursorFixed: boolean;
  public _cursorAll: boolean;
  public _stayCount: number;
  public _helpWindow: Window_Help | null;
  public _handlers: { [symbol: string]: () => void };
  public _touching: boolean;
  public _scrollX: number;
  public _scrollY: number;

  public initialize(...args: any[]): void;

  public index(): number;
  public cursorFixed(): boolean;
  public setCursorFixed(cursorFixed: boolean): void;
  public cursorAll(): boolean;
  public setCursorAll(cursorAll: boolean): void;
  public maxCols(): number;
  public maxItems(): number;
  public spacing(): number;
  public itemWidth(): number;
  public itemHeight(): number;
  public maxRows(): number;

  public activate(): void;
  public deactivate(): void;

  public select(index: number): void;
  public deselect(): void;
  public reselect(): void;

  public row(): number;
  public topRow(): number;
  public maxTopRow(): number;
  public setTopRow(row: number): void;
  public resetScroll(): void;
  public maxPageRows(): number;
  public maxPageItems(): number;
  public isHorizontal(): boolean;
  public bottomRow(): number;
  public setBottomRow(row: number): void;
  public topIndex(): number;

  public itemRect(index: number): Rectangle;
  public itemRectForText(index: number): Rectangle;

  public setHelpWindow(helpWindow: Window_Help | null): void;
  public showHelpWindow(): void;
  public hideHelpWindow(): void;

  public setHandler(symbol: string, method: () => void): void;
  public isHandled(symbol: string): boolean;
  public callHandler(symbol: string): void;

  public isOpenAndActive(): boolean;
  public isCursorMovable(): boolean;

  public cursorDown(wrap: boolean): void;
  public cursorUp(wrap: boolean): void;
  public cursorRight(wrap: boolean): void;
  public cursorLeft(wrap: boolean): void;
  public cursorPagedown(): void;
  public cursorPageup(): void;
  public scrollDown(): void;
  public scrollUp(): void;

  public update(): void;
  public updateArrows(): void;
  public processCursorMove(): void;
  public processHandling(): void;
  public processWheel(): void;

  public processTouch(): void;
  public isTouchedInsideFrame(): boolean;
  public onTouch(triggered: boolean): void;
  public hitTest(x: number, y: number): number;
  public isContentsArea(x: number, y: number): boolean;
  public isTouchOkEnabled(): boolean;
  public isOkEnabled(): boolean;
  public isCancelEnabled(): boolean;
  public isOkTriggered(): boolean;
  public isCancelTriggered(): boolean;
  public processOk(): void;
  public playOkSound(): void;
  public playBuzzerSound(): void;
  public callOkHandler(): void;
  public processCancel(): void;
  public callCancelHandler(): void;

  public processPageup(): void;
  public processPagedown(): void;

  public updateInputData(): void;
  public updateCursor(): void;
  public isCursorVisible(): boolean;
  public ensureCursorVisible(): void;

  public callUpdateHelp(): void;
  public updateHelp(): void;
  public setHelpWindowItem(item: MZ.Item | null): void;
  public isCurrentItemEnabled(): boolean;

  public drawAllItems(): void;
  public drawItem(index: number): void;
  public clearItem(index: number): void;
  public redrawItem(index: number): void;
  public redrawCurrentItem(): void;

  public refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of windows for selecting a command.
 */
declare class Window_Command extends Window_Selectable {
  public constructor(x?: number, y?: number);

  public _list: Window_Command.Command[];

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public numVisibleRows(): number;
  public maxItems(): number;

  public clearCommandList(): void;
  public makeCommandList(): void;

  public addCommand(name: string, symbol: string, enabled?: boolean, ext?: any): void;
  public commandName(index: number): string;
  public commandSymbol(index: number): string;
  public isCommandEnabled(index: number): boolean;

  public currentData(): Window_Command.Command | null;
  public isCurrentItemEnabled(): boolean;
  public currentSymbol(): string | null;
  public currentExt(): any;

  public findSymbol(symbol: string): number;
  public selectSymbol(symbol: string): void;
  public findExt(ext: any): number;
  public selectExt(ext: any): void;

  public drawItem(index: number): void;
  public itemTextAlign(): string;

  public isOkEnabled(): boolean;
  public callOkHandler(): void;

  public refresh(): void;
}

declare namespace Window_Command {
  interface Command {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
  }
}

//-----------------------------------------------------------------------------
/**
 * The command window for the horizontal selection format.
 */
declare class Window_HorzCommand extends Window_Command {
  public constructor(x?: number, y?: number);

  public initialize(...args: any[]): void;

  public numVisibleRows(): number;
  public maxCols(): number;
  public itemTextAlign(): string;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying the description of the selected item.
 */
declare class Window_Help extends Window_Base {
  public constructor(numLines?: number);

  public _text: string;

  public initialize(...args: any[]): void;

  public setText(text: string): void;
  public clear(): void;
  public setItem(item: MZ.Item | null): void;
  public refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying the party's gold.
 */
declare class Window_Gold extends Window_Base {
  public constructor(x?: number, y?: number);

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;

  public refresh(): void;

  public value(): number;
  public currencyUnit(): string;

  public open(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a command on the menu screen.
 */
declare class Window_MenuCommand extends Window_Command {
  public constructor(x?: number, y?: number);

  public static _lastCommandSymbol: string | null;

  public static initCommandPosition(): void;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public numVisibleRows(): number;

  public makeCommandList(): void;
  public addMainCommands(): void;
  public addFormationCommand(): void;
  public addOriginalCommands(): void;
  public addOptionsCommand(): void;
  public addSaveCommand(): void;
  public addGameEndCommand(): void;

  public needsCommand(name: string): boolean;
  public areMainCommandsEnabled(): boolean;
  public isFormationEnabled(): boolean;
  public isOptionsEnabled(): boolean;
  public isSaveEnabled(): boolean;
  public isGameEndEnabled(): boolean;

  public processOk(): void;
  public selectLast(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying party member status on the menu screen.
 */
declare class Window_MenuStatus extends Window_Selectable {
  public constructor(x?: number, y?: number);

  public _formationMode: boolean;
  public _pendingIndex: number;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public maxItems(): number;
  public itemHeight(): number;
  public numVisibleRows(): number;

  public loadImages(): void;

  public drawItem(index: number): void;
  public drawItemBackground(index: number): void;
  public drawItemImage(index: number): void;
  public drawItemStatus(index: number): void;

  public processOk(): void;
  public isCurrentItemEnabled(): boolean;
  public selectLast(): void;

  public formationMode(): boolean;
  public setFormationMode(formationMode: boolean): void;
  public pendingIndex(): number;
  public setPendingIndex(index: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a target actor on the item and skill screens.
 */
declare class Window_MenuActor extends Window_MenuStatus {
  public constructor();

  public initialize(...args: any[]): void;

  public processOk(): void;
  public selectLast(): void;
  public selectForItem(item: DataManager.Item): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a category of items on the item and shop screens.
 */
declare class Window_ItemCategory extends Window_HorzCommand {
  public constructor();

  public _itemWindow: Window_ItemList | null | undefined;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public maxCols(): number;

  public update(): void;

  public makeCommandList(): void;
  public setItemWindow(itemWindow: Window_ItemList | null): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an item on the item screen.
 */
declare class Window_ItemList extends Window_Selectable {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _category: string;
  public _data: (MZ.Item | MZ.Weapon | MZ.Armor | null)[];

  public initialize(...args: any[]): void;

  public setCategory(category: string): void;
  public maxCols(): number;
  public spacing(): number;
  public maxItems(): number;
  public item(): MZ.Item | MZ.Weapon | MZ.Armor | null;
  public isCurrentItemEnabled(): boolean;

  public includes(item: MZ.Item | MZ.Weapon | MZ.Armor): boolean;
  public needsNumber(): boolean;
  public isEnabled(item: MZ.Item | MZ.Weapon | MZ.Armor): boolean;

  public makeItemList(): void;
  public selectLast(): void;

  public drawItem(index: number): void;
  public numberWidth(): number;
  public drawItemNumber(item: MZ.Item | MZ.Weapon | MZ.Armor, x: number, y: number, width: number): void;

  public updateHelp(): void;
  public refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a skill type on the skill screen.
 */
declare class Window_SkillType extends Window_Command {
  public constructor(x?: number, y?: number);

  public _actor: Game_Actor | null;
  public _skillWindow: Window_SkillList | null | undefined;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public setActor(actor: Game_Actor): void;
  public numVisibleRows(): number;

  public makeCommandList(): void;

  public update(): void;

  public setSkillWindow(skillWindow: Window_SkillList | null): void;
  public selectLast(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying the skill user's status on the skill screen.
 */
declare class Window_SkillStatus extends Window_Base {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _actor: Game_Actor | null;

  public initialize(...args: any[]): void;

  public setActor(actor: Game_Actor | null): void;
  public refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a skill on the skill screen.
 */
declare class Window_SkillList extends Window_Selectable {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _actor: Game_Actor | null;
  public _stypeId: number;
  public _data: MZ.Skill[];

  public initialize(...args: any[]): void;

  public setActor(actor: Game_Actor): void;
  public setStypeId(stypeId: number): void;
  public maxCols(): number;
  public spacing(): number;
  public maxItems(): number;
  public item(): MZ.Skill | null;
  public isCurrentItemEnabled(): boolean;

  public includes(item: MZ.Skill | null): boolean;
  public isEnabled(item: MZ.Skill): void;

  public makeItemList(): void;
  public selectLast(): void;

  public drawItem(index: number): void;
  public costWidth(): number;
  public drawSkillCost(skill: MZ.Skill, x: number, y: number, width: number): void;

  public updateHelp(): void;
  public refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying parameter changes on the equipment screen.
 */
declare class Window_EquipStatus extends Window_Base {
  public constructor(x?: number, y?: number);

  public _actor: Game_Actor | null;
  public _tempActor: Game_Actor | null;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public numVisibleRows(): number;
  public setActor(actor: Game_Actor | null): void;

  public refresh(): void;

  public setTempActor(tempActor: Game_Actor | null): void;

  public drawItem(x: number, y: number, paramId: number): void;
  public drawParamName(x: number, y: number, paramId: number): void;
  public drawCurrentParam(x: number, y: number, paramId: number): void;
  public drawRightArrow(x: number, y: number): void;
  public drawNewParam(x: number, y: number, paramId: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a command on the equipment screen.
 */
declare class Window_EquipCommand extends Window_HorzCommand {
  public constructor(x: number, y: number, width: number);

  public _windowWidth: number;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public maxCols(): number;

  public makeCommandList(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an equipment slot on the equipment screen.
 */
declare class Window_EquipSlot extends Window_Selectable {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _actor: Game_Actor | null;
  public _statusWindow: Window_EquipStatus | null | undefined;
  public _itemWindow: Window_EquipItem | null | undefined;

  public initialize(...args: any[]): void;

  public setActor(actor: Game_Actor | null): void;

  public update(): void;

  public maxItems(): number;
  public item(): MZ.Weapon | MZ.Armor | null;

  public drawItem(index: number): void;
  public slotName(index: number): string;
  public isEnabled(index: number): boolean;
  public isCurrentItemEnabled(): boolean;

  public setStatusWindow(statusWindow: Window_EquipStatus | null): void;
  public setItemWindow(itemWindow: Window_EquipItem | null): void;

  public updateHelp(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an equipment item on the equipment screen.
 */
declare class Window_EquipItem extends Window_ItemList {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _actor: Game_Actor | null;
  public _slotId: number;
  public _statusWindow: Window_EquipStatus | null | undefined;

  public initialize(...args: any[]): void;

  public setActor(actor: Game_Actor | null): void;
  public setSlotId(slotId: number): void;

  public includes(item: MZ.Weapon | MZ.Armor): boolean;
  public isEnabled(item: MZ.Weapon | MZ.Armor): boolean;

  public selectLast(): void;
  public setStatusWindow(statusWindow: Window_EquipStatus | null): void;

  public updateHelp(): void;
  public playOkSound(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying full status on the status screen.
 */
declare class Window_Status extends Window_Selectable {
  public constructor();

  public _actor: Game_Actor | null | undefined;

  public initialize(...args: any[]): void;

  public setActor(actor: Game_Actor | null): void;

  public refresh(): void;
  public drawBlock1(y: number): void;
  public drawBlock2(y: number): void;
  public drawBlock3(y: number): void;
  public drawBlock4(y: number): void;
  public drawHorzLine(y: number): void;
  public lineColor(): string;
  public drawBasicInfo(x: number, y: number): void;
  public drawParameters(x: number, y: number): void;
  public drawExpInfo(x: number, y: number): void;
  public drawEquipments(x: number, y: number): void;
  public drawProfile(x: number, y: number): void;
  public maxEquipmentLines(): number;
}

//-----------------------------------------------------------------------------
/**
 * The window for changing various settings on the options screen.
 */
declare class Window_Options extends Window_Command {
  public constructor();

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;

  public updatePlacement(): void;

  public makeCommandList(): void;
  public addGeneralOptions(): void;
  public addVolumeOptions(): void;

  public drawItem(index: number): void;
  public statusWidth(): number;
  public statusText(index: number): string;
  public isVolumeSymbol(symbol: string): boolean;
  public booleanStatusText(value: boolean): string;
  public volumeStatusText(value: number): string;

  public processOk(): void;
  public cursorRight(wrap: boolean): void;
  public cursorLeft(wrap: boolean): void;
  public volumeOffset(): number;
  public changeValue(symbol: string, value: number): void;

  public getConfigValue(symbol: string): number;
  public setConfigValue(symbol: string, volume: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a save file on the save and load screens.
 */
declare class Window_SavefileList extends Window_Selectable {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _mode: string | null;

  public initialize(...args: any[]): void;

  public setMode(mode: string | null): void;
  public maxItems(): number;
  public maxVisibleItems(): number;
  public itemHeight(): number;

  public drawItem(index: number): void;
  public drawFileId(id: number, x: number, y: number): void;
  public drawContents(info: DataManager.SaveFileInfo, rect: Rectangle, valid: boolean): void;
  public drawGameTitle(info: DataManager.SaveFileInfo, x: number, y: number, width: number): void;
  public drawPartyCharacters(info: DataManager.SaveFileInfo, x: number, y: number): void;
  public drawPlaytime(info: DataManager.SaveFileInfo, x: number, y: number, width: number): void;

  public playOkSound(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting buy/sell on the shop screen.
 */
declare class Window_ShopCommand extends Window_HorzCommand {
  public constructor(width: number, purchaseOnly: boolean);

  public _windowWidth: number;
  public _purchaseOnly: boolean;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public maxCols(): number;

  public makeCommandList(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an item to buy on the shop screen.
 */
declare class Window_ShopBuy extends Window_Selectable {
  public constructor(x: number, y: number, height: number, shopGoods: number[][]);

  public _shopGoods: number[][];
  public _money: number;
  public _data: (MZ.Item | MZ.Weapon | MZ.Armor)[];
  public _price: number[];
  public _statusWindow: Window_ShopStatus | null | undefined;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public maxItems(): number;
  public item(): MZ.Item | MZ.Weapon | MZ.Armor;
  public setMoney(money: number): void;
  public isCurrentItemEnabled(): boolean;
  public price(item: MZ.Item | MZ.Weapon | MZ.Armor): number;
  public isEnabled(item: MZ.Item | MZ.Weapon | MZ.Armor): boolean;

  public refresh(): void;
  public makeItemList(): void;

  public drawItem(index: number): void;

  public setStatusWindow(statusWindow: Window_ShopStatus | null): void;
  public updateHelp(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an item to sell on the shop screen.
 */
declare class Window_ShopSell extends Window_ItemList {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public initialize(...args: any[]): void;

  public isEnabled(item: MZ.Item | MZ.Weapon | MZ.Armor | null): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
 */

declare class Window_ShopNumber extends Window_Selectable {
  public constructor(x?: number, y?: number, height?: number);

  public _item: MZ.Item | MZ.Weapon | MZ.Armor | null;
  public _max: number;
  public _price: number;
  public _number: number;
  public _currencyUnit: string;
  public _buttons: Sprite_Button[];

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public number(): number;

  public setup(item: MZ.Item | MZ.Weapon | MZ.Armor | null, max: number, price: number): void;

  public setCurrencyUnit(currencyUnit: string): void;

  public createButtons(): void;
  public placeButtons(): void;
  public updateButtonsVisiblity(): void;
  public showButtons(): void;
  public hideButtons(): void;

  public refresh(): void;
  public drawMultiplicationSign(): void;
  public drawNumber(): void;
  public drawTotalPrice(): void;

  public itemY(): number;
  public priceY(): number;
  public buttonY(): number;
  public cursorWidth(): number;
  public cursorX(): number;
  public maxDigits(): number;

  public update(): void;
  public isOkTriggered(): boolean;
  public playOkSound(): void;
  public processNumberChange(): void;
  public changeNumber(amount: number): void;
  public updateCursor(): void;
  public onButtonUp(): void;
  public onButtonUp2(): void;
  public onButtonDown(): void;
  public onButtonDown2(): void;
  public onButtonOk(): void;
} // equipment on the shop screen.

//-----------------------------------------------------------------------------
/**
 * The window for displaying number of items in possession and the actor's
 */ declare class Window_ShopStatus extends Window_Base {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public _item: MZ.Item | MZ.Weapon | MZ.Armor | null;
  public _pageIndex: number;

  public initialize(...args: any[]): void;

  public refresh(): void;

  public setItem(item: MZ.Item | MZ.Weapon | MZ.Armor | null): void;
  public isEquipItem(): boolean;

  public drawPossession(x: number, y: number): void;
  public drawEquipInfo(x: number, y: number): void;

  public statusMembers(): Game_Actor[];
  public pageSize(): number;
  public maxPages(): number;

  public drawActorEquipInfo(x: number, y: number, actor: Game_Actor): void;
  public drawActorParamChange(x: number, y: number, actor: Game_Actor, item1: MZ.Weapon | MZ.Armor | null): void;

  public paramId(): number;
  public currentEquippedItem(actor: Game_Actor, etypeId: number): MZ.Weapon | MZ.Armor | null;

  public update(): void;
  public updatePage(): void;

  public isPageChangeEnabled(): boolean;
  public isPageChangeRequested(): boolean;
  public isTouchedInsideFrame(): boolean;
  public changePage(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for editing an actor's name on the name input screen.
 */
declare class Window_NameEdit extends Window_Base {
  public constructor(actor: Game_Actor, maxLength: number);

  public _actor: Game_Actor;
  public _name: string;
  public _index: number;
  public _maxLength: number;
  public _defaultName: string;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  // public name():string;

  public restoreDefault(): boolean;
  public add(ch: string): boolean;
  public back(): boolean;

  public faceWidth(): number;
  public charWidth(): number;
  public left(): number;
  public itemRect(index: number): Window_NameEdit.Rectangle;
  public underlineRect(index: number): Window_NameEdit.Rectangle;
  public underlineColor(): string;

  public drawUnderline(indexn: number): void;
  public drawChar(indexn: number): void;
  public refresh(): void;
}

declare namespace Window_NameEdit {
  interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting text characters on the name input screen.
 */
declare class Window_NameInput extends Window_Selectable {
  public constructor(editWindow: Window_NameEdit);

  public static readonly LATIN1: ReadonlyArray<string>;
  public static readonly LATIN2: ReadonlyArray<string>;
  public static readonly RUSSIA: ReadonlyArray<string>;
  public static readonly JAPAN1: ReadonlyArray<string>;
  public static readonly JAPAN2: ReadonlyArray<string>;
  public static readonly JAPAN3: ReadonlyArray<string>;

  public _editWindow: Window_NameEdit;
  public _page: number;

  public initialize(...args: any[]): void;

  public windowHeight(): number;
  public table(): ReadonlyArray<string>[];
  public maxCols(): number;
  public maxItems(): number;
  public character(): string;
  public isPageChange(): boolean;
  public isOk(): boolean;
  public itemRect(index: number): Rectangle; /* Window_NameEdit.Rectangle */

  public refresh(): void;

  public updateCursor(): void;
  public isCursorMovable(): boolean;
  public cursorDown(wrap: boolean): void;
  public cursorUp(wrap: boolean): void;
  public cursorRight(wrap: boolean): void;
  public cursorLeft(wrap: boolean): void;
  public cursorPagedown(): void;
  public cursorPageup(): void;
  public processCursorMove(): void;
  public processHandling(): void;
  public isCancelEnabled(): boolean;
  public processCancel(): void;
  public processJump(): void;
  public processBack(): void;
  public processOk(): void;
  public onNameAdd(): void;
  public onNameOk(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window used for the event command [Show Choices].
 */
declare class Window_ChoiceList extends Window_Command {
  public constructor(messageWindow: Window_Message);

  public _messageWindow: Window_Message;
  public _background: number;

  public initialize(...args: any[]): void;

  public start(): void;
  public selectDefault(): void;

  public updatePlacement(): void;
  public updateBackground(): void;

  public windowWidth(): number;
  public numVisibleRows(): number;
  public maxChoiceWidth(): number;
  public textWidthEx(text: string): number;
  public contentsHeight(): number;

  public makeCommandList(): void;
  public drawItem(index: number): void;

  public isCancelEnabled(): boolean;
  public isOkTriggered(): boolean;
  public callOkHandler(): void;
  public callCancelHandler(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window used for the event command [Input Number].
 */
declare class Window_NumberInput extends Window_Selectable {
  public constructor(messageWindow: Window_Message);

  public _messageWindow: Window_Message;
  public _number: number;
  public _maxDigits: number;
  public _buttons: Sprite_Button[];

  public initialize(...args: any[]): void;

  public start(): void;
  public updatePlacement(): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public maxCols(): number;
  public maxItems(): number;
  public spacing(): number;
  public itemWidth(): number;

  public createButtons(): void;
  public placeButtons(): void;
  public updateButtonsVisiblity(): void;
  public showButtons(): void;
  public hideButtons(): void;
  public buttonY(): number;

  public update(): void;
  public processDigitChange(): void;
  public changeDigit(up: boolean): void;
  public isTouchOkEnabled(): boolean;
  public isOkEnabled(): boolean;
  public isCancelEnabled(): boolean;
  public isOkTriggered(): boolean;
  public processOk(): void;
  public drawItem(index: number): void;
  public onButtonUp(): void;
  public onButtonDown(): void;
  public onButtonOk(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window used for the event command [Select Item].
 */
declare class Window_EventItem extends Window_ItemList {
  public constructor(messageWindow: Window_Message);

  public _messageWindow: Window_Message;

  public initialize(...args: any[]): void;

  public windowHeight(): number;
  public numVisibleRows(): number;

  public start(): void;
  public updatePlacement(): void;

  public includes(item: MZ.Item): boolean;
  public isEnabled(item: MZ.Item): boolean;

  public onOk(): void;
  public onCancel(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying text messages.
 */
declare class Window_Message extends Window_Base {
  public constructor();

  public _background: number;
  public _positionType: number;
  public _waitCount: number;
  public _faceBitmap: Bitmap | null;
  public _textState: Window_Base.TextState | null;
  public _goldWindow: Window_Gold;
  public _choiceWindow: Window_ChoiceList;
  public _numberWindow: Window_NumberInput;
  public _itemWindow: Window_EventItem;
  public _showFast: boolean;
  public _lineShowFast: boolean;
  public _pauseSkip: boolean;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public subWindows(): Window_Base[];
  public createSubWindows(): void;

  public windowWidth(): number;
  public windowHeight(): number;

  public clearFlags(): void;

  public numVisibleRows(): number;

  public update(): void;
  public checkToNotClose(): void;
  public canStart(): boolean;
  public startMessage(): void;
  public updatePlacement(): void;
  public updateBackground(): void;
  public terminateMessage(): void;
  public updateWait(): boolean;
  public updateLoading(): boolean;
  public updateInput(): boolean;
  public isAnySubWindowActive(): boolean;
  public updateMessage(): boolean;
  public onEndOfText(): void;
  public startInput(): boolean;
  public isTriggered(): boolean;
  public doesContinue(): boolean;
  public areSettingsChanged(): boolean;
  public updateShowFast(): void;
  public newPage(textState: Window_Base.TextState): void;
  public loadMessageFace(): void;
  public drawMessageFace(): void;
  public newLineX(): number;

  public processNewLine(textState: Window_Base.TextState): void;
  public processNewPage(textState: Window_Base.TextState): void;
  public isEndOfText(textState: Window_Base.TextState): boolean;
  public needsNewPage(textState: Window_Base.TextState): boolean;
  public processEscapeCharacter(code: string, textState: Window_Base.TextState): void;
  public startWait(count: number): void;
  public startPause(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying scrolling text. No frame is displayed, but it
 * is handled as a window for convenience.
 */
declare class Window_ScrollText extends Window_Base {
  public constructor();

  public _text: string | null;
  public _allTextHeight: number;

  public initialize(...args: any[]): void;

  public update(): void;
  public startMessage(): void;

  public refresh(): void;

  public contentsHeight(): number;
  public updateMessage(): void;
  public scrollSpeed(): number;
  public isFastForward(): boolean;
  public fastForwardRate(): number;

  public terminateMessage(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying the map name on the map screen.
 */
declare class Window_MapName extends Window_Base {
  public constructor();

  public contentsOpacity: number;
  public _showCount: number;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;

  public update(): void;
  public updateFadeIn(): void;
  public updateFadeOut(): void;

  public open(): void;
  public close(): void;
  public refresh(): void;

  public drawBackground(x: number, y: number, width: number, height: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying battle progress. No frame is displayed, but it is
 * handled as a window for convenience.
 */

declare class Window_BattleLog extends Window_Base {
  public constructor();

  public _lines: string[];
  public _methods: { name: string; params: any[] }[];
  public _waitCount: number;
  public _waitMode: string;
  public _baseLineStack: number[];
  public _spriteset: Spriteset_Battle | null;

  public initialize(rect: Rectangle): void;

  public setSpriteset(spriteset: Spriteset_Battle | null): void;
  public windowWidth(): number;
  public windowHeight(): number;
  public maxLines(): number;

  public createBackBitmap(): void;
  public createBackSprite(): void;

  public numLines(): number;
  public messageSpeed(): number;
  public isBusy(): boolean;

  public update(): void;
  public updateWait(): boolean;
  public updateWaitCount(): boolean;
  public updateWaitMode(): boolean;
  public setWaitMode(waitMode: string): void;

  public callNextMethod(): void;
  public isFastForward(): boolean;
  public push(methodName: string, ...methodArgs: any[]): void;

  public clear(): void;
  public wait(): void;
  public waitForEffect(): void;
  public waitForMovement(): void;
  public addText(text: string): void;
  public pushBaseLine(): void;
  public popBaseLine(): void;
  public waitForNewLine(): void;

  public popupDamage(target: Game_Battler): void;
  public performActionStart(subject: Game_Battler, action: Game_Action): void;
  public performAction(subject: Game_Battler, action: Game_Action): void;
  public performActionEnd(subject: Game_Battler): void;
  public performDamage(target: Game_Battler): void;
  public performMiss(target: Game_Battler): void;
  public performRecovery(target: Game_Battler): void;
  public performEvasion(target: Game_Battler): void;
  public performMagicEvasion(target: Game_Battler): void;
  public performCounter(target: Game_Battler): void;
  public performReflection(target: Game_Battler): void;
  public performSubstitute(substitute: Game_Battler, target: Game_Battler): void;
  public performCollapse(target: Game_Battler): void;

  public showAnimation(subject: Game_Battler, targets: Game_Battler[], animationId: number): void;
  public showAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
  public showActorAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
  public showEnemyAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
  public showNormalAnimation(targets: Game_Battler, animationId: number, mirror: boolean): void;

  public refresh(): void;
  public drawBackground(): void;
  public backRect(): Rectangle;
  public lineRect(index: number): Rectangle;
  public backColor(): string;
  public backPaintOpacity(): number;
  public drawLineText(index: number): void;

  public startTurn(): void;
  public startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]): void;
  public endAction(subject: Game_Battler): void;
  public displayCurrentState(subject: Game_Battler): void;
  public displayRegeneration(subject: Game_Battler): void;
  public displayAction(subject: Game_Battler, item: MZ.Skill | MZ.Item): void;
  public displayCounter(target: Game_Battler): void;
  public displayReflection(target: Game_Battler): void;
  public displaySubstitute(substitute: Game_Battler, target: Game_Battler): void;
  public displayActionResults(subject: Game_Battler, target: Game_Battler): void;
  public displayFailure(target: Game_Battler): void;
  public displayCritical(target: Game_Battler): void;
  public displayDamage(target: Game_Battler): void;
  public displayMiss(target: Game_Battler): void;
  public displayEvasion(target: Game_Battler): void;
  public displayHpDamage(target: Game_Battler): void;
  public displayMpDamage(target: Game_Battler): void;
  public displayTpDamage(target: Game_Battler): void;
  public displayAffectedStatus(target: Game_Battler): void;
  public displayAutoAffectedStatus(target: Game_Battler): void;
  public displayChangedStates(target: Game_Battler): void;
  public displayAddedStates(target: Game_Battler): void;
  public displayRemovedStates(target: Game_Battler): void;
  public displayChangedBuffs(target: Game_Battler): void;
  public displayBuffs(target: Game_Battler, buffs: number[], fmt: string): void;

  public makeHpDamageText(target: Game_Battler): string;
  public makeMpDamageText(target: Game_Battler): string;
  public makeTpDamageText(target: Game_Battler): string;
}

declare namespace Window_BattleLog {
  interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting whether to fight or escape on the battle screen.
 */
declare class Window_PartyCommand extends Window_Command {
  public constructor();

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public numVisibleRows(): number;

  public makeCommandList(): void;
  public setup(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an actor's action on the battle screen.
 */
declare class Window_ActorCommand extends Window_Command {
  public constructor();

  public _actor: Game_Actor | null;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public numVisibleRows(): number;

  public makeCommandList(): void;
  public addAttackCommand(): void;
  public addSkillCommands(): void;
  public addGuardCommand(): void;
  public addItemCommand(): void;

  public setup(actor: Game_Actor | null): void;
  public processOk(): void;
  public selectLast(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying the status of party members on the battle screen.
 */
declare class Window_BattleStatus extends Window_Selectable {
  public constructor();

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public numVisibleRows(): number;
  public maxItems(): number;

  public refresh(): void;

  public drawItem(index: number): void;
  public basicAreaRect(index: number): Rectangle;
  public gaugeAreaRect(index: number): Rectangle;
  public gaugeAreaWidth(): number;
  public drawBasicArea(rect: Rectangle, actor: Game_Actor): void;
  public drawGaugeArea(rect: Rectangle, actor: Game_Actor): void;
  public drawGaugeAreaWithTp(rect: Rectangle, actor: Game_Actor): void;
  public drawGaugeAreaWithoutTp(rect: Rectangle, actor: Game_Actor): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a target actor on the battle screen.
 */
declare class Window_BattleActor extends Window_BattleStatus {
  public constructor(x: number, y: number);

  public initialize(...args: any[]): void;

  public show(): void;
  public hide(): void;
  public select(index: number): void;

  public actor(): Game_Actor;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a target enemy on the battle screen.
 */
declare class Window_BattleEnemy extends Window_Selectable {
  public constructor(x?: number, y?: number);

  public _enemies: Game_Enemy[];

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public numVisibleRows(): number;
  public maxCols(): number;
  public maxItems(): number;
  public enemy(): Game_Enemy;
  public enemyIndex(): number;

  public drawItem(index: number): void;

  public show(): void;
  public hide(): void;

  public refresh(): void;
  public select(index: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a skill to use on the battle screen.
 */
declare class Window_BattleSkill extends Window_SkillList {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public initialize(...args: any[]): void;

  public show(): void;
  public hide(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting an item to use on the battle screen.
 */
declare class Window_BattleItem extends Window_ItemList {
  public constructor(x?: number, y?: number, width?: number, height?: number);

  public initialize(...args: any[]): void;

  public includes(item: MZ.Item): boolean;
  public show(): void;
  public hide(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting New Game/Continue on the title screen.
 */
declare class Window_TitleCommand extends Window_Command {
  public constructor();

  public static _lastCommandSymbol: string | null;

  public static initCommandPosition(): void;

  public initialize(...args: any[]): void;

  public windowWidth(): number;

  public updatePlacement(): void;
  public makeCommandList(): void;
  public isContinueEnabled(): boolean;
  public processOk(): void;
  public selectLast(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting "Go to Title" on the game end screen.
 */
declare class Window_GameEnd extends Window_Command {
  public constructor();

  public initialize(...args: any[]): void;

  public windowWidth(): number;

  public updatePlacement(): void;
  public makeCommandList(): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for selecting a block of switches/variables on the debug screen.
 */
declare class Window_DebugRange extends Window_Selectable {
  public constructor();

  public static lastTopRow: number;
  public static lastIndex: number;

  public _maxSwitches: number;
  public _maxVariables: number;
  public _editWindow: Window_DebugEdit | null | undefined;

  public initialize(...args: any[]): void;

  public windowWidth(): number;
  public windowHeight(): number;
  public maxItems(): number;

  public update(): void;

  public mode(): string;
  public topId(): number;

  public refresh(): void;
  public drawItem(index: number): void;
  public isCancelTriggered(): boolean;
  public processCancel(): void;

  public setEditWindow(editWindow: Window_DebugEdit | null): void;
}

//-----------------------------------------------------------------------------
/**
 * The window for displaying switches and variables on the debug screen.
 */
declare class Window_DebugEdit extends Window_Selectable {
  public constructor();

  public _mode: string;
  public _topId: number;

  public initialize(...args: any[]): void;

  public maxItems(): number;

  public refresh(): void;
  public drawItem(index: number): void;
  public itemName(dataId: number): string;
  public itemStatus(dataId: number): string;

  public setMode(mode: string): void;
  public setTopId(id: number): void;
  public currentId(): number;

  public update(): void;
  public updateSwitch(): void;
  public updateVariable(): void;
}
