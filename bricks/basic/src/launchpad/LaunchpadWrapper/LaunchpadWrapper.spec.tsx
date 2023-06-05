import React from "react";
import { render } from "@testing-library/react";
import { LaunchpadWrapper } from "./LaunchpadWrapper.js";

jest.mock("../Launchpad/Launchpad");

describe("LaunchpadWrapper", () => {
  it("should fade out when launchpad will close", async () => {
    const handleWillClose = jest.fn();
    const handleClose = jest.fn();
    const { container } = render(
      <LaunchpadWrapper onWillClose={handleWillClose} onClose={handleClose} />
    );
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div>Launchpad</div>"`);
  });
});
