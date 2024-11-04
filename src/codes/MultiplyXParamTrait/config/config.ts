import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/11/04",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "MultiplyXParamTrait",
  2024,
  "追加能力値を乗算する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitDataId",
    version: "1.0.0",
    order: "after",
  })
  .withHelp(dedent`アクター、職業、装備、敵キャラ、ステートのメモ欄に指定の記述を行うことで
    追加能力値を乗算する特徴を追加します。
    エディタで指定できる加算特徴を適用した後に、この倍率が適用されます。

    記述例:
    回避率半減
    <multiplyXParam:eva:50>

    HP再生率2倍
    <multiplyXParam:hrg:200>
    
    基本構文:
    <multiplyXParam:[param]:[value]>
    
    [param]:
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
    `)
  .build();
