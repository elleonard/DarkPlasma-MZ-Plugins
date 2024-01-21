import { PluginConfigSchema } from '../../../../modules/config/configSchema.js';
import { createDatabaseParam, createNumberParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const structRGBColor = createStruct(
  "Color",
  [
    createNumberParam("red", {
      text: "赤",
      default: 255,
      max: 255,
      min: 0,
    }),
    createNumberParam("green", {
      text: "緑",
      default: 255,
      max: 255,
      min: 0,
    }),
    createNumberParam("blue", {
      text: "青",
      default: 255,
      max: 255,
      min: 0,
    }),
  ]
);

export const config: PluginConfigSchema = {
  name: "DarkPlasma_DarkMap",
  year: 2021,
  license: "MIT",
  histories: [
    {
      date: "2024/01/21",
      version: "2.0.0",
      description: "暗闇の色をRGBすべてについて設定可能に",
    },
    {
      description: "デフォルトの明かりの広さを変数で設定可能に",
    },
    {
      date: "2024/01/15",
      version: "1.0.3",
      description: "ビルド方式を変更 (configをTypeScript化)",
    },
    {
      date: "2022/08/19",
      version: "1.0.2",
      description: "typescript移行",
    },
    {
      date: "2022/03/31",
      version: "1.0.1",
      description: "TemplateEvent.jsと併用すると戦闘テストできない不具合を修正"
    },
    {
      date: "2021/11/19",
      version: "1.0.0",
      description: "公開"
    },
  ],
  locates: ['ja'],
  plugindesc: "暗いマップと明かり",
  parameters: [
    createStructParam('darknessColor', {
      struct: structRGBColor,
      text: "暗闇の色",
      default: {
        red: 0,
        green: 0,
        blue: 0,
      },
    }),
    createStructParam('lightColor', {
      struct: structRGBColor,
      text: '明かりの色',
      default: {
        red: 255,
        green: 255,
        blue: 255,
      },
    }),
    createNumberParam('lightRadius', {
      text: "明かりの広さ",
      description: "デフォルトの明かりの広さを設定します。",
      default: 200,
    }),
    createDatabaseParam('lightRadiusVariable', {
      type: "variable",
      text: "明かりの広さ(変数)",
      description: "デフォルトの明かりの広さを変数で設定します。",
      default: 0,
    }),
  ],
  commands: [],
  structures: [
    structRGBColor,
  ],
  dependencies: {
    base: [],
    orderAfter: [],
    orderBefore: [],
  },
  help: dedent`暗いマップと、プレイヤーやイベントの周囲を照らす明かりを提供します。

  マップのメモ欄:
  <dark> 暗いマップにします。

  イベントのメモ欄:
  <light> イベントの周囲を照らします。
  <lightColor:#ffbb73> 明かりの色を設定します。
  <lightRadius:155> 明かりの範囲を設定します。
`,
};
