import { pluginName } from '../../common/pluginName';
import { command_showBalloon, parseArgs_showBalloon } from './_build/DarkPlasma_ExtraBalloon_commands';
import { settings } from './_build/DarkPlasma_ExtraBalloon_parameters';

const TARGET_TYPE = {
  PLAYER: 'player',
  THIS: 'thisEvent',
  OTHER: 'otherEvent',
};

const NAMED_EXTRA_BALLOON_PLUGIN = 'DarkPlasma_NamedExtraBalloon';

PluginManager.registerCommand(pluginName, command_showBalloon, function (args) {
  const parsedArgs = parseArgs_showBalloon(args);
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
