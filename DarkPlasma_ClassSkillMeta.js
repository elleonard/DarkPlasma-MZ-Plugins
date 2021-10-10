// DarkPlasma_ClassSkillMeta 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/10/10 1.0.0 公開
 */

/*:ja
 * @plugindesc 職業の習得スキルのメモ欄にメタデータを登録する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 職業の習得するスキル一覧のメモ欄に、
 * 他の各種データ同様にメタデータを登録できるようにします。
 *
 * 例えば、習得するスキルのメモ欄に <a:AAA> と記述すると
 * $dataClasses[クラスID].learnings[習得スキルindex].meta.a に
 * "AAA" が設定されます。
 * booleanに関しても、その他各種データのメタデータ同様の仕様で設定されます。
 */

(() => {
  'use strict';

  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function (object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataClasses) {
      object
        .filter((clazz) => clazz)
        .forEach((clazz) => {
          this.extractArrayMetadata(clazz.learnings);
        });
    }
  };
})();
