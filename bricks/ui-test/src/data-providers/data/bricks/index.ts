import { basicBricks } from "./basic-bricks";
import { presentationalBricks } from "./presentational-bricks";
import { formsBricks } from "./forms";
import { containerBricks } from "./container-bricks";
import { BrickCommandConf } from "./interfaces.js";

export const brickCommandsConf: BrickCommandConf[] = [
  ...basicBricks,
  ...presentationalBricks,
  ...formsBricks,
  ...containerBricks,
];
