import { Sprite_ToggleButton } from '../../common/sprite/toggleButton';
import { settings } from './_build/DarkPlasma_SkillDetailButton_parameters';

/**
 * @param {Scene_Skill.prototype} sceneSkill
 */
function Scene_Skill_SkillDetailButtonMixIn(sceneSkill) {
  const _createDetailWindow = sceneSkill.createDetailWindow;
  sceneSkill.createDetailWindow = function () {
    _createDetailWindow.call(this);
    this._toggleDetailButton = new Sprite_ToggleSkillDetailButton(this.toggleDetailWindowByButton.bind(this));
    this.addChild(this._toggleDetailButton);
  };

  sceneSkill.toggleDetailWindowByButton = function () {
    SoundManager.playCursor();
    this.toggleDetailWindow();
  };

  const _update = sceneSkill.update;
  sceneSkill.update = function () {
    _update.call(this);
    this.updateToggleDetailButton();
  };

  sceneSkill.updateToggleDetailButton = function () {
    this._toggleDetailButton.visible = this._detailWindow.visible || this._itemWindow.active;
    this._toggleDetailButton.setImage(!this._detailWindow.visible);
  };
}

Scene_Skill_SkillDetailButtonMixIn(Scene_Skill.prototype);

class Sprite_ToggleSkillDetailButton extends Sprite_ToggleButton {
  scaleXY() {
    return settings.scale / 100;
  }

  positionX() {
    return settings.x;
  }

  positionY() {
    return settings.y;
  }

  onImageName() {
    return settings.showButtonImage;
  }

  offImageName() {
    return settings.hideButtonImage;
  }
}
