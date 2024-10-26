/// <reference path="./VariableCommonEvent.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_variableCommonEvent, parseArgs_variableCommonEvent } from '../config/_build/DarkPlasma_VariableCommonEvent_commands';

PluginManager.registerCommand(pluginName, command_variableCommonEvent, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_variableCommonEvent(args);
  const commonEvent = $dataCommonEvents[$gameVariables.value(parsedArgs.variableId)];
  if (commonEvent) {
    const eventId = this.isOnCurrentMap() ? this._eventId : 0;
    this.setupChild(commonEvent.list, eventId);
  }
});
