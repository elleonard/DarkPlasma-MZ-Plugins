import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createStruct, createStructParam, createStringParam, createColorParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/25",
    version: "1.5.2",
    description: "configをTypeScript移行",
  },
  {
    date: "2025/08/23",
    version: "1.5.1",
    description: "不要な依存の記述を削除",
  },
  {
    date: "2025/01/31",
    version: "1.5.0",
    description: "同名の特徴をマージする",
  },
  {
    date: "2024/11/04",
    version: "1.4.0",
    description: "同名の特徴データをマージする",
  },
  {
    date: "2024/03/02",
    version: "1.3.0",
    description: "特殊フラグのフラグ名を表示",
  },
  {
    date: "2023/05/21",
    version: "1.2.0",
    description: "絞り込み操作のキーを追加",
  },
  {
    description: "色設定のパラメータの型を変更",
  },
  {
    date: "2022/09/10",
    version: "1.1.1",
    description: "typescript移行",
  },
  {
    date: "2022/05/28",
    version: "1.1.0",
    description: "独自特徴IDの仕組みをDarkPlasma_AllocateUniqueTraitIdに分離",
  },
  {
    date: "2022/02/06",
    version: "1.0.0",
    description: "正式版公開",
  },
  {
    description: "依存関係にDarkPlasma_CustomKeyHandlerを追加",
  },
  {
    date: "2021/09/05",
    version: "0.0.5",
    description: "独自特徴を定義する機能を追加",
  },
  {
    date: "2021/08/28",
    version: "0.0.4",
    description: "装備選択キャンセル時に絞り込みを解除する, 効果選択時にshiftで絞り込みウィンドウを閉じる",
  },
  {
    date: "2021/08/26",
    version: "0.0.3",
    description: "スクロールできていない不具合を修正",
  },
  {
    date: "2021/08/25",
    version: "0.0.2",
    description: "絞り込み有効化時に装備リストウィンドウを最上部までスクロール",
  },
  {
    date: "2021/08/24",
    version: "0.0.1",
    description: "試作公開",
  },
];

const structTraitName = createStruct("TraitName", [
  createStringParam("elementRate", {
    text: "属性有効度の特徴名",
    description: "絞り込み画面で表示する属性有効度の特徴名を設定します。",
    default: "属性耐性",
  }),
  createStringParam("debuffRate", {
    text: "弱体有効度の特徴名",
    description: "絞り込み画面で表示する弱体有効度の特徴名を設定します。",
    default: "弱体耐性",
  }),
  createStringParam("stateRate", {
    text: "ステート有効度の特徴名",
    description: "絞り込み画面で表示するステート有効度の特徴名を設定します。",
    default: "ステート耐性",
  }),
  createStringParam("stateResist", {
    text: "ステート無効の特徴名",
    description: "絞り込み画面で表示するステート無効の特徴名を設定します。",
    default: "ステート無効",
  }),
  createStringParam("xparam", {
    text: "追加能力値の特徴名",
    description: "絞り込み画面で表示する追加能力値の特徴名を設定します。",
    default: "追加能力値",
  }),
  createStringParam("sparam", {
    text: "特殊能力値の特徴名",
    description: "絞り込み画面で表示する特殊能力値の特徴名を設定します。",
    default: "特殊能力値",
  }),
  createStringParam("attackElement", {
    text: "攻撃時属性の特徴名",
    description: "絞り込み画面で表示する攻撃時属性の特徴名を設定します。",
    default: "攻撃時属性",
  }),
  createStringParam("attackState", {
    text: "攻撃時ステートの特徴名",
    description: "絞り込み画面で表示する攻撃時ステートの特徴名を設定します。",
    default: "攻撃時ステート",
  }),
  createStringParam("attackSpeed", {
    text: "攻撃速度補正の特徴名",
    description: "絞り込み画面で表示する攻撃速度補正の特徴名を設定します。",
    default: "攻撃速度補正",
  }),
  createStringParam("attackTimes", {
    text: "攻撃追加回数の特徴名",
    description: "絞り込み画面で表示する攻撃追加回数の特徴名を設定します。",
    default: "攻撃追加回数",
  }),
  createStringParam("attackSkill", {
    text: "攻撃スキルの特徴名",
    description: "絞り込み画面で表示する攻撃スキルの特徴名を設定します。",
    default: "攻撃スキル",
  }),
  createStringParam("stypeAdd", {
    text: "スキルタイプ追加の特徴名",
    description: "絞り込み画面で表示するスキルタイプ追加の特徴名を設定します。",
    default: "スキルタイプ追加",
  }),
  createStringParam("stypeSeal", {
    text: "スキルタイプ封印の特徴名",
    description: "絞り込み画面で表示するスキルタイプ封印の特徴名を設定します。",
    default: "スキルタイプ封印",
  }),
  createStringParam("skillAdd", {
    text: "スキル追加の特徴名",
    description: "絞り込み画面で表示するスキル追加の特徴名を設定します。",
    default: "スキル追加",
  }),
  createStringParam("skillSeal", {
    text: "スキル封印の特徴名",
    description: "絞り込み画面で表示するスキル封印の特徴名を設定します。",
    default: "スキル封印",
  }),
  createStringParam("equipWtype", {
    text: "武器タイプ装備の特徴名",
    description: "絞り込み画面で表示する武器タイプ装備の特徴名を設定します。",
    default: "武器タイプ装備",
  }),
  createStringParam("equipAtype", {
    text: "防具タイプ装備の特徴名",
    description: "絞り込み画面で表示する防具タイプ装備の特徴名を設定します。",
    default: "防具タイプ装備",
  }),
  createStringParam("equipLock", {
    text: "装備固定の特徴名",
    description: "絞り込み画面で表示する装備固定の特徴名を設定します。",
    default: "装備固定",
  }),
  createStringParam("equipSeal", {
    text: "装備封印の特徴名",
    description: "絞り込み画面で表示する装備封印の特徴名を設定します。",
    default: "装備封印",
  }),
  createStringParam("slotType", {
    text: "スロットタイプの特徴名",
    description: "絞り込み画面で表示するスロットタイプの特徴名を設定します。",
    default: "スロットタイプ",
  }),
  createStringParam("actionPlus", {
    text: "行動回数追加の特徴名",
    description: "絞り込み画面で表示する行動回数追加の特徴名を設定します。",
    default: "行動回数追加",
  }),
  createStringParam("specialFlag", {
    text: "特殊フラグの特徴名",
    description: "絞り込み画面で表示する特殊フラグの特徴名を設定します。",
    default: "特殊フラグ",
  }),
  createStringParam("partyAbility", {
    text: "パーティ能力の特徴名",
    description: "絞り込み画面で表示するパーティ能力の特徴名を設定します。",
    default: "パーティ能力",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructParam("traitName", {
    struct: structTraitName,
    text: "特徴名",
    description: "絞り込み画面で表示する特殊能力値の特徴名を設定します。",
    default: {
      elementRate: "属性耐性",
      debuffRate: "弱体耐性",
      stateRate: "ステート耐性",
      stateResist: "ステート無効",
      xparam: "追加能力値",
      sparam: "特殊能力値",
      attackElement: "攻撃時属性",
      attackState: "攻撃時ステート",
      attackSpeed: "攻撃速度補正",
      attackTimes: "攻撃追加回数",
      attackSkill: "攻撃スキル",
      stypeAdd: "スキルタイプ追加",
      stypeSeal: "スキルタイプ封印",
      skillAdd: "スキル追加",
      skillSeal: "スキル封印",
      equipWtype: "武器タイプ装備",
      equipAtype: "防具タイプ装備",
      equipLock: "装備固定",
      equipSeal: "装備封印",
      slotType: "スロットタイプ",
      actionPlus: "行動回数追加",
      specialFlag: "特殊フラグ",
      partyAbility: "パーティ能力",
    },
  }),
  createColorParam("selectedItemColor", {
    text: "絞り込み色",
    description: "絞り込みONの項目の色を設定します。",
    default: 2,
  }),
  createSelectParam("key", {
    text: "絞り込みキー",
    description: "絞り込み操作を行うためのキーを設定します。",
    options: [
      { name: "shift" },
      { name: "menu" },
      { name: "tab" },
      { name: "control" },
    ],
    default: "shift",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "FilterEquip",
  2021,
  "装備絞り込み機能"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structTraitName)
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_ParameterText",
    version: "1.0.4",
  })
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "1.3.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.0",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_CustomKeyHandler",
  })
  .withOrderBeforeDependency({
    name: "DarkPlasma_PartyAbilityTraitExtension",
    version: "1.1.0",
  })
  .withOrderBeforeDependency({
    name: "DarkPlasma_FilterEquip_RecentlyGained",
    version: "1.0.0",
  })
  .withOrderBeforeDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.0.0",
  })
  .withHelp(dedent`装備の特徴による絞り込み機能を提供します。

    装備選択中にshiftキーを押すことで絞り込みモードを開始します。

    外部プラグイン用インターフェース
    Scene_Equip.prototype.equipFilterTraitWindowRect: () => Rectangle
      絞り込み用の特徴表示ウィンドウの矩形

    Scene_Equip.prototype.equipFilterEffectWindowRect: () => Rectangle
      絞り込み用の効果表示ウィンドウの矩形

    Scene_Equip.prototype.equipFilterBuilder: () => EquipFilterBuilder
      絞り込み用データビルダー
      後述の絞り込み用データ生成のためのルール追加を行えます
      具体的な利用例は下記プラグインをご覧ください
       - DarkPlasma_FilterEquip_RecentlyGained

    EquipFilterBuilder.prototype.withEquipToTraitsRule
      : ((MZ.Weapon|MZ.Armor) => MZ.Trait[]) => EquipFilterBuilder
      装備から絞り込み用の特徴データを抽出するルールを追加する
      独自に定義した特徴を絞り込み対応したい場合に利用してください

    EquipFilterBuilder.prototype.withTraitToEffectNameRule
      : ((traitId: number, dataId: number) => string|null) => EquipFilterBuilder
      指定特徴ID,効果IDから効果名を返すルールを追加する
      独自に定義した効果を絞り込み対応したい場合に利用してください

    EquipFilterBuilder.prototype.withoutTrait: (number) => EquipFilterBuilder
      表示対象外とする特徴IDを指定する

    EquipFilterBuilder.prototype.withTrait: (number) => EquipFilterBuilder
      表示対象とする特徴IDを追加する
      独自に定義した特徴を絞り込み対応したい倍に利用してください`)
  .build();
