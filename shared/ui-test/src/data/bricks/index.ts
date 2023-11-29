import { basicBricks } from "./basic-bricks.js";
import { presentationalBricks } from "./presentational-bricks.js";
import { formsBricks } from "./forms.js";
import { containerBricks } from "./container-bricks.js";
import { BrickCommandConf } from "../../interfaces.js";

export const brickCommandsConf: BrickCommandConf[] = [
  ...basicBricks,
  ...presentationalBricks,
  ...formsBricks,
  ...containerBricks,
];
