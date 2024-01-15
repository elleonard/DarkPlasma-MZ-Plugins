/// <reference path="../../../typings/rmmz.d.ts" />

declare namespace Graphics {
  export var _importExportElement: HTMLTextAreaElement;
  export var _importExportMode: boolean;
  export function _createImportExportArea(): void;
  export function _importExportAreaRect(): Rectangle;
  export function showImportExportArea(): void;
  export function hideImportExportArea(): void;
  export function importExportAreaValue(): string;
  export function setImportExportAreaValue(text: string): void;
  export function setImportExportAreaPlaceholder(text: string): void;
}

declare namespace DataManager {
  export function isThisGameFile(savefileId: number): boolean
  export function saveCompressedGamedata(savefileId: number, zip: string): Promise<number>;
  export function loadCompressedGamedata(savefileId: number): Promise<string>;
}

declare interface Scene_File {
  _okButton: Sprite_ImportExportButton;
  _cancelButton: Sprite_ImportExportButton;
  _importButton: Sprite_ImportExportButton;
  _exportButton: Sprite_ImportExportButton;

  createOkCancelButton(): void;
  createImportExportButton(): void;
  onExportClicked(): void;
  onImportClicked(): void;
  onExportOkClicked(): void;
  onImportOkClicked(): void;
  onImportCancelClicked(): void;
}

declare interface Window_SavefileList {
  _importButton: Sprite_ImportExportButton;
  _exportButton: Sprite_ImportExportButton;

  createImportExportButton(): void;
  setExportHandler(handler: () => void): void;
  setImportHandler(handler: () => void): void;
}

declare interface Sprite_ImportExportButton extends Sprite_Button {

}
