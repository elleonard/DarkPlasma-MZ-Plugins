import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/06",
    version: "1.0.3",
    description: "TypeScript移行",
  },
  {
    date: '2021/07/05',
    version: '1.0.2',
    description: 'MZ 1.3.2に対応',
  },
  {
    date: '2021/06/22',
    version: '1.0.1',
    description: 'サブフォルダからの読み込みに対応',
  },
  {
    date: '2020/09/10',
    version: '1.0.0',
    description: '公開',
  },
];

export const config = new ConfigDefinitionBuilder(
  "AlwaysCritical",
  2026,
  "常時クリティカルが出る行動"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`スキル/アイテムのメモ欄に<alwaysCritical>と書くと、
      そのスキルが常にクリティカルヒットします。`)
  .build();
