import React from "react";
import { render } from "@testing-library/react";
import { LaunchpadPortal } from "./LaunchpadPortal.js";

jest.mock("../LaunchpadWrapper/LaunchpadWrapper.js", () => ({
  LaunchpadWrapper: () => (
    <div className="mock-launchpad-wrapper">Hello world</div>
  ),
}));

jest.mock("../LaunchpadService.js");
describe("LaunchpadPortal", () => {
  it("should work", () => {
    render(<LaunchpadPortal visible={false} />);
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        <div />
        <div />
      </body>
    `);

    render(<LaunchpadPortal visible={true} />);
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        <div />
        <div />
        <div />
        <div>
          <div
            class="mock-launchpad-wrapper"
          >
            Hello world
          </div>
        </div>
      </body>
    `);
  });
});
