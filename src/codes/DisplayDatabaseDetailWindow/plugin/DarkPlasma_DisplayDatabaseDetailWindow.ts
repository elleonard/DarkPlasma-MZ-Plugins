/// <reference path="./DisplayDatabaseDetailWindow.d.ts" />

import { Window_DetailText } from '../../../common/window/detailWindow';
import { Window_WithDetailWindowMixIn } from '../../../common/window/withDetailWindow';

type _Window_DetailText = typeof Window_DetailText;
declare global {
  var Window_DetailText: _Window_DetailText;
  function Window_WithDetailWindowMixIn(openDetailKey: string, windowClass: Window_Selectable): void;
}

globalThis.Window_DetailText = Window_DetailText;
globalThis.Window_WithDetailWindowMixIn = Window_WithDetailWindowMixIn;
