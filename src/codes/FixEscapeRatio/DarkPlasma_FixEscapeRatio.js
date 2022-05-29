import { settings } from './_build/DarkPlasma_FixEscapeRatio_parameters';

BattleManager.makeEscapeRatio = function () {
  this._escapeRatio = settings.ratio / 100;
};

const _onEscapeFailure = BattleManager.onEscapeFailure;
BattleManager.onEscapeFailure = function () {
  _onEscapeFailure.call(this);
  this._escapeRatio = settings.ratio / 100; // 逃走失敗時の増加分を無視する
};
