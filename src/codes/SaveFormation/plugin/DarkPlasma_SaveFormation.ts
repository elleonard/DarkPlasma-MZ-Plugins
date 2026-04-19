/// <reference path="./SaveFormation.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_loadFormation, command_saveFormation, parseArgs_loadFormation, parseArgs_saveFormation } from '../config/_build/DarkPlasma_SaveFormation_commands';

PluginManager.registerCommand(pluginName, command_saveFormation, function (args) {
  const parsedArgs = parseArgs_saveFormation(args);

  $gameParty.saveMemberFormation(parsedArgs.key);
});

PluginManager.registerCommand(pluginName, command_loadFormation, function (args) {
  const parsedArgs = parseArgs_loadFormation(args);

  $gameParty.loadMemberFormation(parsedArgs.key);
});

function Game_Party_SaveFormationMixIn(gameParty: Game_Party) {
  gameParty.initializeMemberFormations = function () {
    this._savedMemberFormations = new Map();
  };

  gameParty.saveMemberFormation = function (key) {
    if (!this._savedMemberFormations) {
      this.initializeMemberFormations();
    }
    this._savedMemberFormations?.set(key, [...this._actors]);
  };

  gameParty.loadMemberFormation = function (key) {
    if (!this._savedMemberFormations) {
      this.initializeMemberFormations();
    }
    const members = this._savedMemberFormations?.get(key);
    if (members) {
      this._actors = [...members];
      $gamePlayer.refresh();
      $gameMap.requestRefresh();
      $gameTemp.requestBattleRefresh();
    }
  };
}

Game_Party_SaveFormationMixIn(Game_Party.prototype);
