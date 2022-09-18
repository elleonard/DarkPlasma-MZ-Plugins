//=============================================================================
// rmmz_sprites.js v1.1.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * The sprite class with a feature which displays animations.
 */
declare class Sprite_Base extends Sprite {
  public constructor();

  public _animationSprites: Sprite_Animation[];
  public _effectTarget: Sprite_Base;
  public _hiding: boolean;

  public initialize(...args: any[]): void;

  public update(): void;
  public hide(): void;
  public show(): void;
  public updateVisibility(): void;
  public updateAnimationSprites(): void;

  public startAnimation(animation: MZ.Animation | null, mirror: boolean, delay: number): void;
  public isAnimationPlaying(): boolean;
}

declare class Sprite_Clickable extends Sprite {
  public _pressed: boolean;
  public _hovered: boolean;

  public initialize(...args: any[]): void;

  public update(): void;
  public processTouch(): void;
  public isPressed(): boolean;
  public isClickEnabled(): boolean;
  public isBeingTouched(): boolean;
  public hitTest(x: number, y: number): boolean;
  public onMouseEnter(): void;
  public onMouseExit(): void;
  public onPress(): void;
  public onClick(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a button.
 */
declare class Sprite_Button extends Sprite_Clickable {
  public constructor(buttonType: string);

  public _touching: boolean;
  public _coldFrame: Rectangle | null;
  public _hotFrame: Rectangle | null;
  public _clickHandler: () => void | null;

  public initialize(...args: any[]): void;

  public setupFrames(): void;
  public blockWidth(): number;
  public blockHeight(): number;
  public loadButtonImage(): void;
  public buttonData(): { x: number, w: number };

  public update(): void;
  public checkBitmap(): void;
  public updateFrame(): void;
  public updateOpacity(): void;

  public setColdFrame(x: number, y: number, width: number, height: number): void;
  public setHotFrame(x: number, y: number, width: number, height: number): void;
  public setClickHandler(method: () => void | null): void;
  public onClick(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a character.
 */
declare class Sprite_Character extends Sprite_Base {
  public constructor(character: Game_Character);

  public _character: Game_Character;
  public _balloonDuration: number;
  public _tilesetId: number;
  public _upperBody: Sprite | null;
  public _lowerBody: Sprite | null;
  public _tileId: number | undefined;
  public _characterName: string | undefined;
  public _characterIndex: number | undefined;
  public _isBigCharacter: boolean | undefined;
  public _bushDepth: number | undefined;
  public _balloonSprite: Sprite_Balloon | null | undefined;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public setCharacter(character: Game_Character): void;

  public update(): void;
  public updateVisibility(): void;

  public isTile(): boolean;
  public tilesetBitmap(tileId: number): Bitmap;
  public updateBitmap(): void;
  public isImageChanged(): boolean;
  public setTileBitmap(): void;
  public setCharacterBitmap(): void;

  public updateFrame(): void;
  public updateTileFrame(): void;
  public updateCharacterFrame(): void;
  public characterBlockX(): number;
  public characterBlockY(): number;
  public characterPatternX(): number;
  public characterPatternY(): number;
  public patternWidth(): number;
  public patternHeight(): number;

  public updateHalfBodySprites(): void;
  public createHalfBodySprites(): void;

  public updatePosition(): void;
  public updateAnimation(): void;
  public updateOther(): void;

  public setupAnimation(): void;
  public setupBalloon(): void;
  public startBalloon(): void;
  public updateBalloon(): void;
  public endBalloon(): void;
  public isBalloonPlaying(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Sprite_Actor and Sprite_Enemy.
 */
declare class Sprite_Battler extends Sprite_Base {
  public constructor(battler: Game_Battler | null);

  public _battler: Game_Battler | null;
  public _damages: Sprite_Damage[];
  public _homeX: number;
  public _homeY: number;
  public _offsetX: number;
  public _offsetY: number;
  public _targetOffsetX: number;
  public _targetOffsetY: number;
  public _movementDuration: number;
  public _selectionEffectCount: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public setBattler(battler: Game_Battler | null): void;
  public setHome(x: number, y: number): void;

  public update(): void;
  public updateVisibility(): void;
  public updateMain(): void;
  public updateBitmap(): void;
  public updateFrame(): void;
  public updateMove(): void;
  public updatePosition(): void;
  public updateAnimation(): void;
  public updateDamagePopup(): void;
  public updateSelectionEffect(): void;

  public setupAnimation(): void;
  public setupDamagePopup(): void;
  public createDamageSprite(): void;
  public destroyDamageSprite(sprite: Sprite_Damage): void;
  public damageOffsetX(): number;
  public damageOffsetY(): number;

  public startMove(x: number, y: number, duration: number): void;
  public onMoveEnd(): void;

  public isEffecting(): boolean;
  public isMoving(): boolean;
  public inHomePosition(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying an actor.
 */
declare class Sprite_Actor extends Sprite_Battler {
  public constructor(battler: Game_Actor | null);

  public static readonly MOTIONS: { [type: string]: { readonly index: number; readonly loop: boolean } };

  public _actor: Game_Actor | null;
  public _battlerName: string;
  public _motion: { readonly index: number; readonly loop: boolean } | null;
  public _motionCount: number;
  public _pattern: number;
  public _mainSprite: Sprite_Base;
  public _shadowSprite: Sprite;
  public _weaponSprite: Sprite_Weapon;
  public _stateSprite: Sprite_StateOverlay;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public createMainSprite(): void;
  public createShadowSprite(): void;
  public createWeaponSprite(): void;
  public createStateSprite(): void;

  public setBattler(battler: Game_Actor | null): void;
  public moveToStartPosition(): void;
  public setActorHome(index: number): void;

  public update(): void;
  public updateShadow(): void;
  public updateMain(): void;

  public setupMotion(): void;
  public setupWeaponAnimation(): void;
  public startMotion(motionType: string): void;

  public updateTargetPosition(): void;
  public updateBitmap(): void;
  public updateFrame(): void;
  public updateMove(): void;
  public updateMotion(): void;
  public updateMotionCount(): void;

  public motionSpeed(): number;
  public refreshMotion(): void;
  public startEntryMotion(): void;
  public stepForward(): void;
  public stepBack(): void;
  public retreat(): void;
  public onMoveEnd(): void;

  public damageOffsetX(): number;
  public damageOffsetY(): number;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying an enemy.
 */
declare class Sprite_Enemy extends Sprite_Battler {
  public constructor(battler: Game_Enemy | null);

  public _enemy: Game_Enemy | null;
  public _appeared: boolean;
  public _battlerName: string;
  public _battlerHue: number;
  public _effectType: string | null;
  public _effectDuration: number;
  public _shake: number;
  public _stateIconSprite: Sprite_StateIcon;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public createStateIconSprite(): void;

  public setBattler(battler: Game_Enemy | null): void;

  public update(): void;
  public updateBitmap(): void;
  public loadBitmap(name: string, hue: number): void;
  public updateFrame(): void;
  public updatePosition(): void;
  public updateStateSprite(): void;

  public initVisibility(): void;
  public setupEffect(): void;
  public startEffect(effectType: string): void;
  public startAppear(): void;
  public startDisappear(): void;
  public startWhiten(): void;
  public startBlink(): void;
  public startCollapse(): void;
  public startBossCollapse(): void;
  public startInstantCollapse(): void;

  public updateEffect(): void;
  public isEffecting(): boolean;
  public revertToNormal(): void;
  public updateWhiten(): void;
  public updateBlink(): void;
  public updateAppear(): void;
  public updateDisappear(): void;
  public updateCollapse(): void;
  public updateBossCollapse(): void;
  public updateInstantCollapse(): void;

  public damageOffsetX(): number;
  public damageOffsetY(): number;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying an animation.
 */
declare class Sprite_Animation extends Sprite {
  public constructor();

  public _targets: Sprite[];
  public _animation: MZ.Animation | null;
  public _mirror: boolean;
  public _delay: number;
  public _previous: Sprite_Animation | Sprite_AnimationMV;
  public _effect: EffekseerEffect | null;
  public _handle: EffekseerHandle | null;
  public _playing: boolean;
  public _started: boolean;
  public _frameIndex: number;
  public _maxTimingFrames: number;
  public _flashColor: number[];
  public _flashDuration: number;
  public _viewportSize: number;
  public _originalViewport: Int32Array | null;

  public z: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public setup(
    targets: Sprite[],
    animation: MZ.Animation | null,
    mirror: boolean,
    delay: number,
    previous: Sprite_Animation | Sprite_AnimationMV
  ): void;

  public update(): void;

  public canStart(): boolean;
  public shouldWaitForPrevious(): boolean;

  public updateEffectGeometry(): void;
  public updateMain(): void;
  public processSoundTimings(): void;
  public processFlashTimings(): void;
  public checkEnd(): void;

  public updateFlash(): void;

  public isPlaying(): boolean;
  public setRotation(x: number, y: number, z: number): void;

  public _render(renderer: any): void;

  public setProjectionMatrix(renderer: any): void;
  public setCameraMatrix(): void;
  public setViewport(renderer: any): void;

  public targetPosition(renderer: any): Point;
  public targetSpritePosition(sprite: Sprite): Point;

  public saveViewport(renderer: any): void;
  public resetViewport(renderer: any): void;
  public onBeforeRender(renderer: any): void;
  public onAfterRender(renderer: any): void;
}

declare class Sprite_AnimationMV extends Sprite {
  public constructor();

  public _targets: Sprite[];
  public _animation: MZ.AnimationMV;
  public _mirror: boolean;
  public _delay: number;
  public _rate: number;
  public _duration: number;
  public _flashColor: number[];
  public _flashDuration: number;
  public _screenFlashDuration: number;
  public _hidingDuration: number;
  public _hue1: number;
  public _hue2: number;
  public _bitmap1: Bitmap | null;
  public _bitmap2: Bitmap | null;
  public _cellSprites: Sprite[];
  public _screenFlashSprite: ScreenSprite;
  public z: number;

  public initialize(...args: any[]): void;
  public setup(targets: Sprite[], animation: MZ.AnimationMV, mirror: boolean, delay: number): void;
  public setupRate(): void;
  public setupDuration(): void;
  public update(): void;
  public updateFlash(): void;
  public updateScreenFlash(): void;
  public absoluteX(): number;
  public absoluteY(): number;
  public updateHiding(): void;
  public isPlaying(): boolean;
  public loadBitmaps(): void;
  public isReady(): boolean;

  public createCellSprites(): void;
  public createScreenFlashSprite(): void;

  public updateMain(): void;
  public updatePosition(): void;
  public updateFrame(): void;
  public currentFrameIndex(): void;
  public updateAllCellSprites(frame: any[]): void;
  public updateCellSprite(sprite: Sprite, cell: any[]): void;
  public processTimingData(timing: MZ.AnimationMV.Timing): void;
  public startFlash(color: number[], duration: number): void;
  public startScreenFlash(color: number[], duration: number): void;
  public startHiding(duration: number): void;
  public onEnd(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a background image in battle.
 */
declare class Sprite_Battleback extends TilingSprite {
  public constructor();

  public initialize(type: number): void;
  public adjustPosition(): void;
  public battleback1Bitmap(): Bitmap;
  public battleback2Bitmap(): Bitmap;
  public battleback1Name(): string;
  public battleback2Name(): string;
  public overworldBattleback1Name(): string;
  public overworldBattleback2Name(): string;
  public normalBattleback1Name(): string;
  public normalBattleback2Name(): string;
  public terrainBattleback1Name(type: number): string;
  public terrainBattleback2Name(type: number): string;
  public defaultBattleback1Name(): string;
  public defaultBattleback2Name(): string;
  public shipBattleback1Name(): string;
  public shipBattleback2Name(): string;
  public autotileType(z: number): number;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a popup damage.
 */
declare class Sprite_Damage extends Sprite {
  public constructor();

  public _duration: number;
  public _flashColor: number[];
  public _flashDuration: number;
  public _damageBitmap: Bitmap;

  public initialize(...args: any[]): void;

  public setup(target: Game_Battler): void;
  public setupCriticalEffect(): void;
  public digitWidth(): number;
  public digitHeight(): number;
  public createMiss(): void;
  public createDigits(baseRow: number, value: number): void;
  public createChildSprite(): Sprite;

  public update(): void;
  public updateChild(sprite: Sprite): void;
  public updateFlash(): void;
  public updateOpacity(): void;

  public isPlaying(): boolean;
}

declare class Sprite_Gauge extends Sprite {
  _battler: Game_Battler|null;
  _statusType: string;
  _value: number;
  _maxValue: number;
  _targetValue: number;
  _targetMaxValue: number;
  _duration: number;
  _flashingCount: number;

  public constructor();

  public initialize(): void;
  public initMembers(): void;
  public destroy(): void;

  public createBitmap(): void;
  public bitmapWidth(): number;
  public bitmapHeight(): number;
  public textHeight(): number;
  public gaugeHeight(): number;
  public gaugeX(): number;
  public labelY(): number;
  public labelFontFace(): string;
  public labelFontSize(): number;
  public valueFontFace(): string;
  public valueFontSize(): number;

  public setup(battler: Game_Battler, statusType: string): void;
  public update(): void;
  public updateBitmap(): void;
  public updateTargetValue(value: number, maxValue: number): void;
  public smoothness(): number;
  public updateGaugeAnimation(): void;
  public updateFlashing(): void;
  public flashingColor1(): number[];
  public flashingColor2(): number[];

  public isValid(): boolean;
  public currentValue(): number;
  public currentMaxValue(): number;
  public label(): string;

  public gaugeBackColor(): string;
  public gaugeColor1(): string;
  public gaugeColor2(): string;
  public labelColor(): string;
  public labelOutlineColor(): string;
  public labelOutlineWidth(): number;
  public valueColor(): string;
  public valueOutlineColor(): string;
  public valueOutlineWidth(): number;

  public redraw(): void;
  public drawGauge(): void;
  public drawGaugeRect(x: number, y: number, width: number, height: number): void;
  public gaugeRate(): number;
  public drawLabel(): void;
  public setupLabelFont(): void;
  public measureLabelWidth(): number;
  public labelOpacity(): number;
  public drawValue(): void;
  public setupValueFont(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying state icons.
 */
declare class Sprite_StateIcon extends Sprite {
  public constructor();

  public static _iconWidth: number;
  public static _iconHeight: number;

  public _battler: Game_Battler | null;
  public _iconIndex: number;
  public _animationCount: number;
  public _animationIndex: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public loadBitmap(): void;
  public setup(battler: Game_Battler | null): void;

  public update(): void;
  public animationWait(): number;
  public updateIcon(): void;
  public updateFrame(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying an overlay image for a state.
 */
declare class Sprite_StateOverlay extends Sprite_Base {
  public constructor();

  public _battler: Game_Battler | null;
  public _overlayIndex: number;
  public _animationCount: number;
  public _pattern: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public loadBitmap(): void;
  public setup(battler: Game_Battler | null): void;

  public update(): void;
  public animationWait(): number;
  public updatePattern(): void;
  public updateFrame(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a weapon image for attacking.
 */
declare class Sprite_Weapon extends Sprite_Base {
  public constructor();

  public _weaponImageId: number;
  public _animationCount: number;
  public _pattern: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public setup(weaponImageId: number): void;

  public update(): void;
  public animationWait(): number;
  public updatePattern(): void;
  public loadBitmap(): void;
  public updateFrame(): void;

  public isPlaying(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a balloon icon.
 */
declare class Sprite_Balloon extends Sprite_Base {
  public constructor();

  public _balloonId: number;
  public _duration: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public loadBitmap(): void;
  public setup(balloonId: number): void;

  public update(): void;
  public updateFrame(): void;

  public speed(): number;
  public waitTime(): number;
  public frameIndex(): number;
  public isPlaying(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a picture.
 */
declare class Sprite_Picture extends Sprite {
  public constructor(pictureId: number);

  public _pictureId: number;
  public _pictureName: string;

  public initialize(...args: any[]): void;

  public picture(): Game_Picture;

  public update(): void;
  public updateBitmap(): void;
  public updateOrigin(): void;
  public updatePosition(): void;
  public updateScale(): void;
  public updateTone(): void;
  public updateOther(): void;

  public loadBitmap(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying the timer.
 */
declare class Sprite_Timer extends Sprite {
  public constructor();

  public _seconds: number;

  public initialize(...args: any[]): void;
  public createBitmap(): void;

  public update(): void;
  public updateBitmap(): void;
  public redraw(): void;
  public timerText(): string;
  public updatePosition(): void;
  public updateVisibility(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying the destination place of the touch input.
 */
declare class Sprite_Destination extends Sprite {
  public constructor();

  public _frameCount: number;

  public initialize(...args: any[]): void;
  public update(): void;
  public createBitmap(): void;
  public updatePosition(): void;
  public updateAnimation(): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Spriteset_Map and Spriteset_Battle.
 */
declare class Spriteset_Base extends Sprite {
  public constructor();

  public _tone: number[];
  public _baseSprite: Sprite;
  public _blackScreen: ScreenSprite;
  public _pictureContainer: Sprite;
  public _timerSprite: Sprite_Timer;
  public _flashSprite: ScreenSprite;
  public _fadeSprite: ScreenSprite;

  public initialize(...args: any[]): void;

  public createLowerLayer(): void;
  public createUpperLayer(): void;

  public update(): void;

  public createBaseSprite(): void;
  public createToneChanger(): void;
  public createWebGLToneChanger(): void;
  public createCanvasToneChanger(): void;
  public createPictures(): void;
  public createTimer(): void;
  public createScreenSprites(): void;

  public updateScreenSprites(): void;
  public updateToneChanger(): void;
  public updateWebGLToneChanger(): void;
  public updateCanvasToneChanger(): void;
  public updatePosition(): void;
}

//-----------------------------------------------------------------------------
/**
 * The set of sprites on the map screen.
 */
declare class Spriteset_Map extends Spriteset_Base {
  public constructor();

  public _parallax: TilingSprite;
  public _tilemap: Tilemap;
  public _tileset: MZ.Tileset;
  public _characterSprites: Sprite_Character[];
  public _shadowSprite: Sprite;
  public _destinationSprite: Sprite_Destination;
  public _weather: Weather;
  public _parallaxName: string | undefined;

  public initialize(...args: any[]): void;
  public createLowerLayer(): void;

  public update(): void;

  public hideCharacters(): void;

  public createParallax(): void;
  public createTilemap(): void;
  public loadTileset(): void;
  public createCharacters(): void;
  public createShadow(): void;
  public createDestination(): void;
  public createWeather(): void;

  public updateTileset(): void;
  public _canvasReAddParallax(): void;
  public updateParallax(): void;
  public updateTilemap(): void;
  public updateShadow(): void;
  public updateWeather(): void;
}

//-----------------------------------------------------------------------------
/**
 * The set of sprites on the battle screen.
 */
declare class Spriteset_Battle extends Spriteset_Base {
  public constructor();

  public _battlebackLocated: boolean;
  public _backgroundSprite: Sprite;
  public _battleField: Sprite;
  public _back1Sprite: TilingSprite;
  public _back2Sprite: TilingSprite;
  public _enemySprites: Sprite_Enemy[];
  public _actorSprites: Sprite_Actor[];

  public initialize(...args: any[]): void;

  public createLowerLayer(): void;
  public createBackground(): void;

  public update(): void;

  public createBattleField(): void;
  public createBattleback(): void;

  public updateBattleback(): void;
  public locateBattleback(): void;
  public battleback1Bitmap(): Bitmap;
  public battleback2Bitmap(): Bitmap;
  public battleback1Name(): string;
  public battleback2Name(): string;
  public overworldBattleback1Name(): string;
  public overworldBattleback2Name(): string;
  public normalBattleback1Name(): string;
  public normalBattleback2Name(): string;
  public terrainBattleback1Name(type: number): string | null;
  public terrainBattleback2Name(type: number): string | undefined;
  public defaultBattleback1Name(): string;
  public defaultBattleback2Name(): string;
  public shipBattleback1Name(): string;
  public shipBattleback2Name(): string;

  public autotileType(z: number): number;

  public createEnemies(): void;
  public compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number;
  public createActors(): void;
  public updateActors(): void;
  public battlerSprites(): Sprite_Battler[];

  public isAnimationPlaying(): boolean;
  public isEffecting(): boolean;
  public isAnyoneMoving(): boolean;
  public isBusy(): boolean;
}
