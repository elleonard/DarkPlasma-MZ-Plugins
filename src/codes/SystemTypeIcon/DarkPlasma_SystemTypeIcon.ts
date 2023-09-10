/// <reference path="./SystemTypeIcon.d.ts" />

import { settings } from "./_build/DarkPlasma_SystemTypeIcon_parameters";

function Game_System_SystemTypeIconMixIn(gameSystem: Game_System) {
  gameSystem.elementIconIndex = function (elementId) {
    return settings.elementIcons[elementId] || 0;
  };

  gameSystem.largeDebuffStatusIconIndex = function (paramName) {
    return settings.debuffStatusIcons[paramName]?.large || 0;
  };

  gameSystem.smallDebuffStatusIconIndex = function (paramName) {
    return settings.debuffStatusIcons[paramName]?.small || 0;
  };

  gameSystem.weaponTypeIconIndex = function (weaponTypeId) {
    return settings.weaponTypeIcons[weaponTypeId] || 0;
  };

  gameSystem.armorTypeIconIndex = function (armorTypeId) {
    return settings.armorTypeIcons[armorTypeId] || 0;
  };
}

Game_System_SystemTypeIconMixIn(Game_System.prototype);
