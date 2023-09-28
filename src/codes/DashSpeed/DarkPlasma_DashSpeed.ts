import { pluginName } from '../../common/pluginName';
import { command_changeDashSpeed } from './_build/DarkPlasma_DashSpeed_commands';
import { settings } from './_build/DarkPlasma_DashSpeed_parameters';

PluginManager.registerCommand(pluginName, command_changeDashSpeed, function (args) {
  $gamePlayer.setDashSpeed(Number(args.dashSpeed));
});

function Game_Player_DashSpeedMixIn(gamePlayer: Game_Player) {
  const _initMember = gamePlayer.initMembers;
  gamePlayer.initMembers = function () {
    _initMember.call(this);
    this._dashSpeed = settings.defaultDashSpeed;
  };
  
  gamePlayer.realMoveSpeed = function () {
    return this._moveSpeed + (this.isDashing() ? this.dashSpeed() : 0);
  };
  
  gamePlayer.dashSpeed = function () {
    if (this._dashSpeed === undefined) {
      this._dashSpeed = settings.defaultDashSpeed;
    }
    return this._dashSpeed;
  };
  
  gamePlayer.setDashSpeed = function (dashSpeed) {
    this._dashSpeed = dashSpeed;
  };
}

Game_Player_DashSpeedMixIn(Game_Player.prototype);
