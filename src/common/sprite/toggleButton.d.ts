export class Sprite_ToggleButton extends Sprite_Clickable {
  initialize(toggleHandler: () => void): void;
  scaleXY(): number;
  positionX(): number;
  positionY(): number;
  onImageName(): string;
  offImageName(): string;
  loadButtonImage(): void;
  onClick(): void;
  setImage(on: boolean): void;
}
