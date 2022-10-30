// DarkPlasma_HighlightNewSkill 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/10/30 1.0.0 公開
 */

/*:ja
 * @plugindesc 新しく習得したスキルを強調表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param newSkillColor
 * @desc 新しく習得したスキルの色番号を指定します。
 * @text スキル色
 * @type number
 * @default 2
 *
 * @param highlightFirstSkills
 * @desc 初期スキルをゲーム開始時に新規習得スキルとして強調するかどうか。
 * @text 初期スキル強調
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.0
 * スキル一覧で、新しく習得したスキルを強調表示します。
 * 強調表示は一度カーソルを合わせると元の色に戻ります。
 *
 * 本プラグインはセーブデータに以下を追加します。
 * - アクターごとの新規習得スキルID一覧
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    newSkillColor: Number(pluginParameters.newSkillColor || 2),
    highlightFirstSkills: String(pluginParameters.highlightFirstSkills || true) === 'true',
  };

  function Game_Actor_HighlightNewSkllMixIn(gameActor) {
    const _initSkills = gameActor.initSkills;
    gameActor.initSkills = function () {
      _initSkills.call(this);
      if (!settings.highlightFirstSkills) {
        this._newSkillIds = [];
      }
    };
    gameActor.newSkillIds = function () {
      if (!this._newSkillIds) {
        this._newSkillIds = [];
      }
      return this._newSkillIds;
    };
    gameActor.addNewSkill = function (skillId) {
      this.newSkillIds().push(skillId);
    };
    gameActor.isNewSkill = function (skill) {
      return this.newSkillIds().includes(skill.id);
    };
    gameActor.touchSkill = function (skill) {
      this._newSkillIds = this.newSkillIds().filter((id) => id !== skill.id);
    };
    const _learnSkill = gameActor.learnSkill;
    gameActor.learnSkill = function (skillId) {
      if (!this.isLearnedSkill(skillId)) {
        this.addNewSkill(skillId);
      }
      _learnSkill.call(this, skillId);
    };
  }
  Game_Actor_HighlightNewSkllMixIn(Game_Actor.prototype);
  function Window_SkillList_HighlightNewSkillMixIn(windowClass) {
    const _drawItemName = windowClass.drawItemName;
    windowClass.drawItemName = function (item, x, y, width) {
      if (this.isNewSkill(item)) {
        this.drawNewItemName(item, x, y, width);
      } else {
        _drawItemName.call(this, item, x, y, width);
      }
    };
    windowClass.isNewSkill = function (skill) {
      return !!skill && !!this._actor && DataManager.isSkill(skill) && this._actor.isNewSkill(skill);
    };
    windowClass.drawNewItemName = function (skill, x, y, width) {
      const resetTextColor = this.resetTextColor;
      this.resetTextColor = () => {};
      this.changeTextColor(ColorManager.textColor(settings.newSkillColor));
      _drawItemName.call(this, skill, x, y, width);
      this.resetTextColor = resetTextColor;
      this.resetTextColor();
    };
    const _select = windowClass.select;
    windowClass.select = function (index) {
      var _a;
      _select.call(this, index);
      const skill = this.item();
      if (this.isNewSkill(skill)) {
        (_a = this._actor) === null || _a === void 0 ? void 0 : _a.touchSkill(skill);
        this.refresh();
      }
    };
  }
  Window_SkillList_HighlightNewSkillMixIn(Window_SkillList.prototype);
})();
