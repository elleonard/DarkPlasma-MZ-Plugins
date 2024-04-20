// DarkPlasma_SkillDetail 2.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/04/20 2.0.1 共通化した実装を基底プラグインに分離
 * 2024/04/17 2.0.0 実装をItemDetailに合わせる
 *                  Window_SkillDetailMixInを削除
 * 2023/12/09 1.1.0 戦闘中に表示する機能を追加
 * 2023/09/04 1.0.1 typescript移行
 * 2022/01/07 1.0.0 公開
 */

/*:
 * @plugindesc スキルに詳細説明文を追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @base DarkPlasma_DisplayDatabaseDetailWindow
 * @orderAfter DarkPlasma_CustomKeyHandler
 * @orderAfter DarkPlasma_DisplayDatabaseDetailWindow
 *
 * @param openDetailKey
 * @desc 詳細説明を開くためのボタン
 * @text 詳細説明ボタン
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @help
 * version: 2.0.1
 * スキルウィンドウのスキルにカーソルを合わせて特定のボタンを押すと
 * スキル詳細説明画面を開きます。
 *
 * スキルのメモ欄に下記のような記述で詳細説明を記述できます。
 * <detail:詳細説明文。
 * ～～～～。>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.3.0
 * DarkPlasma_DisplayDatabaseDetailWindow version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 * DarkPlasma_DisplayDatabaseDetailWindow
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    openDetailKey: String(pluginParameters.openDetailKey || `shift`),
  };

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if ($dataSkills && this.isSkill(data)) {
      if (data.meta.detail) {
        data.detail = String(data.meta.detail).replace(/^(\r|\n| |\t)+/, '');
      }
    }
  };
  function Scene_Skill_SkillDetailMixIn(sceneSkill) {
    const _create = sceneSkill.create;
    sceneSkill.create = function () {
      _create.call(this);
      this.createDetailWindow();
    };
    const _createItemWindow = sceneSkill.createItemWindow;
    sceneSkill.createItemWindow = function () {
      _createItemWindow.call(this);
      this._itemWindow.setHandler('detail', this.toggleDetailWindow.bind(this));
    };
    sceneSkill.toggleDetailWindow = function () {
      this._itemWindow.activate();
      if (!this._detailWindow.visible) {
        this._detailWindow.show();
      } else {
        this._detailWindow.hide();
      }
    };
    sceneSkill.createDetailWindow = function () {
      this._detailWindowLayer = new WindowLayer();
      this._detailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._detailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._detailWindowLayer);
      this._detailWindow = new Window_SkillDetail(this.detailWindowRect());
      this._detailWindowLayer.addChild(this._detailWindow);
      this._itemWindow.setDetailWindow(this._detailWindow);
    };
    sceneSkill.detailWindowRect = function () {
      return this.itemWindowRect();
    };
  }
  Scene_Skill_SkillDetailMixIn(Scene_Skill.prototype);
  function Scene_Battle_SkillDetailMixIn(sceneBattle) {
    const _create = sceneBattle.create;
    sceneBattle.create = function () {
      _create.call(this);
      this.createSkillDetailWindow();
    };
    const _createSkillWindow = sceneBattle.createSkillWindow;
    sceneBattle.createSkillWindow = function () {
      _createSkillWindow.call(this);
      this._skillWindow.setHandler('detail', this.toggleSkillDetailWindow.bind(this));
    };
    sceneBattle.toggleSkillDetailWindow = function () {
      this._skillWindow.activate();
      if (!this._skillDetailWindow.visible) {
        this._skillDetailWindow.show();
      } else {
        this._skillDetailWindow.hide();
      }
    };
    sceneBattle.createSkillDetailWindow = function () {
      this._skillDetailWindowLayer = new WindowLayer();
      this._skillDetailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._skillDetailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._skillDetailWindowLayer);
      this._skillDetailWindow = new Window_SkillDetail(this.skillDetailWindowRect());
      this._skillDetailWindowLayer.addChild(this._skillDetailWindow);
      this._skillWindow.setDetailWindow(this._skillDetailWindow);
    };
    sceneBattle.skillDetailWindowRect = function () {
      return this.skillWindowRect();
    };
  }
  Scene_Battle_SkillDetailMixIn(Scene_Battle.prototype);
  Window_WithDetailWindowMixIn(settings.openDetailKey, Window_SkillList.prototype);
  class Window_SkillDetail extends Window_DetailText {}
  globalThis.Window_SkillDetail = Window_SkillDetail;
})();
