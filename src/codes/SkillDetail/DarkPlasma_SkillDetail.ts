import { settings } from './_build/DarkPlasma_SkillDetail_parameters';
import { Window_DetailText } from '../../common/window/detailWindow';
import { Window_WithDetailWindowMixIn } from '../../common/window/withDetailWindow';

const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  if ($dataSkills && this.isSkill(data)) {
    if (data.meta.detail) {
      data.detail = String(data.meta.detail).replace(/^(\r|\n| |\t)+/, '');
    }
  }
};

function Scene_Skill_SkillDetailMixIn(sceneSkill: Scene_Skill) {
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

function Scene_Battle_SkillDetailMixIn(sceneBattle: Scene_Battle) {
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

class Window_SkillDetail extends Window_DetailText {
}

type _Window_SkillDetail = typeof Window_SkillDetail;
declare global {
  var Window_SkillDetail: _Window_SkillDetail;
}
globalThis.Window_SkillDetail = Window_SkillDetail;
