/*!
 * TypeScript Declaration File for pixi-picture version 1.0.3
 * Copyright (c) 2016 F_
 * Licensed under the MIT license
 * http://opensource.org/licenses/mit-license.php 
 */
/*!
 * pixi-picture - v1.0.3
 * Compiled Wed Oct 12 2016 22:33:16 GMT+0300 (RTZ 2 (зима))
 *
 * pixi-picture is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

declare namespace PIXI.extras {

	/**
	 * Renderer that clamps the texture so neighbour frames wont bleed on it
	 * immitates context2d drawImage behaviour
	 */
	export class PictureRenderer extends PIXI.ObjectRenderer {
		/** 
		 * @param renderer {PIXI.WebGLRenderer} The renderer this plugin works for
		 */
		public constructor(renderer: PIXI.WebGLRenderer);

		public readonly quad: PIXI.Quad;
		public readonly drawModes: PictureShader[][];
		public readonly normalShader: NormalShader[];

		private _tempClamp: Float32Array;
		private _tempColor: Float32Array;
		private _tempRect: PIXI.Rectangle;
		private _tempRect2: PIXI.Rectangle;
		private _tempRect3: PIXI.Rectangle;
		private _tempMatrix: PIXI.Matrix;
		private _tempMatrix2: PIXI.Matrix;
		private _bigBuf: Uint8Array;
		private _renderTexture: PIXI.BaseRenderTexture;

		public onContextChange(): void;
		public start(): void;
		public flush(): void;

		/**
		 * Renders the picture object.
		 *
		 * @param sprite {PIXI.tilemap.PictureSprite} the picture to render
		 */
		public render(sprite: PictureSprite): void;

		private _getRenderTexture(minWidth: number, minHeight: number): PIXI.BaseRenderTexture;
		private _getBuf(size: number): Uint8Array;
		private _renderNormal(sprite: PictureSprite, shader: NormalShader): void;
		private _renderBlend(sprite: PictureSprite, shader: PictureShader): void;
		private _renderInner(sprite: PictureSprite, shader: PictureShader): void;
		private _renderSprite(sprite: PictureSprite, shader: PictureShader): void;

		/**
		 * this is a part of PIXI.extras.TilingSprite. It will be refactored later
		 * @param ts
		 * @returns {boolean}
		 */
		private _isSimpleSprite(ts: PictureSprite): boolean;

		/**
		 * this is a part of PIXI.extras.TilingSprite. It will be refactored later
		 * @param ts
		 * @returns {boolean}
		 */
		private _renderWithShader(ts: PictureSprite, isSimple: boolean, shader: PictureShader): void;
	}

	/**
	 * A Sprite with reduced border artifacts
	 */
	export class PictureSprite extends PIXI.Sprite {
		/**
		 * @param texture {PIXI.Texture} the texture for this sprite
		 */
		public constructor(texture: PIXI.Texture);

		/**
		 * Renders the object using the WebGL renderer
		 *
		 * @param renderer {PIXI.WebGLRenderer}
		 */
		protected _renderWebGL(renderer: PIXI.WebGLRenderer): void;
	}

	/**
	 * A TilingSprite with support of additional blendModes
	 */
	export class PictureTilingSprite extends PIXI.extras.TilingSprite {
		/**
		 * @param texture {PIXI.Texture} the texture for this sprite
		 * @param {number} width width
		 * @param {number} height height
		 */
		public constructor(texture: PIXI.Texture, width: number, height: number);
		/**
		 * Renders the object using the WebGL renderer
		 *
		 * @param renderer {PIXI.WebGLRenderer}
		 */
		protected _renderWebGL(renderer: PIXI.WebGLRenderer): void;
	}

	class PictureShader extends PIXI.Shader {
		/**
		 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
		 * @param vert {string}
		 * @param frag {string}
		 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
		 */
		public constructor(gl: WebGLRenderingContext, vert: string, frag: string, tilingMode: number);
	}

	class NormalShader extends PictureShader {
		/**
		 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
		 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
		 */
		public constructor(gl: WebGLRenderingContext, tilingMode: number);
	}

	class HardLightShader extends PictureShader {
		/**
		 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
		 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
		 */
		public constructor(gl: WebGLRenderingContext, tilingMode: number);
	}

	class OverlayShader extends PictureShader {
		/**
		 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
		 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
		 */
		public constructor(gl: WebGLRenderingContext, tilingMode: number);
	}

	/**
	 * Maps gl blend combinations to WebGL
	 */
	function mapFilterBlendModesToPixi(gl: WebGLRenderingContext, array?: PictureShader[][]): PictureShader[][];
}
