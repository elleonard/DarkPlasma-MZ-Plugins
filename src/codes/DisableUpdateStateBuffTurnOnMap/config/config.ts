import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/04/18",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DisableUpdateStateBuffTurnOnMap",
  2025,
  "マップ上でのステート・強化・弱体のターン数経過を無効にする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`マップ上でステート・強化・弱体のターンが経過しないようにします。`)
  .build();
