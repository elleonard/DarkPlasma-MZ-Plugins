import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/02/23",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createStringParam("message", {
    text: "通知文",
    description: "通知する文章を設定します。{item}が成果物アイテムの名前に置換されます。",
    default: "{item}の素材が揃いました。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "NotifyWishList",
  2025,
  "ウィッシュリスト通知"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_StoreWishList",
    version: "1.0.0",
    order: 'after',
  })
  .withBaseDependency({
    name: "TorigoyaMZ_NotifyMessage",
    version: "1.6.1",
    order: 'after',
  })
  .withHelp(dedent`ウィッシュリストに登録したアイテムの
    素材が揃ったタイミングで通知を出します。
    
    最近通知されたアイテムには通知を出しません。
    最近通知されたアイテムからは、以下の条件で除外されます。
    - セーブデータをロードする
    - そのアイテムがウィッシュリストから外れる`)
  .build();
