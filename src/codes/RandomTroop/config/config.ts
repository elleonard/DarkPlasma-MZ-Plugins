import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createCommand, createDatabaseArrayParam, createNumberParam, createStringParam, createStruct, createStructArrayParam, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/02/18",
    version: "1.2.1",
    description: "変数の命名を修正",
  },
  {
    version: "1.2.0",
    description: "抽選枠の追加フィルタ用拡張インターフェースを追加",
  },
  {
    date: "2026/02/17",
    version: "1.1.1",
    description: "configをTypeScript移行",
  },
  {
    date: "2024/12/19",
    version: "1.1.0",
    description: '種別による敵キャラデータ一覧取得インターフェース追加',
  },
  {
    date: "2023/10/24",
    version: "1.0.2",
    description: 'ランダム出現フラグのキャッシュが戦闘ごとにクリアされない不具合を修正',
  },
  {
    version: "1.0.1",
    description: 'DarkPlasma_EnemyBookとの依存関係を明記',
  },
  {
    date: "2023/08/21",
    version: "1.0.0",
    description: '公開',
  },
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("autoPositionWidth", {
    text: {
      ja: "自動配置横幅",
      en: "auto position width",
    },
    description: {
      ja: "自動配置の際、前後に動かす際の横幅の閾値を設定します。敵キャラ画像の横幅合計がこれより大きい場合、敵配置を前後にバラけさせます。",
      en: "If sum of enemy image width is larger than this value, set enemy position front and back.",
    },
    default: 816,
  }),
  createStringParam("enemyTypeTag", {
    text: "敵種別タグ",
    description: "敵種別を判定するためのメモタグ名を指定します。",
    default: "enemyType",
  }),
];

/**
 * 互換性のために名前は維持するが、命名は良くない。
 * 本来は抽選枠設定なので、RandomTroopSpotなどとすべき
 */
const structRandomTroopEnemy: PluginStruct = createStruct("RandomTroopEnemy", [
  createStringParam("name", {
    text: "抽選枠名(省略可)",
    description: "抽選枠の名前を指定します。挙動には影響しません。管理しやすい名前をつけてください。",
  }),
  createDatabaseArrayParam("enemyIds", {
    type: 'enemy',
    text: "敵キャラリスト",
    description: "抽選枠に指定した敵キャラを追加します。",
  }),
  createStringParam("tag", {
    text: "敵種別",
    description: "抽選枠に指定した敵種別メモタグを記述した敵キャラを追加します。",
  }),
  createNumberParam("rate", {
    text: "抽選確率（％）",
    description: "この抽選枠が出現する確率を指定します。",
    min: 0,
    max: 100,
    default: 100,
  }),
]);

const commandRandomTroop = createCommand("randomTroop", {
  text: "ランダム構成設定",
  description: "敵グループバトルイベントの1ページ目で使用すると、遭遇時にグループ構成をランダムに決定します。",
  args: [
    createStructArrayParam("troop", {
      struct: structRandomTroopEnemy,
      text: "抽選枠設定",
      description: "任意の数の抽選枠を設定します。",
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "RandomTroop",
  2026,
  "敵グループ構成のランダム化"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structRandomTroopEnemy)
  .withParameters(parameters)
  .withCommand(commandRandomTroop)
  .withOrderBeforeDependency({
    name: "DarkPlasma_EnemyBook",
  })
  .withHelp(dedent`敵グループのバトルイベント設定
      1ページ目でプラグインコマンドを設定することにより、
      設定内容に応じて遭遇時に敵グループの構成をランダムに決定します。

      抽選枠を任意の数指定することができ、指定した数だけ出現判定を行います。
      ある抽選枠が出現する判定となった場合、
      その抽選枠に含まれる敵キャラリストの中から
      ランダムで1体の敵キャラが出現します。

      敵種別を敵キャラのメモ欄で指定し、
      その種別を抽選枠に追加することも可能です。
      敵種別のメモタグはデフォルト設定では enemyType となっています。

      例:
      <enemyType:スライム族LV1>

      種別はカンマ区切りで複数指定することも可能です。
      <enemyType:スライム族LV1,スライム族LV2>`)
  .build();
