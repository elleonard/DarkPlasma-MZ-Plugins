import { settings } from './_build/DarkPlasma_FreezePlayer_parameters';

/**
 * @param {Game_Player.prototype} gamePlayer
 */
function Game_Player_FreezeMixIn(gamePlayer) {
  const _canMove = gamePlayer.canMove;
  gamePlayer.canMove = function () {
    return _canMove.call(this) && (!settings.switchId || !$gameSwitches.value(settings.switchId));
  };
}

Game_Player_FreezeMixIn(Game_Player.prototype);
