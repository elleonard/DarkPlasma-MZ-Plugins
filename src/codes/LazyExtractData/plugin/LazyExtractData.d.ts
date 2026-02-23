/// <reference path="../../../typings/rmmz.d.ts" />

declare namespace DataManager {
  var _lazyExtractData: DataManager.NoteHolder[];

  function lazyExtractData(): void;
  function pushLazyExtractData(data: DataManager.NoteHolder): void;
  function lazyExtractMetadata(data: DataManager.NoteHolder): void;
}
