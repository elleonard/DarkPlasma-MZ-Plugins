/// <reference path="../../typings/rmmz.d.ts" />

declare var uniqueEffectCodeCache: UniqueEffectCodeCache;

declare interface UniqueEffectCodeCache {
  allocate(pluginName: string, localId: number): UniqueEffectCode;
}

declare interface UniqueEffectCode {
  readonly code: number;
}
