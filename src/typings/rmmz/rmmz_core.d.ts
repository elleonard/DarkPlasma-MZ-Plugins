//=============================================================================
// rmmz_core.js v1.6.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 */
declare class JsExtensions {
  /**
   * @class JsExtensions
   */
  private constructor();
}

declare interface Number {
  /**
   * Returns a number whose value is limited to the given range.
   *
   * @method Number.prototype.clamp
   * @param {Number} min The lower boundary
   * @param {Number} max The upper boundary
   * @return {Number} A number in the range (min, max)
   */
  clamp(min: number, max: number): number;

  /**
   * Returns a modulo value which is always positive.
   *
   * @method Number.prototype.mod
   * @param {Number} n The divisor
   * @return {Number} A modulo value
   */
  mod(n: number): number;

  /**
   * Makes a number string with leading zeros.
   *
   * @method Number.prototype.padZero
   * @param {Number} length The length of the output string
   * @return {String} A string with leading zeros
   */
  padZero(length: number): string;
}

declare interface String {
  /**
   * Replaces %1, %2 and so on in the string to the arguments.
   *
   * @method String.prototype.format
   * @param {Any} ...args The objects to format
   * @return {String} A formatted string
   */
  format(...args: any[]): string;

  /**
   * Makes a number string with leading zeros.
   *
   * @method String.prototype.padZero
   * @param {Number} length The length of the output string
   * @return {String} A string with leading zeros
   */
  padZero(length: number): string;

  /**
   * Checks whether the string contains a given string.
   *
   * @method String.prototype.contains
   * @param {String} string The string to search for
   * @return {Boolean} True if the string contains a given string
   */
  contains(string: string): boolean;
}

declare interface Array<T> {
  /**
   * Checks whether the two arrays are same.
   *
   * @method Array.prototype.equals
   * @param {Array} array The array to compare to
   * @return {Boolean} True if the two arrays are same
   */
  equals(array: Array<T>): boolean;

  /**
   * Makes a shallow copy of the array.
   *
   * @method Array.prototype.clone
   * @return {Array} A shallow copy of the array
   */
  clone(): Array<T>;

  /**
   * Checks whether the array contains a given element.
   *
   * @method Array.prototype.contains
   * @param {Any} element The element to search for
   * @return {Boolean} True if the array contains a given element
   */
  contains(element: T): boolean;

  /**
   * Removes a given element from the array (in place).
   *
   * @method Array.prototype.remove
   * @param {Any} element The element to remove
   * @return {Array} The array after remove
   */
  remove(element: T): boolean;
}

declare interface Math {
  /**
   * Generates a random integer in the range (0, max-1).
   *
   * @static
   * @method Math.randomInt
   * @param {Number} max The upper boundary (excluded)
   * @return {Number} A random integer
   */
  randomInt(max: number): number;
}

//-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 */
declare class Utils {
  /**
   * @class Utils
   */
  private constructor();

  /**
   * The name of the RPG Maker.
   *
   * @static
   * @property RPGMAKER_NAME
   * @type String
   * @final
   */
  public static readonly RPGMAKER_NAME: string;

  /**
   * The version of the RPG Maker.
   *
   * @static
   * @property RPGMAKER_VERSION
   * @type String
   * @final
   */
  public static readonly RPGMAKER_VERSION: string;

  /**
   * Checks whether the current RPG Maker version is greater than or equal to the given version.
   *
   * @param {String} version - The "x.x.x" format string to compare.
   * @return {Boolean} True if the current version is greather than or equal to the given version.
   */
  public static checkRMVersion(version: string): boolean;

  /**
   * Checks whether the option is in the query string.
   *
   * @static
   * @method isOptionValid
   * @param {String} name The option name
   * @return {Boolean} True if the option is in the query string
   */
  public static isOptionValid(name: string): boolean;

  /**
   * Checks whether the platform is NW.js.
   *
   * @static
   * @method isNwjs
   * @return {Boolean} True if the platform is NW.js
   */
  public static isNwjs(): boolean;

  /**
   * Checks whether the platform is a mobile device.
   *
   * @static
   * @method isMobileDevice
   * @return {Boolean} True if the platform is a mobile device
   */
  public static isMobileDevice(): boolean;

  /**
   * Checks whether the browser is Mobile Safari.
   *
   * @static
   * @method isMobileSafari
   * @return {Boolean} True if the browser is Mobile Safari
   */
  public static isMobileSafari(): boolean;

  /**
   * Checks whether the browser is Android Chrome.
   *
   * @static
   * @method isAndroidChrome
   * @return {Boolean} True if the browser is Android Chrome
   */
  public static isAndroidChrome(): boolean;

  /**
   * Checks whether the browser is accessing local files.
   */
  public static isLocal(): boolean;

  /**
   * Checks whether the browser supports WebGL.
   *
   * @return {Boolean} True if the browser supports WebGL.
   */
  public static canUseWebGL(): boolean;

  /**
   * Checks whether the browser supports Web Audio API.
   *
   * @return {Boolean} True if the browser supports Web Audio API.
   */
  public static canUseWebAudioAPI(): boolean;

  /**
   * Checks whether the browser supports CSS Font Loading.
   *
   * @return {Boolean} True if the browser supports CSS Font Loading.
   */
  public static canUseCssFontLoading(): boolean;

  /**
   * Checks whether the browser supports IndexedDB.
   *
   * @return {Boolean} True if the browser supports IndexedDB.
   */
  public static canUseIndexedDB(): boolean;

  /**
   * Checks whether the browser can play ogg files.
   *
   * @return {Boolean} True if the browser can play ogg files.
   */
  public static canPlayOgg(): boolean;

  /**
   * Checks whether the browser can play webm files.
   *
   * @return {Boolean} True if the browser can play webm files.
   */
  public static canPlayWebm(): boolean;

  /**
   * Encode a URI component without escaping slash characters.
   *
   * @param {String} str The input string.
   * @return {String} Encoded string.
   */
  public static encodeURI(str: string): string;

  /**
   * Gets the filename that does not include subfolders.
   *
   * @param {string} filename - The filename with subfolders.
   * @return {string} The filename without subfolders.
   */
  public static extractFileName(filename: string): string;

  /**
   * Escape special characters for HTML.
   *
   * @param {String} str The input string.
   * @return {String} Escaped string.
   */
  public static escapeHtml(str: string): string;

  /**
   * Checks whether the string contains any Arabic characters.
   *
   * @param {String} str The input string.
   * @return {Boolean} True if the string contains Arabic characters.
   */
  public static containArabic(str: string): boolean;

  /**
   * Sets information related to encryption.
   *
   * @param {Boolean} hasImages Whether the image files are encrypted.
   * @param {Boolean} hasAudio Whether the audio files are encrypted.
   * @param {String} key The encryption key.
   */
  public static setEncryptionInfo(hasImages: boolean, hasAudio: boolean, key: string): void;

  /**
   * Checks whether the image files in the game are encrypted.
   *
   * @return {Boolean} True if the image files are encrypted.
   */
  public static hasEncryptedImages(): boolean;

  /**
   * Checks whether the audio files in the game are encrypted.
   *
   * @return {Boolean} True if the audio files are encrypted.
   */
  public static hasEncryptedAudio(): boolean;

  /**
   * Decrypts encrypted data.
   *
   * @param {ArrayBuffer} source The data to decrypted.
   * @return {ArrayBuffer} The decrypted data.
   */
  public static decryptArrayBuffer(source: ArrayBuffer): ArrayBuffer;
}

//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 */
declare class Graphics {
  /**
   * @class Graphics
   */
  private constructor();

  /**
   * Initializes the graphics system.
   *
   * @static
   * @method initialize
   * @return {Boolean} True if the graphics system is available.
   */
  public static initialize(): boolean;

  public static app: PIXI.Application;
  public static effekseer: EffekseerContext;

  public static _width: number;
  public static _height: number;

  public static _defaultScale: number;
  public static _realScale: number;

  public static _errorPrinter: HTMLParagraphElement | null;
  public static _tickHandler: Function | null;
  public static _canvas: HTMLCanvasElement | null;
  public static _fpsCounter: Graphics.FPSCounter | null;
  public static _loadingSpinner: HTMLDivElement | null;
  public static _stretchEnabled: boolean;

  public static _app: PIXI.Application | null;
  public static _effekseer: effekseer.EffekseerContext | null;
  public static _wasLoading: boolean;

  /**
   * The total frame count of the game screen.
   *
   * @static
   * @property frameCount
   * @type Number
   */
  public static frameCount: number;

  /**
   * Register a handler for tick events.
   *
   * @param {Function} handler The listener function to be added for updates.
   */
  public static setTickHandler(handler: Function): void;

  /**
   * Starts the game loop.
   */
  public static startGameLoop(): void;

  /**
   * Stops the game loop.
   */
  public static stopGameLoop(): void;

  /**
   * Sets the stage to be rendered.
   *
   * @param {Stage} stage The stage object to be rendered.
   */
  public static setStage(stage: Stage): void;

  /**
   * Shows the loading spinner.
   *
   * @static
   * @method startLoading
   */
  public static startLoading(): void;

  /**
   * Erases the loading spinner.
   *
   * @static
   * @method endLoading
   * @return {Boolean} True if the loading spinner was active.
   */
  public static endLoading(): boolean;

  /**
   * Displays the error text to the screen.
   *
   * @static
   * @method printError
   * @param {String} name The name of the error
   * @param {String} message The message of the error
   * @param {Error} error The error object
   */
  public static printError(name: string, message: string, error?: Error): void;

  /**
   * Displays a button to try to reload resources.
   *
   * @param {Function} retry The callback function to be called when the button is pressed.
   */
  public static showRetryButtln(retry: Function): void;

  /**
   * Erases the loading error text.
   */
  public static eraseError(): void;

  /**
   * Converts an x coordinate on the page to the corresponding
   * x coordinate on the canvas area.
   *
   * @static
   * @method pageToCanvasX
   * @param {Number} x The x coordinate on the page to be converted
   * @return {Number} The x coordinate on the canvas area
   */
  public static pageToCanvasX(x: number): number;

  /**
   * Converts a y coordinate on the page to the corresponding
   * y coordinate on the canvas area.
   *
   * @static
   * @method pageToCanvasY
   * @param {Number} y The y coordinate on the page to be converted
   * @return {Number} The y coordinate on the canvas area
   */
  public static pageToCanvasY(y: number): number;

  /**
   * Checks whether the specified point is inside the game canvas area.
   *
   * @static
   * @method isInsideCanvas
   * @param {Number} x The x coordinate on the canvas area
   * @param {Number} y The y coordinate on the canvas area
   * @return {Boolean} True if the specified point is inside the game canvas area
   */
  public static isInsideCanvas(x: number, y: number): boolean;

  /**
   * Shows the game screen.
   */
  public static showScreen(): void;

  /**
   * Hides the game screen.
   */
  public static hideScreen(): void;

  /**
   * Changes the size of the game screen.
   *
   * @param {Number} width The width of the game screen.
   * @param {Number} height The height of the game screen.
   */
  public static resize(width: number, height: number): void;

  /**
   * The width of the game screen.
   *
   * @static
   * @property width
   * @type Number
   */
  public static width: number;

  /**
   * The height of the game screen.
   *
   * @static
   * @property height
   * @type Number
   */
  public static height: number;

  /**
   * The width of the window display area.
   *
   * @static
   * @property boxWidth
   * @type Number
   */
  public static boxWidth: number;

  /**
   * The height of the window display area.
   *
   * @static
   * @property boxHeight
   * @type Number
   */
  public static boxHeight: number;

  /**
   * The zoom scale of the game screen.
   *
   * @static
   * @property defaultScale
   * @type Number
   */
  public static defaultScale: number;

  public static _createAllElements(): void;
  public static _updateAllElements(): void;
  public static _onTick(deltaTIme: any): void;
  public static _canRender(): boolean;
  public static _updateRealScale(): void;
  public static _strechWidth(): number;
  public static _strechHeight(): number;
  public static _makeErrorHtml(name: string, message: string): string;
  public static _defaultStretchMode(): boolean;
  public static _createErrorPrinter(): void;
  public static _updateErrorPrinter(): void;
  public static _createCanvas(): void;
  public static _updateCanvas(): void;
  public static _updateVideo(): void;
  public static _createLoadingSpinner(): void;
  public static _createFPSCounter(): void;
  public static _centerElement(element: HTMLElement): void;
  public static _disableContextMenu(): void;
  public static _applyCanvasFilter(): void;
  public static _clearCanvasFilter(): void;
  public static _setupEventHandlers(): void;
  public static _onWindowResize(): void;
  public static _onKeyDown(event: KeyboardEvent): void;
  public static _switchFPSCounter(): void;
  public static _switchStretchMode(): void;
  public static _switchFullScreen(): void;
  public static _isFullScreen(): boolean;
  public static _requestFullScreen(): void;
  public static _cancelFullScreen(): void;
  public static _createPixiApp(): void;
  public static _setupPixi(): void;
  public static _createEffekseerContext(): void;
}

declare namespace Graphics {
  class FPSCounter {
    initialize(): void;
    startTick(): void;
    endTick(): void;
    switchMode(): void;
    _createElements(): void;
    _update(): void;
  }
}

//-----------------------------------------------------------------------------
/**
 * The point class.
 */
declare class Point extends PIXI.Point {
  /**
   * @class Point
   * @constructor
   * @param {Number} x The x coordinate
   * @param {Number} y The y coordinate
   */
  public constructor(x: number, y: number);
}

//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 */
declare class Rectangle extends PIXI.Rectangle {
  /**
   * @class Rectangle
   * @constructor
   * @param {Number} x The x coordinate for the upper-left corner
   * @param {Number} y The y coordinate for the upper-left corner
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   */
  public constructor(x: number, y: number, width: number, height: number);
}

//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 */
declare class Bitmap {
  /**
   * @class Bitmap
   * @constructor
   * @param {Number} width The width of the bitmap
   * @param {Number} height The height of the bitmap
   */
  public constructor(width?: number, height?: number);

  public _canvas: HTMLCanvasElement;
  public _context: CanvasRenderingContext2D;
  public _baseTexture: PIXI.BaseTexture;
  public _image: HTMLImageElement | null;
  public _url: string;
  public _paintOpacity: number;
  public _smooth: boolean;
  public _loadListeners: Array<BitmapLoadListener>;
  public _loadingState: string;

  /**
   * The face name of the font.
   *
   * @property fontFace
   * @type String
   */
  public fontFace: string;

  /**
   * The size of the font in pixels.
   *
   * @property fontSize
   * @type Number
   */
  public fontSize: number;

  /**
   * Whether the font is bold.
   *
   * @property fontBold
   * @type Boolean
   */
  public fontBold: boolean;

  /**
   * Whether the font is italic.
   *
   * @property fontItalic
   * @type Boolean
   */
  public fontItalic: boolean;

  /**
   * The color of the text in CSS format.
   *
   * @property textColor
   * @type String
   */
  public textColor: string;

  /**
   * The color of the outline of the text in CSS format.
   *
   * @property outlineColor
   * @type String
   */
  public outlineColor: string;

  /**
   * The width of the outline of the text.
   *
   * @property outlineWidth
   * @type Number
   */
  public outlineWidth: number;

  /**
   * Loads a image file and returns a new bitmap object.
   *
   * @static
   * @method load
   * @param {String} url The image url of the texture
   * @return Bitmap
   */
  public static load(url: string): Bitmap;

  /**
   * Takes a snapshot of the game screen and returns a new bitmap object.
   *
   * @static
   * @method snap
   * @param {Stage} stage The stage object
   * @return Bitmap
   */
  public static snap(stage: Stage): Bitmap;

  /**
   * Checks whether the bitmap is ready to render.
   *
   * @method isReady
   * @return {Boolean} True if the bitmap is ready to render
   */
  public isReady(): boolean;

  /**
   * Checks whether a loading error has occurred.
   *
   * @method isError
   * @return {Boolean} True if a loading error has occurred
   */
  public isError(): boolean;

  /**
   * [read-only] The url of the image file.
   *
   * @property url
   * @type String
   */
  public readonly url: string;

  /**
   * [read-only] The base texture that holds the image.
   *
   * @property baseTexture
   * @type PIXI.BaseTexture
   */
  public readonly baseTexture: PIXI.BaseTexture;

  /**
   * [read-only] The bitmap image.
   *
   * @property image
   * @type HTMLImageElement
   */
  public readonly image: HTMLImageElement;

  /**
   * [read-only] The bitmap canvas.
   *
   * @property canvas
   * @type HTMLCanvasElement
   */
  public readonly canvas: HTMLCanvasElement;

  /**
   * [read-only] The 2d context of the bitmap canvas.
   *
   * @property context
   * @type CanvasRenderingContext2D
   */
  public readonly context: CanvasRenderingContext2D;

  /**
   * [read-only] The width of the bitmap.
   *
   * @property width
   * @type Number
   */
  public readonly width: number;

  /**
   * [read-only] The height of the bitmap.
   *
   * @property height
   * @type Number
   */
  public readonly height: number;

  /**
   * [read-only] The rectangle of the bitmap.
   *
   * @property rect
   * @type Rectangle
   */
  public readonly rect: Rectangle;

  /**
   * Whether the smooth scaling is applied.
   *
   * @property smooth
   * @type Boolean
   */
  public smooth: boolean;

  /**
   * The opacity of the drawing object in the range (0, 255).
   *
   * @property paintOpacity
   * @type Number
   */
  public paintOpacity: number;

  /**
   * Destroys the bitmap.
   */
  public destroy(): void;

  /**
   * Resizes the bitmap.
   *
   * @method resize
   * @param {Number} width The new width of the bitmap
   * @param {Number} height The new height of the bitmap
   */
  public resize(width?: number, height?: number): void;

  /**
   * Performs a block transfer.
   *
   * @method blt
   * @param {Bitmap} source The bitmap to draw
   * @param {Number} sx The x coordinate in the source
   * @param {Number} sy The y coordinate in the source
   * @param {Number} sw The width of the source image
   * @param {Number} sh The height of the source image
   * @param {Number} dx The x coordinate in the destination
   * @param {Number} dy The y coordinate in the destination
   * @param {Number} [dw=sw] The width to draw the image in the destination
   * @param {Number} [dh=sh] The height to draw the image in the destination
   */
  public blt(
    source: Bitmap,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number
  ): void;

  /**
   * Returns pixel color at the specified point.
   *
   * @method getPixel
   * @param {Number} x The x coordinate of the pixel in the bitmap
   * @param {Number} y The y coordinate of the pixel in the bitmap
   * @return {String} The pixel color (hex format)
   */
  public getPixel(x: number, y: number): string;

  /**
   * Returns alpha pixel value at the specified point.
   *
   * @method getAlphaPixel
   * @param {Number} x The x coordinate of the pixel in the bitmap
   * @param {Number} y The y coordinate of the pixel in the bitmap
   * @return {String} The alpha value
   */
  public getAlphaPixel(x: number, y: number): number;

  /**
   * Clears the specified rectangle.
   *
   * @method clearRect
   * @param {Number} x The x coordinate for the upper-left corner
   * @param {Number} y The y coordinate for the upper-left corner
   * @param {Number} width The width of the rectangle to clear
   * @param {Number} height The height of the rectangle to clear
   */
  public clearRect(x: number, y: number, width: number, height: number): void;

  /**
   * Clears the entire bitmap.
   *
   * @method clear
   */
  public clear(): void;

  /**
   * Fills the specified rectangle.
   *
   * @method fillRect
   * @param {Number} x The x coordinate for the upper-left corner
   * @param {Number} y The y coordinate for the upper-left corner
   * @param {Number} width The width of the rectangle to clear
   * @param {Number} height The height of the rectangle to clear
   * @param {String} color The color of the rectangle in CSS format
   */
  public fillRect(x: number, y: number, width: number, height: number, color: string): void;

  /**
   * Fills the entire bitmap.
   *
   * @method fillAll
   * @param {String} color The color of the rectangle in CSS format
   */
  public fillAll(color: string): void;

  /**
   * Draws the specified rectangular frame.
   *
   * @param {Number} x The x coordinate for the upper-left corner.
   * @param {Number} y The y coordinate for the uppler-left corner.
   * @param {Number} width The width of the rectangle to fill.
   * @param {Number} height The height of the rectangle to fill.
   * @param {String} color The color of the rectangle in CSS format.
   */
  public strokeRect(x: number, y: number, width: number, height: number, color: string): void;

  /**
   * Draws the rectangle with a gradation.
   *
   * @method gradientFillRect
   * @param {Number} x The x coordinate for the upper-left corner
   * @param {Number} y The y coordinate for the upper-left corner
   * @param {Number} width The width of the rectangle to clear
   * @param {Number} height The height of the rectangle to clear
   * @param {String} color1 The start color of the gradation
   * @param {String} color2 The end color of the gradation
   * @param {Boolean} vertical Whether it draws a vertical gradient
   */
  public gradientFillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color1: string,
    color2: string,
    vertical?: boolean
  ): void;

  /**
   * Draw the filled circle.
   *
   * @method drawCircle
   * @param {Number} x The x coordinate of the center of the circle
   * @param {Number} y The y coordinate of the center of the circle
   * @param {Number} radius The radius of the circle
   * @param {String} color The color of the circle in CSS format
   */
  public drawCircle(x: number, y: number, radius: number, color: string): void;

  /**
   * Draws the outline text to the bitmap.
   *
   * @method drawText
   * @param {String} text The text that will be drawn
   * @param {Number} x The x coordinate for the left of the text
   * @param {Number} y The y coordinate for the top of the text
   * @param {Number} maxWidth The maximum allowed width of the text
   * @param {Number} lineHeight The height of the text line
   * @param {String} align The alignment of the text
   */
  public drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, align: string): void;

  /**
   * Returns the width of the specified text.
   *
   * @method measureTextWidth
   * @param {String} text The text to be measured
   * @return {Number} The width of the text in pixels
   */
  public measureTextWidth(text: string): number;

  /**
   * Add a callback function that will be called when the bitmap is loaded.
   *
   * @method addLoadListener
   * @param {Function} listner The callback function
   */
  public addLoadListener(listener: BitmapLoadListener): void;

  /**
   * Tries to load the image again.
   */
  public retry(): void;

  public _makeFontNameText(): string;
  public _drawTextOutline(text: string, tx: number, ty: number, maxWidth: number): void;
  public _drawTextBody(text: string, tx: number, ty: number, maxWidth: number): void;
  public _createCanvas(width: number, height: number): void;
  public _ensureCanvas(): void;
  public _destroyCanvas(): void;
  public _createBaseTexture(source: HTMLCanvasElement | HTMLImageElement): void;
  public _updateScaleMode(): void;
  public _startLoading(): void;
  public _startDecrypting(): void;
  public _onXhrLoad(xhr: XMLHttpRequest): void;
  public _onLoad(): void;
  public _callLoadListeners(): void;
  public _onError(): void;
}
type BitmapLoadListener = () => void;


//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 */
declare class Sprite extends PIXI.Sprite {
  /**
   * @class Sprite
   * @constructor
   * @param {Bitmap} bitmap The image for the sprite
   */
  public constructor(bitmap?: Bitmap | null);

  public static readonly voidFilter: PIXI.filters.VoidFilter;

  public initialize(...args: any[]): void;

  public _bitmap: Bitmap | null | undefined;
  public _frame: Rectangle;
  public _hue: number;
  public _blendColor: [number, number, number, number];
  public _colorTone: [number, number, number, number];
  public _colorFilter: ColorFilter | null;
  public _blendMode: number;
  public _hidden: boolean;

  public spriteId: number;
  // tilemap上でのソートで使う
  public z: number;

  public static _emptyBaseTexture: PIXI.BaseTexture | null;
  // Number of the created objects.
  public static _counter: number;

  /**
   * The image for the sprite.
   *
   * @property bitmap
   * @type Bitmap
   */
  public bitmap: Bitmap | null | undefined;

  /**
   * The width of the sprite without the scale.
   *
   * @property width
   * @type Number
   */
  public width: number;

  /**
   * The height of the sprite without the scale.
   *
   * @property height
   * @type Number
   */
  public height: number;

  /**
   * The opacity of the sprite (0 to 255).
   *
   * @property opacity
   * @type Number
   */
  public opacity: number;

  /**
   * The blend mode to be applied to the sprite.
   *
   * @property blendMode
   * @type Number
   */
  public blendMode: number;

  /**
   * Destroys the sprite.
   */
  public destroy(): void;

  /**
   * Updates the sprite for each frame.
   *
   * @method update
   */
  public update(): void;

  /**
   * Makes the sprite "hidden".
   */
  public hide(): void;

  /**
   * Releases the "hidden" state of the sprite.
   */
  public show(): void;

  /**
   * Reflects the "hidden" state of the sprite to the visible state.
   */
  public updateVisibility(): void;

  /**
   * Sets the x and y at once.
   *
   * @method move
   * @param {Number} x The x coordinate of the sprite
   * @param {Number} y The y coordinate of the sprite
   */
  public move(x: number, y: number): void;

  /**
   * Sets the rectagle of the bitmap that the sprite displays.
   *
   * @method setFrame
   * @param {Number} x The x coordinate of the frame
   * @param {Number} y The y coordinate of the frame
   * @param {Number} width The width of the frame
   * @param {Number} height The height of the frame
   */
  public setFrame(x: number, y: number, width: number, height: number): void;

  /**
   * Sets the hue rotation value.
   *
   * @param {Number} hue The hue value (-360, 360)
   */
  public setHue(hue: number): void;

  /**
   * Gets the blend color for the sprite.
   *
   * @method getBlendColor
   * @return {Array} The blend color [r, g, b, a]
   */
  public getBlendColor(): number[];

  /**
   * Sets the blend color for the sprite.
   *
   * @method setBlendColor
   * @param {Array} color The blend color [r, g, b, a]
   */
  public setBlendColor(color: number[]): void;

  /**
   * Gets the color tone for the sprite.
   *
   * @method getColorTone
   * @return {Array} The color tone [r, g, b, gray]
   */
  public getColorTone(): number[];

  /**
   * Sets the color tone for the sprite.
   *
   * @method setColorTone
   * @param {Array} tone The color tone [r, g, b, gray]
   */
  public setColorTone(tone: number[]): void;

  public _onBitmapChange(): void;
  public _onBitmapLoad(): void;
  public _refresh(): void;
  public _createColorFilter(): void;
  public _updateColorFilter(): void;
}

//-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map.
 */
declare class Tilemap extends PIXI.Container {
  /**
   * @class Tilemap
   * @constructor
   */
  public constructor();

  public initialize(...args: any[]): void;

  public _margin: number;
  public _width: number;
  public _height: number;
  public _tileWidth: number;
  public _tileHeight: number;
  public _mapWidth: number;
  public _mapHeight: number;
  public _mapData: number[] | null;
  public _bitmaps: Bitmap[];

  /**
   * The origin point of the tilemap for scrolling.
   *
   * @property origin
   * @type Point
   */
  public origin: Point;

  /**
   * The tileset flags.
   *
   * @property flags
   * @type Array
   */
  public flags: number[];

  /**
   * The animation count for autotiles.
   *
   * @property animationCount
   * @type Number
   */
  public animationCount: number;

  /**
   * Whether the tilemap loops horizontal.
   *
   * @property horizontalWrap
   * @type Boolean
   */
  public horizontalWrap: boolean;

  /**
   * Whether the tilemap loops vertical.
   *
   * @property verticalWrap
   * @type Boolean
   */
  public verticalWrap: boolean;

  /**
   * The width of the screen in pixels.
   *
   * @property width
   * @type Number
   */
  public width: number;

  /**
   * The height of the screen in pixels.
   *
   * @property height
   * @type Number
   */
  public height: number;

  /**
   * Destroys the tilemap.
   */
  public destroy(): void;

  /**
   * Sets the tilemap data.
   *
   * @method setData
   * @param {Number} width The width of the map in number of tiles
   * @param {Number} height The height of the map in number of tiles
   * @param {Array} data The one dimensional array for the map data
   */
  public setData(width: number, height: number, data: number[]): void;

  /**
   * Checks whether the tileset is ready to render.
   *
   * @method isReady
   * @type Boolean
   * @return {Boolean} True if the tilemap is ready
   */
  public isReady(): boolean;

  /**
   * Updates the tilemap for each frame.
   *
   * @method update
   */
  public update(): void;

  /**
   * Sets the bitmaps used as a tileset.
   *
   * @param {Bitmap[]} bitmaps The array of the tileset bitmaps.
   */
  public setBitmaps(bitmaps: Bitmap[]): void;

  /**
   * Forces to repaint the entire tilemap.
   *
   * @method refresh
   */
  public refresh(): void;

  /**
   * Forces to refresh the tileset
   *
   * @method refresh
   */
  public refreshTileset(): void;

  /**
   * @method updateTransform
   * @private
   */
  public updateTransform(): void;

  public _createLayers(): void;

  public _lowerLayer: Sprite | undefined;
  public _upperLayer: Sprite | undefined;
  public _needRepaint: boolean;

  public _updateBitmaps(): void;
  public _addAllSpots(startX: number, startY: number): void;
  public _addSpot(startX: number, startY: number, x: number, y: number): void;
  public _addSpotTile(tileId: number, dx: number, dy: number): void;
  public _addTile(layer: Sprite, tileId: number, dx: number, dy: number): void;
  public _addNormalTile(layer: Sprite, tileId: number, dx: number, dy: number): void;
  public _addAutotile(layer: Sprite, tileId: number, dx: number, dy: number): void;
  public _addTableEdge(layer: Sprite, tileId: number, dx: number, dy: number): void;
  public _addShadow(layer: Sprite, shadowBits: number, dx: number, dy: number): void;
  public _readMapData(x: number, y: number, z: number): number;
  public _isHigherTile(tileId: number): boolean;
  public _isTableTile(tileId: number): boolean;
  public _isOverpassPosition(mx: number, my: number): boolean;
  public _sortChildren(): void;
  public _compareChildOrder(a: Sprite, b: Sprite): number;

  // Tile type checkers

  public static readonly TILE_ID_B: number;
  public static readonly TILE_ID_C: number;
  public static readonly TILE_ID_D: number;
  public static readonly TILE_ID_E: number;
  public static readonly TILE_ID_A5: number;
  public static readonly TILE_ID_A1: number;
  public static readonly TILE_ID_A2: number;
  public static readonly TILE_ID_A3: number;
  public static readonly TILE_ID_A4: number;
  public static readonly TILE_ID_MAX: number;

  public static isVisibleTile(tileId: number): boolean;

  public static isAutotile(tileId: number): boolean;

  public static getAutotileKind(tileId: number): number;

  public static getAutotileShape(tileId: number): number;

  public static makeAutotileId(kind: number, shape: number): number;

  public static isSameKindTile(tileID1: number, tileID2: number): boolean;

  public static isTileA1(tileId: number): boolean;

  public static isTileA2(tileId: number): boolean;

  public static isTileA3(tileId: number): boolean;

  public static isTileA4(tileId: number): boolean;

  public static isTileA5(tileId: number): boolean;

  public static isWaterTile(tileId: number): boolean;

  public static isWaterfallTile(tileId: number): boolean;

  public static isGroundTile(tileId: number): boolean;

  public static isShadowingTile(tileId: number): boolean;

  public static isRoofTile(tileId: number): boolean;

  public static isWallTopTile(tileId: number): boolean;

  public static isWallSideTile(tileId: number): boolean;

  public static isWallTile(tileId: number): boolean;

  public static isFloorTypeAutotile(tileId: number): boolean;

  public static isWallTypeAutotile(tileId: number): boolean;

  public static isWaterfallTypeAutotile(tileId: number): boolean;

  // Autotile shape number to coordinates of tileset images

  public static readonly FLOOR_AUTOTILE_TABLE: number[][][];

  public static readonly WALL_AUTOTILE_TABLE: number[][][];

  public static readonly WATERFALL_AUTOTILE_TABLE: number[][][];
}

declare namespace Tilemap {
  class Layer extends PIXI.Container {
    public constructor();

    public _elements: number[][];
    public _indexBuffer: PIXI.Buffer | null;
    public _indexArray: Float32Array;
    public _vertexBuffer: PIXI.Buffer | null;
    public _vertexArray: Float32Array;
    public _vao: PIXI.Geometry | null;
    public _needsTexturesUpdate: boolean;
    public _needsVertexUpdate: boolean;
    public _images: Array<HTMLImageElement | HTMLCanvasElement>;
    public _state: PIXI.State;

    public initialize(): void;

    public static readonly MAX_GL_TEXTURES: number;
    public static readonly VERTEX_STRIDE: number;

    public destroy(): void;
    public setBitmaps(bitmaps: Bitmap[]): void;
    public clear(): void;
    public addRect(setNumber: number, sx: number, sy: number, dx: number, dy: number, w: number, h: number): void;
    public render(rendered: Tilemap.Renderer): void;
    public isReady(): boolean;
    public _createVao(): void;
    public _updateIndexBuffer(): void;
    public _updateVertexBuffer(): void;
  }

  class Renderer extends PIXI.ObjectRenderer {
    public constructor();
    public initialize(renderer: PIXI.Renderer): void;
    public _shader: PIXI.Shader | null;
    public _images: []; /* unused */
    public _internalTextures: PIXI.BaseRenderTexture[];
    public _clearBuffer: Uint8Array;

    public destroy(): void;
    public getShader(): PIXI.Shader | null;
    public contextChange(): void;

    public _createShader(): void;
    public _createInternalTextures(): void;
    public _destroyInternalTextures(): void;

    public updateTextures(renderer: Tilemap.Renderer, images: Array<HTMLImageElement | HTMLCanvasElement>): void;
    public bindTextures(renderer: Tilemap.Renderer): void;
  }
}

//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 */
declare class TilingSprite extends PIXI.TilingSprite {
  /**
   * @class TilingSprite
   * @constructor
   * @param {Bitmap} bitmap The image for the tiling sprite
   */
  public constructor(bitmap?: Bitmap | null);

  public initialize(...args: any[]): void;

  public _bitmap: Bitmap | null | undefined;
  public _width: number;
  public _height: number;
  public _frame: Rectangle;
  /**
   * The origin point of the tiling sprite for scrolling.
   *
   * @property origin
   * @type Point
   */
  public origin: Point;

  public static _emptyBaseTexture: PIXI.BaseTexture | null;

  /**
   * The image for the tiling sprite.
   *
   * @property bitmap
   * @type Bitmap
   */
  public bitmap: Bitmap | null | undefined;

  /**
   * The opacity of the tiling sprite (0 to 255).
   *
   * @property opacity
   * @type Number
   */
  public opacity: number;

  /**
   * Destroys the tiling sprite.
   */
  public destory(): void;

  /**
   * Updates the tiling sprite for each frame.
   *
   * @method update
   */
  public update(): void;

  /**
   * Sets the x, y, width, and height all at once.
   *
   * @method move
   * @param {Number} x The x coordinate of the tiling sprite
   * @param {Number} y The y coordinate of the tiling sprite
   * @param {Number} width The width of the tiling sprite
   * @param {Number} height The height of the tiling sprite
   */
  public move(x: number, y: number, width: number, height: number): void;

  /**
   * Specifies the region of the image that the tiling sprite will use.
   *
   * @method setFrame
   * @param {Number} x The x coordinate of the frame
   * @param {Number} y The y coordinate of the frame
   * @param {Number} width The width of the frame
   * @param {Number} height The height of the frame
   */
  public setFrame(x: number, y: number, width: number, height: number): void;

  /**
   * @method updateTransform
   * @private
   */
  public updateTransform(): void;

  public _onBitmapChange(): void;
  public _onBitmapLoad(): void;
  public _refresh(): void;
}

//-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 */
declare class ScreenSprite extends PIXI.Container {
  /**
   * @class ScreenSprite
   * @constructor
   */
  public constructor();

  public initialize(...args: any[]): void;

  public _graphics: PIXI.Graphics;

  public _red: number;
  public _green: number;
  public _blue: number;

  /**
   * The opacity of the sprite (0 to 255).
   *
   * @property opacity
   * @type Number
   */
  public opacity: number;

  /**
   * Destroys the screen sprite.
   */
  public destroy(): void;

  /**
   * Sets black to the color of the screen sprite.
   *
   * @method setBlack
   */
  public setBlack(): void;

  /**
   * Sets white to the color of the screen sprite.
   *
   * @method setWhite
   */
  public setWhite(): void;

  /**
   * Sets the color of the screen sprite by values.
   *
   * @method setColor
   * @param {Number} r The red value in the range (0, 255)
   * @param {Number} g The green value in the range (0, 255)
   * @param {Number} b The blue value in the range (0, 255)
   */
  public setColor(r: number, g: number, b: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The window in the game.
 */
declare class Window extends PIXI.Container {
  /**
   * @class Window
   * @constructor
   */
  public constructor();

  public initialize(...args: any[]): void;

  public _isWindow: boolean;
  public _windowskin: Bitmap | null;
  public _width: number;
  public _height: number;
  public _cursorRect: Rectangle;
  public _openness: number;
  public _animationCount: number;

  public _padding: number;
  public _margin: number;
  public _colorTone: number[];
  public _innerChildren: [];

  public _container: PIXI.Container;
  public _backSprite: Sprite;
  public _frameSprite: Sprite;
  public _contentsBackSprite: Sprite;
  public _cursorSprite: Sprite;
  public _contentsSprite: Sprite;
  public _downArrowSprite: Sprite;
  public _upArrowSprite: Sprite;
  public _pauseSignSprite: Sprite;

  /**
   * The origin point of the window for scrolling.
   *
   * @property origin
   * @type Point
   */
  public origin: Point;

  /**
   * The active state for the window.
   *
   * @property active
   * @type Boolean
   */
  public active: boolean;

  /**
   * The visibility of the frame.
   *
   * @oroperty frameVisible
   * @type Boolean
   */
  public frameVisible: boolean;

  /**
   * The visibility of the cursor.
   *
   * @property cursorVisible
   * @type Boolean
   */
  public cursorVisible: boolean;

  /**
   * The visibility of the down scroll arrow.
   *
   * @property downArrowVisible
   * @type Boolean
   */
  public downArrowVisible: boolean;

  /**
   * The visibility of the up scroll arrow.
   *
   * @property upArrowVisible
   * @type Boolean
   */
  public upArrowVisible: boolean;

  /**
   * The visibility of the pause sign.
   *
   * @property pause
   * @type Boolean
   */
  public pause: boolean;

  /**
   * The image used as a window skin.
   *
   * @property windowskin
   * @type Bitmap
   */
  public windowskin: Bitmap | null;

  /**
   * The bitmap used for the window contents.
   *
   * @property contents
   * @type Bitmap
   */
  public contents: Bitmap;

  /**
   * The bitmap used for the window contents background.
   *
   * @property contentsBack
   * @type Bitmap
   */
  public contentsBack: Bitmap;

  /**
   * The width of the window in pixels.
   *
   * @property width
   * @type Number
   */
  public width: number;

  /**
   * The height of the window in pixels.
   *
   * @property height
   * @type Number
   */
  public height: number;

  /**
   * The size of the padding between the frame and contents.
   *
   * @property padding
   * @type Number
   */
  public padding: number;

  /**
   * The size of the margin for the window background.
   *
   * @property margin
   * @type Number
   */
  public margin: number;

  /**
   * The opacity of the window without contents (0 to 255).
   *
   * @property opacity
   * @type Number
   */
  public opacity: number;

  /**
   * The opacity of the window background (0 to 255).
   *
   * @property backOpacity
   * @type Number
   */
  public backOpacity: number;

  /**
   * The opacity of the window contents (0 to 255).
   *
   * @property contentsOpacity
   * @type Number
   */
  public contentOpacity: number;

  /**
   * The openness of the window (0 to 255).
   *
   * @property openness
   * @type Number
   */
  public openness: number;

  /**
   * The width of the content area in pixels.
   *
   * @readonly
   * @protperty innerWidth
   * @type Number
   */
  public readonly innerWidth: number;

  /**
   * The height of the content area in pixels.
   *
   * @readonly
   * @protperty innerHeight
   * @type Number
   */
  public readonly innerHeight: number;

  /**
   * The rectangle of the content area.
   *
   * @readonly
   * @protperty innerRect
   * @type Number
   */
  public readonly innerRect: Rectangle;

  /**
   * Destroys the window.
   */
  public destroy(): void;

  /**
   * Updates the window for each frame.
   *
   * @method update
   */
  public update(): void;

  /**
   * Sets the x, y, width, and height all at once.
   *
   * @method move
   * @param {Number} x The x coordinate of the window
   * @param {Number} y The y coordinate of the window
   * @param {Number} width The width of the window
   * @param {Number} height The height of the window
   */
  public move(x?: number, y?: number, width?: number, height?: number): void;

  /**
   * Returns true if the window is completely open (openness == 255).
   *
   * @method isOpen
   */
  public isOpen(): boolean;

  /**
   * Returns true if the window is completely closed (openness == 0).
   *
   * @method isClosed
   */
  public isClosed(): boolean;

  /**
   * Sets the position of the command cursor.
   *
   * @method setCursorRect
   * @param {Number} x The x coordinate of the cursor
   * @param {Number} y The y coordinate of the cursor
   * @param {Number} width The width of the cursor
   * @param {Number} height The height of the cursor
   */
  public setCursorRect(x?: number, y?: number, width?: number, height?: number): void;

  /**
   * Moves the cursor position by the given amount.
   *
   * @param {Number} x The amount of horizontal movement.
   * @param {Number} y The amount of vertical movement.
   */
  public moveCursorBy(x: number, y: number): void;

  /**
   * Moves the inner children by the given amount.
   *
   * @param {Number} x The amount of horizontal movement.
   * @param {Number} y The amount of vertical movement.
   */
  public moveInnerChildrenBy(x: number, y: number): void;

  /**
   * Changes the color of the background.
   *
   * @method setTone
   * @param {Number} r The red value in the range (-255, 255)
   * @param {Number} g The green value in the range (-255, 255)
   * @param {Number} b The blue value in the range (-255, 255)
   */
  public setTone(r: number, g: number, b: number): void;

  /**
   * Adds a child between the background and contents.
   *
   * @method addChildToBack
   * @param {Object} child The child to add
   * @return {Object} The child that was added
   */
  public addChildToBack(child: PIXI.DisplayObject): PIXI.DisplayObject;

  public _clientArea: Sprite;

  /**
   * Adds a child to the client area.
   *
   * @method addInnerChild
   * @param {Object} child The child to add.
   * @return {Object} The child that was added.
   */
  public addInnerChild(child: PIXI.DisplayObject): PIXI.DisplayObject;

  /**
   * @method updateTransform
   * @private
   */
  public updateTransform(): void;

  /**
   * Draws the window shape into PIXI.Graphics object. Used by WindowLayer.
   */
  public drawShape(graphics: PIXI.Graphics): void;

  public _createAllParts(): void;
  public _createContainer(): void;
  public _createBackSprite(): void;
  public _createFrameSprite(): void;
  public _createClientArea(): void;
  public _createContentsBackSprite(): void;
  public _createCursorSprite(): void;
  public _createContentsSprite(): void;
  public _createArrowSprites(): void;
  public _createPauseSignSprites(): void;
  public _onWindowskinLoad(): void;
  public _refreshAllParts(): void;
  public _refreshBack(): void;
  public _refreshFrame(): void;
  public _refreshCursor(): void;
  public _setRectPartsGeometry(sprite: Sprite, srect: Rectangle, drect: Rectangle, m: number): void;
  public _refreshArrows(): void;
  public _refreshPauseSign(): void;
  public _updateClientArea(): void;
  public _updateFrame(): void;
  public _updateContentsBack(): void;
  public _updateCorsor(): void;
  public _makeCursorAlpha(): number;
  public _updateContents(): void;
  public _updateArrows(): void;
  public _updatePauseSign(): void;
  public _updateFilterArea(): void;
}

//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 */
declare class WindowLayer extends PIXI.Container {
  /**
   * @class WindowLayer
   * @constructor
   */
  public constructor();

  public initialize(): void;

  /**
   * Updates the window layer for each frame.
   *
   * @method update
   */
  public update(): void;

  /**
   * @method render
   * @param {PIXI.Renderer} renderer The renderer.
   */
  public render(renderer: PIXI.Renderer): void;
}

//-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 */
declare class Weather extends PIXI.Container {
  /**
   * @class Weather
   * @constructor
   */
  public constructor();

  public _width: number;
  public _height: number;
  public _sprites: Sprite[];

  public _rainBitmap: Bitmap;
  public _stormBitmap: Bitmap;
  public _snowBitmap: Bitmap;
  public _dimmerSprite: ScreenSprite;

  /**
   * The type of the weather in ['none', 'rain', 'storm', 'snow'].
   *
   * @property type
   * @type String
   */
  public type: string;

  /**
   * The power of the weather in the range (0, 9).
   *
   * @property power
   * @type Number
   */
  public power: number;

  /**
   * The origin point of the weather for scrolling.
   *
   * @property origin
   * @type Point
   */
  public origin: Point;

  /**
   * Destroys the weather.
   */
  public destroy(): void;

  /**
   * Updates the weather for each frame.
   *
   * @method update
   */
  public update(): void;

  public _createBitmaps(): void;
  public _createDimmer(): void;
  public _updateDimmer(): void;
  public _updateAllSprites(): void;
  public _addSprite(): void;
  public _removeSprite(): void;
  public _updateSprite(sprite: Sprite): void;
  public _updateRainSprite(sprite: Sprite): void;
  public _updateStormSprite(sprite: Sprite): void;
  public _updateSnowSprite(sprite: Sprite): void;
  public _rebornSprite(sprite: Sprite): void;
}

//-----------------------------------------------------------------------------
declare class ColorFilter extends PIXI.Filter {
  public constructor();

  public initialize(): void;

  /**
   * Sets the hue rotation value.
   *
   * @param {Number} hue The hue value (-360, 360).
   */
  public setHue(hue: number): void;

  /**
   * Sets the color tone.
   *
   * @param {Number[]} tone The color tone [r, g, b, gray].
   */
  public setColorTone(tone: number[]): void;

  /**
   * Sets the blend color.
   *
   * @param {Number[]} color The blend color [r, g, b, a].
   */
  public setBlendColor(color: number[]): void;

  /**
   * Sets the brightness.
   *
   * @param {Number} brightness The birghtness (0 to 255).
   */
  public setBrightness(brightness: number): void;

  public _fragmentSrc(): string;
}

//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 */
declare class Stage extends PIXI.Container {
  /**
   * @class Stage
   * @constructor
   */
  public constructor();

  public initialize(...args: any[]): void;

  /**
   * Destroys the stage.
   */
  public destroy(): void;
}

//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 */
declare class WebAudio {
  /**
   * @class WebAudio
   * @constructor
   * @param {String} url The url of the audio file
   */
  public constructor(url: string);

  public intialize(url: string): void;

  public _url: string;
  public _buffers: AudioBuffer[];
  public _sourceNodes: AudioBufferSourceNode[];
  public _gainNode: GainNode | null;
  public _pannerNode: PannerNode | null;
  public _totalTime: number;
  public _sampleRate: number;
  public _loop: number;
  public _loopStart: number;
  public _loopLength: number;
  public _loopStartTime: number;
  public _loopLengthTime: number;
  public _startTime: number;
  public _volume: number;
  public _pitch: number;
  public _pan: number;
  public _endTimer: number | null;
  public _loadListeners: WebAudioLoadListener[];
  public _stopListeners: WebAudioStopListener[];
  public _lastUpdateTime: number;
  public _isLoaded: boolean;
  public _isError: boolean;
  public _isPlaying: boolean;
  public _decoder: VorbisDecoder | null;

  public static _context: AudioContext | null;
  public static _masterGainNode: GainNode | null;
  public static _masterVolume: number;

  /**
   * Initializes the audio system.
   *
   * @static
   * @method initialize
   * @param {Boolean} noAudio Flag for the no-audio mode
   * @return {Boolean} True if the audio system is available
   */
  public static initialize(noAudio: boolean): boolean;

  /**
   * Set the master volume for all audio.
   *
   * @param {number} volume The master volume (0 to 1).
   */
  public static setMasterVolume(volume: number): void;

  public static _createContext(): void;
  public static _currentTime(): number;
  public static _createMasterGainNode(): void;
  public static _setupEventHandlers(): void;
  public static _onUserGesture(): void;
  public static _onVisibilityChange(): void;
  public static _onHide(): void;
  public static _onShow(): void;
  public static _shouldMuteOnHide(): boolean;
  public static _fadeIn(duration: number): void;
  public static _fadeOut(duration: number): void;

  /**
   * Clears the audio data.
   *
   * @method clear
   */
  public clear(): void;

  /**
   * [read-only] The url of the audio file.
   *
   * @property url
   * @type String
   */
  public readonly url: string;

  /**
   * The volume of the audio.
   *
   * @property volume
   * @type Number
   */
  public volume: number;

  /**
   * The pitch of the audio.
   *
   * @property pitch
   * @type Number
   */
  public pitch: number;

  /**
   * The pan of the audio.
   *
   * @property pan
   * @type Number
   */
  public pan: number;

  /**
   * Checks whether the audio data is ready to play.
   *
   * @method isReady
   * @return {Boolean} True if the audio data is ready to play
   */
  public isReady(): boolean;

  /**
   * Checks whether a loading error has occurred.
   *
   * @method isError
   * @return {Boolean} True if a loading error has occurred
   */
  public isError(): boolean;

  /**
   * Checks whether the audio is playing.
   *
   * @method isPlaying
   * @return {Boolean} True if the audio is playing
   */
  public isPlaying(): boolean;

  /**
   * Plays the audio.
   *
   * @method play
   * @param {Boolean} loop Whether the audio data play in a loop
   * @param {Number} offset The start position to play in seconds
   */
  public play(loop: boolean, offset: number): void;

  /**
   * Stops the audio.
   *
   * @method stop
   */
  public stop(): void;

  /**
   * Destorys the audio.
   *
   * @method destroy
   */
  public destroy(): void;

  /**
   * Performs the audio fade-in.
   *
   * @method fadeIn
   * @param {Number} duration Fade-in time in seconds
   */
  public fadeIn(duration: number): void;

  /**
   * Performs the audio fade-out.
   *
   * @method fadeOut
   * @param {Number} duration Fade-out time in seconds
   */
  public fadeOut(duration: number): void;

  /**
   * Gets the seek position of the audio.
   *
   * @method seek
   */
  public seek(): number;

  /**
   * Add a callback function that will be called when the audio data is loaded.
   *
   * @method addLoadListener
   * @param {Function} listner The callback function
   */
  public addLoadListener(listener: WebAudioLoadListener): void;

  /**
   * Add a callback function that will be called when the playback is stopped.
   *
   * @method addStopListener
   * @param {Function} listner The callback function
   */
  public addStopListener(listener: WebAudioStopListener): void;

  /**
   * Tries to load the audio again.
   */
  public retry(): void;

  public _startLoading(): void;
  public _shouldUseDecoder(): boolean;
  public _createDecoder(): void;
  public _destroyDecoder(): void;
  public _realUrl(): string;
  public _startXhrLoading(url: string): void;
  public _startFetching(url: string): void;
  public _onXhrLoad(xhr: XMLHttpRequest): void;
  public _onFetch(response: Response): void;
  public _onError(): void;
  public _onFetchProcess(value: any): void;
  public _updateBufferOnFetch(): void;
  public _concatenateFetchedData(): void;
  public _updateBuffer(): void;
  public _readableBuffer(): ArrayBuffer;
  public _decodeAudioData(arrayBUffer: ArrayBuffer): void;
  public _onDecode(buffer: ArrayBuffer): void;
  public _refreshSourceNode(): void;
  public _startPlaying(offset: number): void;
  public _startAllSourceNodes(): void;
  public _startSourceNode(index: number): void;
  public _stopSourceNode(): void;
  public _createPannerNode(): void;
  public _createGainNode(): void;
  public _createAllSourceNodes(): void;
  public _createSourceNode(index: number): void;
  public _removeNodes(): void;
  public _createEndTimer(): void;
  public _removeEndTimer(): void;
  public _updatePanner(): void;
  public _onLoad(): void;
  public _readLoopComments(arrayBuffer: ArrayBuffer): void;
  public _readMetaData(view: DataView, index: number, size: number): void;
  public _readFourCharacters(view: DataView, index: number): string;
}
type WebAudioLoadListener = () => void;
type WebAudioStopListener = () => void;
//-----------------------------------------------------------------------------
/**
 * The static class that handles video playback.
 */
declare class Video {
  /**
   * Initializes the video system.
   *
   * @param {Number} width The width of the video.
   * @param {Number} height The height of the video.
   */
  public static initialize(width: number, height: number): void;

  /**
   * Changes the display size of the video.
   *
   * @param {Number} width The width of the video.
   * @param {Number} height The height of the video.
   */
  public static resize(width: number, height: number): void;

  /**
   * Starts playback of a video.
   *
   * @param {String} src The url of the video.
   */
  public static play(src: string): void;

  /**
   * Checks whether the video is playing.
   *
   * @return {Boolean} True if the video is playing.
   */
  public static isPlaying(): boolean;

  /**
   * Sets the volume for video.
   *
   * @param {Number} volume The volume for videos (0 to 1).
   */
  public static setVolume(volume: number): void;

  public static _element: HTMLVideoElement;

  public static _createElement(): void;
  public static _onLoad(): void;
  public static _onError(): void;
  public static _onEnd(): void;
  public static _updateVisibility(): void;
  public static _isVisible(): boolean;
  public static _setupEventHandlers(): void;
  public static _onUserGesture(): void;
}
//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 */
declare class Input {
  /**
   * @class Input
   */
  private constructor();

  /**
   * Initializes the input system.
   *
   * @static
   * @method initialize
   */
  public static initialize(): void;

  /**
   * The wait time of the key repeat in frames.
   *
   * @static
   * @property keyRepeatWait
   * @type Number
   */
  public static keyRepeatWait: number;

  /**
   * The interval of the key repeat in frames.
   *
   * @static
   * @property keyRepeatInterval
   * @type Number
   */
  public static keyRepeatInterval: number;

  /**
   * A hash table to convert from a virtual key code to a mapped key name.
   *
   * @static
   * @property keyMapper
   * @type Object
   */
  public static keyMapper: { [keyCode: number]: string };

  /**
   * A hash table to convert from a gamepad button to a mapped key name.
   *
   * @static
   * @property gamepadMapper
   * @type Object
   */
  public static gamepadMapper: { [gamepadButton: number]: string };

  /**
   * Clears all the input data.
   *
   * @static
   * @method clear
   */
  public static clear(): void;

  public static _currentState: { [keyName: string]: boolean };
  public static _previousState: { [keyName: string]: boolean };
  public static _gamepadStates: boolean[][];
  public static _latestButton: string | null;
  public static _pressedTime: number;
  public static _dir4: number;
  public static _dir8: number;
  public static _preferredAxis: 'x' | 'y' | '';
  public static _date: number;
  public static _virtualButton: string | null;

  /**
   * Updates the input data.
   *
   * @static
   * @method update
   */
  public static update(): void;

  /**
   * Checks whether a key is currently pressed down.
   *
   * @static
   * @method isPressed
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is pressed
   */
  public static isPressed(keyName: string): boolean;

  /**
   * Checks whether a key is just pressed.
   *
   * @static
   * @method isTriggered
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is triggered
   */
  public static isTriggered(keyName: string): boolean;

  /**
   * Checks whether a key is just pressed or a key repeat occurred.
   *
   * @static
   * @method isRepeated
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is repeated
   */
  public static isRepeated(keyName: string): boolean;

  /**
   * Checks whether a key is kept depressed.
   *
   * @static
   * @method isLongPressed
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is long-pressed
   */
  public static isLongPressed(keyName: string): boolean;

  /**
   * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
   *
   * @static
   * @property dir4
   * @type Number
   */
  public static readonly dir4: number;

  /**
   * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
   *
   * @static
   * @property dir8
   * @type Number
   */
  public static readonly dir8: number;

  /**
   * [read-only] The time of the last input in milliseconds.
   *
   * @static
   * @property date
   * @type Number
   */
  public static readonly date: number;

  public static virtualClick(buttonName: string): void;

  public static _setupEventHandlers(): void;
  public static _onKeyDown(event: KeyboardEvent): void;
  public static _shouldPreventDefault(keyCode: number): boolean;
  public static _onKeyUp(event: KeyboardEvent): void;
  public static _onLostFocus(): void;
  public static _pollGamepads(): void;
  public static _updateGamepadState(gamepad: Gamepad): void;
  public static _updateDirection(): void;
  public static _signX(): number;
  public static _signY(): number;
  public static _makeNumpadDirection(x: number, y: number): number;
  public static _isEscapeCompatible(keyName: string): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 */
declare class TouchInput {
  /**
   * @class TouchInput
   */
  private constructor();

  /**
   * Initializes the touch system.
   *
   * @static
   * @method initialize
   */
  public static initialize(): void;

  /**
   * The wait time of the pseudo key repeat in frames.
   *
   * @static
   * @property keyRepeatWait
   * @type Number
   */
  public static keyRepeatWait: number;

  /**
   * The interval of the pseudo key repeat in frames.
   *
   * @static
   * @property keyRepeatInterval
   * @type Number
   */
  public static keyRepeatInterval: number;

  /**
   * The threshold number of pixels to treat as moved.
   *
   * @type number
   */
  public static moveThreashold: number;

  /**
   * Clears all the touch data.
   *
   * @static
   * @method clear
   */
  public static clear(): void;

  public static _mousePressed: boolean;
  public static _screenPressed: boolean;
  public static _pressedTime: number;
  public static _clicked: boolean;
  public static _newState: TouchInput.State;
  public static _currentState: TouchInput.State;
  public static _moved: boolean;
  public static _triggerX: number;
  public static _triggerY: number;
  public static _x: number;
  public static _y: number;
  public static _date: number;

  /**
   * Updates the touch data.
   *
   * @static
   * @method update
   */
  public static update(): void;

  /**
   * Checks whether the mouse button or touchscreen has been pressed and released at the same position.
   *
   * @return {Boolean} True if the mouse button or touchscreen is clicked.
   */
  public static isClicked(): boolean;

  /**
   * Checks whether the mouse button or touchscreen is currently pressed down.
   *
   * @static
   * @method isPressed
   * @return {Boolean} True if the mouse button or touchscreen is pressed
   */
  public static isPressed(): boolean;

  /**
   * Checks whether the left mouse button or touchscreen is just pressed.
   *
   * @static
   * @method isTriggered
   * @return {Boolean} True if the mouse button or touchscreen is triggered
   */
  public static isTriggered(): boolean;

  /**
   * Checks whether the left mouse button or touchscreen is just pressed
   * or a pseudo key repeat occurred.
   *
   * @static
   * @method isRepeated
   * @return {Boolean} True if the mouse button or touchscreen is repeated
   */
  public static isRepeated(): boolean;

  /**
   * Checks whether the left mouse button or touchscreen is kept depressed.
   *
   * @static
   * @method isLongPressed
   * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
   */
  public static isLongPressed(): boolean;

  /**
   * Checks whether the right mouse button is just pressed.
   *
   * @static
   * @method isCancelled
   * @return {Boolean} True if the right mouse button is just pressed
   */
  public static isCancelled(): boolean;

  /**
   * Checks whether the mouse or a finger on the touchscreen is moved.
   *
   * @static
   * @method isMoved
   * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
   */
  public static isMoved(): boolean;

  /**
   * Checks whether the mouse is moved without pressing a button.
   *
   * @return {Boolean} True if the mouse is hovered.
   */
  public static isHovered(): boolean;

  /**
   * Checks whether the left mouse button or touchscreen is released.
   *
   * @static
   * @method isReleased
   * @return {Boolean} True if the mouse button or touchscreen is released
   */
  public static isReleased(): boolean;

  /**
   * [read-only] The horizontal scroll amount.
   *
   * @static
   * @property wheelX
   * @type Number
   */
  public static readonly wheelX: number;

  /**
   * [read-only] The vertical scroll amount.
   *
   * @static
   * @property wheelY
   * @type Number
   */
  public static readonly wheelY: number;

  /**
   * [read-only] The x coordinate on the canvas area of the latest touch event.
   *
   * @static
   * @property x
   * @type Number
   */
  public static readonly x: number;

  /**
   * [read-only] The y coordinate on the canvas area of the latest touch event.
   *
   * @static
   * @property y
   * @type Number
   */
  public static readonly y: number;

  /**
   * [read-only] The time of the last input in milliseconds.
   *
   * @static
   * @property date
   * @type Number
   */
  public static readonly date: number;

  public static _setupEventHandlers(): void;
  public static _onMouseDown(event: MouseEvent): void;
  public static _onLeftButtonDown(event: MouseEvent): void;
  public static _onMiddleButtonDown(event: MouseEvent): void;
  public static _onRightButtonDown(event: MouseEvent): void;
  public static _onMouseMove(event: MouseEvent): void;
  public static _onMouseUp(event: MouseEvent): void;
  public static _onWheel(event: WheelEvent): void;
  public static _onTouchStart(event: TouchEvent): void;
  public static _onTouchMove(event: TouchEvent): void;
  public static _onTouchEnd(event: TouchEvent): void;
  public static _onTouchCancel(event: TouchEvent): void;
  public static _onLostFocus(): void;
  public static _onTrigger(x: number, y: number): void;
  public static _onCancel(x: number, y: number): void;
  public static _onMove(x: number, y: number): void;
  public static _onHover(x: number, y: number): void;
  public static _onRelease(x: number, y: number): void;
}

declare namespace TouchInput {
  interface State {
    triggered: boolean;
    cancelled: boolean;
    moved: boolean;
    hovered: boolean;
    released: boolean;
    wheelX: number;
    wheelY: number;
  }
}
//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 */
declare class JsonEx {
  /**
   * @class JsonEx
   */
  private constructor();

  /**
   * The maximum depth of objects.
   *
   * @static
   * @property maxDepth
   * @type Number
   * @default 100
   */
  public static maxDepth: number;

  /**
   * Converts an object to a JSON string with object information.
   *
   * @static
   * @method stringify
   * @param {Object} object The object to be converted
   * @return {String} The JSON string
   */
  public static stringify(object: any): string;

  /**
   * Parses a JSON string and reconstructs the corresponding object.
   *
   * @static
   * @method parse
   * @param {String} json The JSON string
   * @return {Object} The reconstructed object
   */
  public static parse(json: string): any;

  /**
   * Makes a deep copy of the specified object.
   *
   * @static
   * @method makeDeepCopy
   * @param {Object} object The object to be copied
   * @return {Object} The copied object
   */
  public static makeDeepCopy<T>(object: T): T;

  public static _encode<T>(value: T, depth: number): T;
  public static _decode<T>(value: T): T;
}
