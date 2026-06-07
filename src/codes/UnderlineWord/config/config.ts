import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createStruct, createStringParam, createColorParam, createStringArrayParam, createStructArrayParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/07",
    version: "1.0.0",
    description: "公開",
  }
];

const structUnderlineGroup = createStruct(
  "UnderlineGroup",
  [
    createStringParam(
      "title",
      {
        text: "名前",
        description: "設定の管理用の名前を指定します。わかりやすい名前をつけてください。",
      }
    ),
    createColorParam(
      "color",
      {
        text: "下線色",
        description: "下線の色を指定します。#から始まるカラーコードも指定可能です。",
      }
    ),
    createNumberParam(
      "lineWidth",
      {
        text: "下線の太さ",
        description: "下線の太さをピクセル数で指定します。",
        min: 1,
        max: 10,
        default: 2,
      }
    ),
    createStringArrayParam(
      "texts",
      {
        text: "語句",
        description: "下線を引きたい語句を指定します。",
      }
    ),
  ]
);

const parameters = [
  createStructArrayParam(
    "underlineGroups",
    {
      struct: structUnderlineGroup,
      text: "語句と下線設定",
      description: "下線を引く語句と下線の色・太さを設定します。",
    }
  ),
  createStringArrayParam(
    "targetWindows",
    {
      text: "対象ウィンドウ",
      description: "自動下線の対象となるウィンドウクラスを指定します。",
      default: ["Window_Message"],
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "UnderlineWord",
  2026,
  "指定した語句に下線を引く"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withStructure(structUnderlineGroup)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_DrawLine",
    version: "1.0.0",
  })
  .withHelp(dedent`指定した語句に下線を自動で描画します。

    プラグインパラメータで語句と下線の色・太さを設定してください。
    指定したウィンドウで表示されるテキスト内の語句に下線が描画されます。

    drawTextEx方式（メッセージウィンドウなど）の部分一致に対応しています。`)
  .build();
