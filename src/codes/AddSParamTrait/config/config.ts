import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/21",
    version: "2.0.0",
    description: "限界値設定をDarkPlasma_LimitSParamに分離",
  },
  {
    description: "特殊能力値追加プラグイン用にインターフェース追加",
  },
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

export const config = new ConfigDefinitionBuilder(
  "AddSParamTrait",
  2024,
  "特殊能力値を加算する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.0.0",
    order: "after",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_ParameterText",
    version: "1.0.5",
  })
  .withOrderBeforeDependency({
    name: "DarkPlasma_LimitSParam",
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
