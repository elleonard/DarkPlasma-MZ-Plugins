import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/08",
    version: "1.0.1",
    description: "configをTypeScript移行",
  },
  {
    date: "2023/06/16",
    version: "1.0.0",
    description: '公開',
  }
];

export const config = new ConfigDefinitionBuilder(
  "RegenerateByValueTrait",
  2026,
  "HP再生値 MP再生値特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2"
  })
  .withHelp(dedent`HP再生値、MP再生値特徴を定義します。
      再生値特徴は再生率と異なり、HPやMPの上限値に対する割合ではなく、
      値によってターン経過時に回復・スリップダメージを受けます。
      
      設定例:
      <hpRegenerationValue:10>
      HPを毎ターン10回復する特徴を追加します。

      <mpRegenerationValue:-10>
      MPを毎ターン10消費する特徴を追加します。

      特徴による回復量を動的に変動させたい場合は、
      カスタムIDを定義した上で追加のプラグインを書いてください。

      <hpRegenerationCustomId:1>
      <mpRegenerationCustomId:1>

      追加プラグインの書き方の例については、
      DarkPlasma_RegenerateByValueTraitCustomSample
      を参照してください。`)
  .build();
