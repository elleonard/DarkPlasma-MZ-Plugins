import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_DashSpeed_parameters';

const PLUGIN_COMMAND_NAME = {
  CHANGE_DASH_SPEED: 'changeDashSpeed',
};

const _Game_Player_initMember = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function () {
  _Game_Player_initMember.call(this);
  this._dashSpeed = settings.defaultDashSpeed;
};

Game_Player.prototype.realMoveSpeed = function () {
  return this._moveSpeed + (this.isDashing() ? this._dashSpeed : 0);
};

Game_Player.prototype.dashSpeed = function () {
  return this._dashSpeed === undefined ? settings.defaultDashSpeed : this._dashSpeed;
};

Game_Player.prototype.setDashSpeed = function (dashSpeed) {
  this._dashSpeed = dashSpeed;
};

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_DASH_SPEED, function (args) {
  $gamePlayer.setDashSpeed(Number(args.dashSpeed));
});
