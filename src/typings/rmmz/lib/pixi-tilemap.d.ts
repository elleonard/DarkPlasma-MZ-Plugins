/*!
 * TypeScript Declaration File for pixi-tilemap version 1.0.1
 * Copyright (c) 2016 F_
 * Licensed under the MIT license
 * http://opensource.org/licenses/mit-license.php 
 */
/*!
 * pixi-tilemap - v1.0.1
 * Compiled Sun Oct 09 2016 01:20:09 GMT+0300 (RTZ 2 (зима))
 *
 * pixi-tilemap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

declare namespace PIXI.tilemap {
	/*
	 * Renderer for square and rectangle tiles.
	 * Squares cannot be rotated, skewed.
	 * For container with squares, scale.x must be equals to scale.y, matrix.a to matrix.d
	 * Rectangles do not care about that.
	 */
	export class TileRenderer extends PIXI.ObjectRenderer {
		/**
		 * @param renderer {PIXI.WebGLRenderer} The renderer this sprite batch works for.
		 */
		public constructor(renderer: PIXI.WebGLRenderer);

		public static vbAutoincrement: number;
		public static SCALE_MODE: number;

		public vbs: { [id: number]: VertexBufferEntry };
		public lastTimeCheck: number;
		public tileAnim: number[];
		public maxTextures: number;
		public indices: Uint16Array;
		public indexBuffer: PIXI.glCore.GLBuffer | null;
		public rectShader: RectTileShader | undefined;
		public squareShader: SquareTileShader | undefined;
		public glTextures: PIXI.glCore.GLTexture[];
		public boundSprites: PIXI.Sprite[][];

		public onContextChange(): void;
		public initBounds(): void;
		public bindTextures(renderer: PIXI.WebGLRenderer, textures: PIXI.Texture[]): void;
		public checkLeaks(): void;
		public start(): void;
		public getVb(id: number): VertexBufferEntry | null;
		public createVb(useSquare: boolean): VertexBufferEntry;
		public removeVb(id: number): void;
		public checkIndexBuffer(size: number): void;
		public getShader(useSquare: boolean): PIXI.Shader;
		public destroy(): void;
	}
	interface VertexBufferEntry {
		id: number,
		vb: PIXI.glCore.GLBuffer,
		vao: PIXI.glCore.VertexArrayObject,
		lastTimeAccess: number,
		useSquare: boolean,
		shader: PIXI.Shader,
	}

	export class CanvasTileRenderer {
		public constructor(renderer: PIXI.CanvasRenderer);

		public renderer: PIXI.CanvasRenderer;
		public tileAnim: number[];
	}

	export class RectTileLayer extends PIXI.DisplayObject {
		public constructor(zIndex: number, textures: PIXI.Texture[]);

		public textures: PIXI.Texture[];
		public z: number;
		public zIndex: number;
		public pointsBuf: number[];
		public modificationTileMarker: number;
		public hasAnim: boolean;

		private _tempSize: Float32Array;
		private _tempTexSize: number;

		public renderCanvas(renderer: PIXI.CanvasRenderer): void;
		public addRect(textureId: number, u: number, v: number, x: number, y: number, tileWidth: number, tileHeight: number, animX?: number, animY?: number): void;
		public renderWebGL(renderer: PIXI.WebGLRenderer, useSquare?: boolean): void;
	}

	export class CompositeRectTileLayer extends PIXI.Container {
		public constructor(zIndex: number, bitmaps: PIXI.Texture[], useSquare: boolean, texPerChild: number);

		public z: number;
		public zIndex: number;
		public useSquare: boolean;
		public shadowColor: Float32Array;
		public texPerChild: number;
		public modificationTileMarker: number;

		public initialize(...args: any[]): void;
		public setBitmaps(bitmaps: PIXI.Texture[]): void;
		public clear(): void;
		public addRect(num: number, u: number, v: number, x: number, y: number, tileWidth: number, tileHeight: number): void;

		/**
		 * "hello world!" of pixi-tilemap library. Pass it texture and it will be added
		 * @param texture
		 * @param x
		 * @param y
		 * @returns {boolean}
		 */
		public addFrame(texture: PIXI.Texture | string, x: number, y: number): boolean;

		public renderCanvas(renderer: PIXI.CanvasRenderer): void;
		public renderWebGL(renderer: PIXI.WebGLRenderer): void;
		public isModified(anim: boolean): boolean;
		public clearModify(): void;
	}

	export class ZLayer extends PIXI.Container {
		public constructor(tilemap: any, zIndex: number);

		public tilemap: any;
		public z: number;

		public initialize(...args: any[]): void;
		public clear(): void;
		public cacheIfDirty(): void;
		public renderCanvas(renderer: PIXI.CanvasRenderer): void;
	}

	export class GraphicsLayer extends PIXI.Graphics {
		public constructor(zIndex: number);

		public z: number;
		public zIndex: number;

		public renderCanvas(renderer: PIXI.CanvasRenderer): void;
		public renderWebGL(renderer: PIXI.WebGLRenderer): void;
		public isModified(anim: boolean): boolean;
		public clearModify(): void;
	}

	class RectTileShader extends PIXI.Shader {
		public constructor(gl: WebGLRenderingContext, maxTextures: number);

		public vertSize: number;
		public vertPerQuad: number;
		public stride: number;

		public createVao(renderer: PIXI.WebGLRenderer, vb: PIXI.glCore.GLBuffer): PIXI.glCore.VertexArrayObject;
	}

	class SquareTileShader extends PIXI.Shader {
		public constructor(gl: WebGLRenderingContext, maxTextures: number);

		public maxTextures: number;
		public vertSize: number;
		public vertPerQuad: number;
		public stride: number;

		public createVao(renderer: PIXI.WebGLRenderer, vb: PIXI.glCore.GLBuffer): PIXI.glCore.VertexArrayObject;
	}
}
