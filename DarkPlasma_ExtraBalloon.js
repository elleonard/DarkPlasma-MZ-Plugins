// DarkPlasma_ExtraBalloon 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/06/19 1.0.0 公開
 */

/*:ja
 * @plugindesc 吹き出しアイコンを15個を超えて増やす
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param ballonIdRangeList
 * @text フキダシID割当
 * @type struct<BalloonIdRange>[]
 * @default ["{\"image\":\"Balloon\",\"startId\":\"1\",\"endId\":\"15\",\"nameList\":\"[\\\"びっくり\\\",\\\"はてな\\\",\\\"音符\\\",\\\"怒り\\\",\\\"ハート\\\",\\\"汗\\\",\\\"くしゃくしゃ\\\",\\\"沈黙\\\",\\\"電球\\\",\\\"Zzz\\\",\\\"ユーザー定義1\\\",\\\"ユーザー定義2\\\",\\\"ユーザー定義3\\\",\\\"ユーザー定義4\\\",\\\"ユーザー定義5\\\"]\"}"]
 *
 * @param generateAdditionalPlugin
 * @desc ONの場合、テストプレイ起動時に追加プラグインを生成します。
 * @text 追加プラグイン生成
 * @type boolean
 * @default false
 *
 * @command showBalloon
 * @text フキダシ表示
 * @desc IDを指定してフキダシを表示します。
 * @arg id
 * @text フキダシID
 * @type number
 * @default 1
 * @arg targetType
 * @text 対象キャラクター
 * @desc フキダシ表示対象を選択します。
 * @type select
 * @option プレイヤー
 * @value player
 * @option このイベント
 * @value thisEvent
 * @option その他イベント
 * @value otherEvent
 * @default player
 * @arg targetEventId
 * @text 対象イベントID
 * @desc キャラクターにその他イベントを選択した場合、イベントIDを指定します。
 * @type number
 * @default 1
 * @arg wait
 * @text 完了までウェイト
 * @desc ONの場合、フキダシ表示完了までウェイトします。
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.0.0
 * フキダシID16以降を設定し、表示できるようにします。
 *
 * デフォルト設定では、デフォルトフキダシ画像にID1から15が割り当てられています。
 * デフォルト画像に16行目以降のバルーンを登録する場合、
 * 設定で終了IDを16以上の値にしてください。
 *
 * 1画像につき、85個までIDを割り当てることができます。
 *
 * IDを割り当て、プラグインコマンドでそのIDを指定することで
 * ID16以降のフキダシを表示できます。
 *
 * 設定をONにすると、テストプレイ開始時に追加プラグイン
 * DarkPlasma_NamedExtendBalloon
 * が生成されます。
 * 生成されたプラグインのプラグインコマンドでは、
 * 本プラグインで設定した名前をベースにフキダシを選択して表示できます。
 */
/*~struct~BalloonIdRange:
 * @param image
 * @text 画像
 * @type file
 * @default Balloon
 * @dir img/system
 *
 * @param startId
 * @desc 指定画像に割り振るフキダシIDの最小値を指定します。
 * @text 開始ID
 * @type number
 *
 * @param endId
 * @desc 指定画像に割り振るフキダシIDの最大値を指定します。開始ID+84以下にしてください。
 * @text 終了ID
 * @type number
 *
 * @param nameList
 * @desc 追加プラグイン生成時に各IDに割り当てる名前を指定します。
 * @text バルーン名
 * @type string[]
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_showBalloon(args) {
    return {
      id: Number(undefined.id || 1),
      targetType: String(undefined.targetType || 'player'),
      targetEventId: Number(undefined.targetEventId || 1),
      wait: String(undefined.wait || false) === 'true',
    };
  }

  const command_showBalloon = 'showBalloon';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    ballonIdRangeList: JSON.parse(
      pluginParameters.ballonIdRangeList ||
        '[{"image":"Balloon","startId":"1","endId":"15","nameList":["びっくり","はてな","音符","怒り","ハート","汗","くしゃくしゃ","沈黙","電球","Zzz","ユーザー定義1","ユーザー定義2","ユーザー定義3","ユーザー定義4","ユーザー定義5"]}]'
    ).map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          image: String(parsed.image || 'Balloon'),
          startId: Number(parsed.startId || 0),
          endId: Number(parsed.endId || 0),
          nameList: JSON.parse(parsed.nameList || '[]').map((e) => {
            return String(e || '');
          }),
        };
      })(e || '{}');
    }),
    generateAdditionalPlugin: String(pluginParameters.generateAdditionalPlugin || false) === 'true',
  };

  const TARGET_TYPE = {
    PLAYER: 'player',
    THIS: 'thisEvent',
    OTHER: 'otherEvent',
  };

  const NAMED_EXTRA_BALLOON_PLUGIN = 'DarkPlasma_NamedExtraBalloon';

  PluginManager.registerCommand(pluginName, command_showBalloon, function (args) {
    const parsedArgs = parseArgs_showBalloon();
    const target = (() => {
      switch (parsedArgs.targetType) {
        case TARGET_TYPE.PLAYER:
          return this.character(-1);
        case TARGET_TYPE.THIS:
          return this.character(this._eventId);
        case TARGET_TYPE.OTHER:
          return this.character(parsedArgs.targetEventId);
      }
    })();
    if (target) {
      $gameTemp.requestBalloon(target, parsedArgs.id);
      if (parsedArgs.wait) {
        this.setWaitMode('balloon');
      }
    }
  });

  /**
   * 追加プラグインのためのラッパーコマンド登録
   */
  PluginManager.registerCommand(NAMED_EXTRA_BALLOON_PLUGIN, command_showBalloon, function (args) {
    PluginManager.callCommand(this, pluginName, command_showBalloon, args);
  });

  /**
   * @param {{nameList: string[], startId: number}} idRange
   * @return {string}
   */
  function generateOptionAndValue(idRange) {
    return idRange.nameList.map((name, index) => {
      return ` * @option ${name}
 * @value ${index + idRange.startId}`;
    });
  }

  /**
   * @param {Scene_Boot.prototype} sceneBoot
   */
  function Scene_Boot_ExtraBalloonMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      if (Utils.isOptionValid('test') && Utils.isNwjs() && settings.generateAdditionalPlugin) {
        this.generateNamedExtraBalloonPlugin();
      }
    };

    sceneBoot.generateNamedExtraBalloonPlugin = function () {
      /**
       * ひとまず日本語のみ対応
       * 二重管理になっているので、多言語対応する際はこのあたりもうちょっとうまくやりたい
       */
      const command = `*:ja
 * @plugindesc フキダシアイコンを名前選択して表示する
 * @author DarkPlasma
 *
 * @target MZ
 *
 * @command ${command_showBalloon}
 * @text フキダシ表示
 * @desc フキダシ名を選択して表示します。
 * @arg id
 * @type select
${settings.ballonIdRangeList
  .map((idRange) => generateOptionAndValue(idRange))
  .flat()
  .join('\n')}
 * @arg targetType
 * @text 対象キャラクター
 * @desc フキダシ表示対象を選択します。
 * @type select
 * @option プレイヤー
 * @value ${TARGET_TYPE.PLAYER}
 * @option このイベント
 * @value ${TARGET_TYPE.THIS}
 * @option その他イベント
 * @value ${TARGET_TYPE.OTHER}
 * @default ${TARGET_TYPE.PLAYER}
 * @arg targetEventId
 * @text 対象イベントID
 * @desc キャラクターにその他イベントを選択した場合、イベントIDを指定します。
 * @type number
 * @default 1
 * @arg wait
 * @text 完了までウェイト
 * @desc ONの場合、フキダシ表示完了までウェイトします。
 * @type boolean
 * @default false
 * 
 * @base DarkPlasma_ExtraBalloon
 * 
 * @help
 * 本プラグインは DarkPlasma_ExtraBalloon.js によって生成されました。
 * DarkPlasma_ExtraBalloon.js で定義されたフキダシを
 * 名前を選択して表示するプラグインコマンドを提供します。
 */`;
      const fs = require('fs');
      /**
       * /を含めるとエディタのパースに引っかかってしまうため、ここで合成
       */
      fs.writeFileSync(`./js/plugins/DarkPlasma_NamedExtraBalloon.js`, `/${command}`);
    };
  }

  Scene_Boot_ExtraBalloonMixIn(Scene_Boot.prototype);

  /**
   * @param {Sprite_Balloon.prototype} spriteBalloon
   */
  function Sprite_Balloon_ExtraBalloonMixIn(spriteBalloon) {
    /**
     * ID割当を再定義するため上書き
     */
    spriteBalloon.loadBitmap = function () {
      /**
       * 初回は必ずID0で呼ばれる
       */
      if (this._balloonId === 0) {
        return;
      }
      const idRange = this.idRange();
      if (!idRange) {
        throw Error(`無効なフキダシID: ${this._balloonId}`);
      }
      this.bitmap = ImageManager.loadSystem(idRange.image);
      this.setFrame(0, 0, 0, 0);
    };

    const _setup = spriteBalloon.setup;
    spriteBalloon.setup = function (targetSprite, balloonId) {
      _setup.call(this, targetSprite, balloonId);
      this.loadBitmap();
    };

    spriteBalloon.idRange = function () {
      return settings.ballonIdRangeList.find(
        (idRange) => idRange.startId <= this._balloonId && this._balloonId <= idRange.endId
      );
    };

    spriteBalloon.startId = function () {
      return this.idRange().startId;
    };

    /**
     * ID拡張のため上書き
     */
    spriteBalloon.updateFrame = function () {
      const w = 48;
      const h = 48;
      const sx = this.frameIndex() * w;
      const sy = (this._balloonId - this.startId()) * h;
      this.setFrame(sx, sy, w, h);
    };
  }

  Sprite_Balloon_ExtraBalloonMixIn(Sprite_Balloon.prototype);
})();
