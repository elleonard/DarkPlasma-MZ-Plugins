import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';
import { structSe } from '../../../../modules/config/struct/Se.js';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/29",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters: PluginParameterSchema[] = [
  createStructParam("se", {
    struct: structSe,
    text: "SE",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "PreemptiveSkillTrait",
  2025,
  "戦闘開始時にスキルを発動する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structSe)
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withHelp(dedent`戦闘開始時にスキルを発動する特徴を設定します。
    <preemptiveSkill:
      skill:スキルID rate:発動確率（％）
    >
    
    例: 戦闘開始時に100％の確率で防御します。
    <preemptiveSkill:
      skill:2 rate:100
    >
      
    先制攻撃される場合、この特徴のスキルは発動しません。
    
    本プラグインはタイムプログレスバトルをサポートしません。`)
  .build();
