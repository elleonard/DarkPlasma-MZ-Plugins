import { settings } from './_build/DarkPlasma_DisplayHpMpDamage_parameters';

const _Sprite_Battler_createDamageSprite = Sprite_Battler.prototype.createDamageSprite;
Sprite_Battler.prototype.createDamageSprite = function () {
  _Sprite_Battler_createDamageSprite.call(this);
  const result = this._battler.result();
  if (this._battler.isAlive() && result.hpAffected && result.mpDamage !== 0) {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    /**
     * HPダメージに関するスプライトがすでに追加されているため、lastは必ず存在する
     */
    sprite.x = last.x + settings.offsetX;
    sprite.y = last.y + settings.offsetY;
    sprite.setupMpChangeWithHp(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
  }
};

const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function () {
  _Sprite_Damage_initialize.call(this);
  this._delay = 0;
};

Sprite_Damage.prototype.setupMpChangeWithHp = function (target) {
  const result = target.result();
  this._colorType = result.mpDamage >= 0 ? 2 : 3;
  this._delay = settings.delay;
  this.createDigits(result.mpDamage);
};

const _Sprite_Damage_update = Sprite_Damage.prototype.update;
Sprite_Damage.prototype.update = function () {
  if (this._delay > 0) {
    this._delay--;
    return;
  }
  _Sprite_Damage_update.call(this);
};
