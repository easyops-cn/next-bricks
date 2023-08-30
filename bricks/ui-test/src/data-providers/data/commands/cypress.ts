import { CommandDoc } from "../../../interface.js";
import getCypressActionCommands from "./cypress/actions.js";
import getCypressAssertionCommands from "./cypress/assertions.js";
import getCypressOtherCommands from "./cypress/others.js";
import getCypressQueryCommands from "./cypress/queries.js";

export default function getCypressCommands(): CommandDoc[] {
  return [
    ...getCypressQueryCommands(),
    ...getCypressActionCommands(),
    ...getCypressAssertionCommands(),
    ...getCypressOtherCommands(),
  ];
}
