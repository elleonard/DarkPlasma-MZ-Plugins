type Constructor<T = {}> = new (...args: any[]) => T;

export declare class Scene_BookLayoutMixInClass extends Scene_MenuBase {
  percentWindowRect(): Rectangle;
  percentWindowHeight(): number;
  indexWindowRect(): Rectangle;
  indexWindowWidth(): number;
  indexWindowHeight(): number;
  mainWindowRect(): Rectangle;
}

export declare function Scene_BookLayoutMixIn<TScene extends Constructor>(SceneClass: TScene): typeof Scene_BookLayoutMixInClass;
