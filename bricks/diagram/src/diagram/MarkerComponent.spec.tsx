import React from "react";
import { describe, test, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { MarkerComponent } from "./MarkerComponent";

describe("MarkerComponent", () => {
  test("default arrow marker", () => {
    const { container } = render(
      <svg>
        <MarkerComponent type="arrow" id="marker-1" strokeColor="gray" />
      </svg>
    );
    expect(container.querySelector("marker")).toMatchInlineSnapshot(`
      <marker
        id="marker-1"
        markerHeight="6"
        markerWidth="6"
        orient="auto-start-reverse"
        refX="5"
        refY="3"
        stroke-linejoin="round"
        viewBox="0 0 6 6"
      >
        <path
          d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
          fill="gray"
          stroke="gray"
          stroke-width="1"
        />
      </marker>
    `);
  });

  test("entity relation diagram zero or one marker", () => {
    const { container } = render(
      <svg>
        <MarkerComponent type="0..1" id="marker-1" strokeColor="red" />
      </svg>
    );
    expect(container.querySelector("marker")).toMatchInlineSnapshot(`
      <marker
        id="marker-1"
        markerHeight="11"
        markerWidth="21"
        orient="auto-start-reverse"
        refX="20.5"
        refY="5.5"
        viewBox="0 0 21 11"
      >
        <path
          d="M 5.5 5.5 m 5 0 a 5 5 0 1 0 -10 0 a 5 5 0 1 0 10 0 M 15.5 0.5 V 10.5"
          fill="none"
          stroke="red"
          stroke-width="1"
        />
      </marker>
    `);
  });

  test("entity relation diagram zero or many marker", () => {
    const { container } = render(
      <svg>
        <MarkerComponent type="0..N" id="marker-1" strokeColor="blue" />
      </svg>
    );
    expect(container.querySelector("marker")).toMatchInlineSnapshot(`
      <marker
        id="marker-1"
        markerHeight="11"
        markerWidth="21"
        orient="auto-start-reverse"
        refX="20.5"
        refY="5.5"
        viewBox="0 0 21 11"
      >
        <path
          d="M 5.5 5.5 m 5 0 a 5 5 0 1 0 -10 0 a 5 5 0 1 0 10 0 M 20.5 0.5 L 10.5 5.5 L 20.5 10.5"
          fill="none"
          stroke="blue"
          stroke-width="1"
        />
      </marker>
    `);
  });
});
