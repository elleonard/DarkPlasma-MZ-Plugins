import { createNumberParam, createStruct, } from '../../../modules/config/createParameter.js';

export const structRectangle = createStruct("Rectangle", [
  createNumberParam("x", {
    text: "X座標",
  }),
  createNumberParam("y", {
    text: "Y座標",
  }),
  createNumberParam("width", {
    text: "幅",
  }),
  createNumberParam("height", {
    text: "高さ",
  }),
]);

