/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Map {
  mustSaveEventLocations(): boolean;
}

declare interface Game_Event {
  mustSaveLocation(): boolean;
  mustRestoreLocation(): boolean;
  restoreLocation(): void;
}

declare interface Game_System {
  _eventLocations: Game_EventLocations;

  storeEventLocation(mapId: number, eventId: number, x: number, y: number, direction: number): void;
  fetchSavedEventLocation(mapId: number, eventId: number): Game_EventLocation|undefined;
}
