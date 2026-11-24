import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/11/24",
    version: "1.0.1",
    description: "設定値をTypeScript移行",
  },
  {
    description: "Game_Party#gainItemの型定義変更に追従",
  },
  {
    date: '2023/04/16',
    version: '1.0.0',
    description: '公開',
  },
];

export const config = new ConfigDefinitionBuilder(
  'AutoStoreItemToStorage',
  2023,
  '溢れたアイテムを自動で倉庫に送る'
)
  .withHistories(histories)
  .withLicense('MIT')
  .withBaseDependency({
    name: 'DarkPlasma_ItemStorage',
    version: '1.3.1',
  })
  .withHelp(dedent`入手するアイテムのうち、
    所持限界を超える数を自動で倉庫に送ります。`)
  .build();
