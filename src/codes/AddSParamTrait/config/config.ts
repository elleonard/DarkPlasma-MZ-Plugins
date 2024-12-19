import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createNumberParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/12/19",
    version: "1.2.0",
    description: "複数の特徴を指定できる記法を追加",
  },
  {
    date: "2024/12/01",
    version: "1.1.0",
    description: "限界値設定を追加",
  },
  {
    date: "2024/11/04",
    version: "1.0.2",
    description: "加算ではなく乗算になってしまっていた不具合を修正",
  },
  {
    date: "2024/11/04",
    version: "1.0.1",
    description: "ParameterTextとの順序関係を明記",
  },
  {
    date: "2024/11/04",
    version: "1.0.0",
    description: "公開",
  }
];

const structLimitValue = createStruct("LimitValue", [
  createBooleanParam("enableUpperLimit", {
    text: "上限値を有効にする",
    description: "ONにすると上限値設定が有効になります。OFFにすると上限値なしとなります。",
    default: false,
  }),
  createNumberParam("upperLimit", {
    text: "上限値",
  }),
  createBooleanParam("enableLowerLimit", {
    text: "下限値を有効にする",
    description: "ONにすると下限値設定が有効になります。OFFにすると下限値なしとなります。",
    default: false,
  }),
  createNumberParam("lowerLimit", {
    text: "下限値",
  }),
]);

const structStatusLimit = createStruct("StatusLimit", [
  {
    param: "tgr",
    name: "狙われ率",
  },
  {
    param: "grd",
    name: "防御効果率",
  },
  {
    param: "rec",
    name: "回復効果率",
  },
  {
    param: "pha",
    name: "薬の知識",
  },
  {
    param: "mcr",
    name: "MP消費率",
  },
  {
    param: "tcr",
    name: "TPチャージ率",
  },
  {
    param: "pdr",
    name: "物理ダメージ率",
  },
  {
    param: "mdr",
    name: "魔法ダメージ率",
  },
  {
    param: "fdr",
    name: "床ダメージ率",
  },
  {
    param: "exr",
    name: "経験値獲得率",
  },
].map(x => createStructParam(x.param, {
  struct: structLimitValue,
  text: x.name,
  default: {
    enableUpperLimit: false,
    upperLimit: 999999,
    enableLowerLimit: true,
    lowerLimit: 0,
  },
})));

const parameters = [
  createStructParam("statusLimit", {
    struct: structStatusLimit,
    text: "限界値",
    description: "各ステータスの限界値を設定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "AddSParamTrait",
  2024,
  "特殊能力値を加算する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structLimitValue)
  .withStructure(structStatusLimit)
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.0.0",
    order: "after",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_ParameterText",
    version: "1.0.5",
  })
  .withHelp(dedent`アクター、職業、装備、敵キャラ、ステートのメモ欄に指定の記述を行うことで
    特殊能力値を加算する特徴を追加します。
    エディタで指定できる乗算特徴を適用した後に、この設定値が加算されます。

    記述例:
    MP消費率+10％
    <addSParam:mcr:10>

    物理ダメージ率-10％
    <addSParam:pdr:-10>

    物理ダメージ率-10％, 魔法ダメージ率-10％
    <addSParam:
      pdr:-10
      mdr:-10
    >
    
    基本構文:
    <addSParam:[param]:[value]>
    
    [param]:
      tgr: 狙われ率
      grd: 防御効果率
      rec: 回復効果率
      pha: 薬の知識
      mcr: MP消費率
      tcr: TPチャージ率
      pdr: 物理ダメージ率
      mdr: 魔法ダメージ率
      fdr: 床ダメージ率
      exr: 経験値獲得率`)
  .build();
