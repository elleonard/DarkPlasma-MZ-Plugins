// DarkPlasma_FormationInMenu 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/09/23 1.0.0 公開
 */

/*:ja
 * @plugindesc メニューの並び替えを専用シーンに変える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @base DarkPlasma_Formation
 *
 * @help
 * メニューの並び替えを DarkPlasma_Formation の専用並び替えシーンにすり替えます。
 */

(() => {
  'use strict';

  Scene_Menu.prototype.commandFormation = function () {
    SceneManager.push(Scene_Formation);
  };
})();
