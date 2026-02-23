import { createFileParam, createNumberParam, createStruct } from "../createParameter.js";

export const structBgm = createStruct("Bgm", [
  createFileParam("name", {
    text: "BGMファイル",
    dir: "audio/bgm",
  }),
  createNumberParam("volume", {
    text: "音量",
    default: 90,
    max: 100,
    min: 0,
  }),
  createNumberParam("pitch", {
    text: "ピッチ",
    default: 100,
    max: 150,
    min: 50,
  }),
  createNumberParam("pan", {
    text: "位相",
    max: 100,
    min: -100,
  }),
]);