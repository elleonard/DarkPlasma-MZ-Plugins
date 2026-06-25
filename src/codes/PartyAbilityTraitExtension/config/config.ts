import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/25",
    version: "2.1.2",
    description: "FilterEquipがないとエラーで止まってしまう不具合を修正",
  },
  {
    version: "2.1.1",
    description: "パースエラーをわかりやすく表示するように変更",
  },
  {
    version: "2.1.0",
    description: "全特徴をuniqueTraitIdCacheで確保するように変更",
  },
  {
    description: "ステート有効度乗算、ステート有効度加算を追加",
  },
  {
    description: "正常に動作しない不具合を修正",
  },
  {
    date: "2026/06/24",
    version: "2.0.0",
    description: "configをTypeScript移行",
  },
  {
    description: "旧形式の記述サポートを終了",
  },
  {
    description: "特徴の展開を遅延評価に変更",
  },
  {
    description: "属性有効度乗算、属性有効度加算を追加",
  },
  {
    date: "2024/11/05",
    version: "1.2.3",
    description: "通常能力値乗算が効かない不具合を修正",
  },
  {
    description: "競合により特殊能力値加算、追加能力値乗算が効かない不具合を修正",
  },
  {
    description: "AddSParamTrait、MultiplyXParamTraitとの順序を明示",
  },
  {
    date: "2024/11/04",
    version: "1.2.2",
    description: "旧形式の記述で特殊能力値乗算が100倍になる不具合を修正",
  },
  {
    version: "1.2.1",
    description: "特殊能力値乗算が正常に働かない不具合を修正",
  },
  {
    version: "1.2.0",
    description: "メモ欄の記法を一新",
  },
  {
    description: "通常能力値乗算、特殊能力値加算、追加能力値に対応",
  },
  {
    date: "2024/03/17",
    version: "1.1.2",
    description: "TypeScript移行",
  },
  {
    date: "2022/05/08",
    version: "1.1.1",
    description: "乗算系能力を1％以上100％未満にできない不具合を修正",
  },
  {
    date: "2021/08/24",
    version: "1.1.0",
    description: "装備絞り込みプラグインに対応",
  },
  {
    date: "2021/07/05",
    version: "1.0.1",
    description: "MZ 1.3.2に対応",
  },
  {
    date: "2021/06/27",
    version: "1.0.0",
    description: "公開",
  },
];

export const config = new ConfigDefinitionBuilder(
  "PartyAbilityTraitExtension",
  2021,
  "パーティ能力特徴を追加する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_MultiplyXParamTrait",
    version: "1.0.1",
    order: 'after',
  })
  .withBaseDependency({
    name: "DarkPlasma_AddSParamTrait",
    version: "1.0.2",
    order: 'after',
  })
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.3",
    order: 'after',
  })
  .withBaseDependency({
    name: "DarkPlasma_LazyExtractData",
    version: "1.0.0",
    order: 'after',
  })
  .withOrderAfterDependency({ name: "DarkPlasma_FilterEquip" })
  .withHelp(dedent`パーティ能力特徴を追加します。
    アクター/職業/装備/ステートのメモ欄に指定の記述を行うことで、
    パーティ全体に効果を及ぼす特徴を付与できます。

    基本構文:
    <partyAbility:[trait]:[data]:[value]>
    パーティ全体に[trait]で指定した特徴を、
    特徴データ[data], 効果量[value]で付与します。

    記述例
    最大HP+10:
    <partyAbility:paramPlus:mhp:10>

    会心率+20:
    <partyAbility:xparamPlus:cri:20>

    床ダメージ率*0:
    <partyAbility:sparamRate:fdr:0>

    火属性有効度*110％:
    <partyAbility:elementRate:火:110>

    ステートID4有効度+20％:
    <partyAbility:stateRatePlus:4:20>

    上記すべてを設定する
    <partyAbility:
      paramPlus:mhp:10
      xparamPlus:cri:20
      sparamRate:fdr:0
      elementRate:火:110
      stateRatePlus:4:20
    >

    [trait]:
      paramPlus: パラメータ加算
      paramRate: パラメータ乗算
      xparamPlus: 追加能力値加算(※1)
      xparamRate: 追加能力値乗算
      sparamPlus: 特殊能力値加算
      sparamRate: 特殊能力値乗算(※2)
      elementRate: 属性有効度乗算
      elementRatePlus: 属性有効度加算(※3)
      stateRate: ステート有効度乗算
      stateRatePlus: ステート有効度加算(※4)

    param系特徴の[data]:
      mhp: 最大HP
      mmp: 最大MP
      atk: 攻撃力
      def: 防御力
      mat: 魔法攻撃力
      mdf: 魔法防御力
      agi: 敏捷性
      luk: 運

    xparam系特徴の[data]:
      hit: 命中率
      eva: 回避率
      cri: 会心率
      cev: 会心回避率
      mev: 魔法回避率
      mrf: 魔法反射率
      cnt: 反撃率
      hrg: HP再生率
      mrg: MP再生率
      trg: TP再生率

    sparam系特徴の[data]:
      tgr: 狙われ率
      grd: 防御効果率
      rec: 回復効果率
      pha: 薬の知識
      mcr: MP消費率
      tcr: TPチャージ率
      pdr: 物理ダメージ率
      mdr: 魔法ダメージ率
      fdr: 床ダメージ率
      exr: 経験値獲得率

    ※1: 追加能力値加算
    パーティ能力による加算は乗算の対象外になります。

    ※2: 特殊能力値乗算
    パーティ能力による乗算は加算の後に行います。
    
    ※3: 属性有効度加算
    パーティ能力による加算は乗算の対象外になります。
    
    ※4: ステート有効度加算
    パーティ能力による加算は乗算の対象外になります。`)
  .build();
