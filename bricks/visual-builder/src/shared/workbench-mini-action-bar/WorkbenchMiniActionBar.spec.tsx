import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { WorkbenchTreeAction } from "../../interfaces.js";
import { WorkbenchMiniActionBar } from "./WorkbenchMiniActionBar.js";

test("WorkbenchMiniActionBar with no actions", () => {
  const { container } = render(<WorkbenchMiniActionBar />);
  expect(container.children.length).toBe(0);
});

test("WorkbenchMiniActionBar with actions", () => {
  const onActionClick = jest.fn();
  const actions = [
    {
      action: "add",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "plus",
      },
    },
    {
      action: "delete",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "minus",
      },
      if: "<% DATA.type === 'testing' %>",
    },
    {
      action: "move-up",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "arrow-up",
      },
      if: "<% DATA.type !== 'testing' %>",
    },
  ];
  render(
    <WorkbenchMiniActionBar
      data={{ type: "production" }}
      actions={actions as WorkbenchTreeAction[]}
      onActionClick={onActionClick}
    />
  );

  expect(screen.getAllByRole("button").length).toBe(2);

  expect(onActionClick).toBeCalledTimes(0);
  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(onActionClick).toHaveBeenNthCalledWith(1, {
    action: "add",
    data: { type: "production" },
  });

  expect(onActionClick).toBeCalledTimes(1);
  fireEvent.click(screen.getAllByRole("button")[1]);
  expect(onActionClick).toHaveBeenNthCalledWith(2, {
    action: "move-up",
    data: { type: "production" },
  });

  fireEvent.mouseDown(screen.getAllByRole("button")[0]);
});

test("WorkbenchMiniActionBar with actions for moving first node", () => {
  const onActionClick = jest.fn();
  const actions = [
    {
      action: "move-up",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "arrow-up",
      },
    },
    {
      action: "move-down",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "arrow-down",
      },
    },
  ];
  render(
    <WorkbenchMiniActionBar
      data={{ type: "production" }}
      actions={actions as WorkbenchTreeAction[]}
      onActionClick={onActionClick}
      isFirst
    />
  );

  expect(screen.getAllByRole("button")[0].classList.contains("disabled")).toBe(
    true
  );
  expect(screen.getAllByRole("button")[1].classList.contains("disabled")).toBe(
    false
  );

  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(onActionClick).toBeCalledTimes(0);

  fireEvent.click(screen.getAllByRole("button")[1]);
  expect(onActionClick).toBeCalledTimes(1);
});

test("WorkbenchMiniActionBar with actions for moving last node", () => {
  const onActionClick = jest.fn();
  const actions = [
    {
      action: "move-up",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "arrow-up",
      },
    },
    {
      action: "move-down",
      icon: {
        lib: "antd",
        theme: "outlined",
        icon: "arrow-down",
      },
    },
  ];
  render(
    <WorkbenchMiniActionBar
      data={{ type: "production" }}
      onActionClick={onActionClick}
      actions={actions as WorkbenchTreeAction[]}
      isLast
    />
  );

  expect(screen.getAllByRole("button")[0].classList.contains("disabled")).toBe(
    false
  );
  expect(screen.getAllByRole("button")[1].classList.contains("disabled")).toBe(
    true
  );

  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(onActionClick).toBeCalledTimes(1);

  fireEvent.click(screen.getAllByRole("button")[1]);
  expect(onActionClick).toBeCalledTimes(1);
});

test("WorkbenchMiniActionBar with hidden actions", () => {
  render(
    <WorkbenchMiniActionBar
      actions={[
        {
          action: "add",
          icon: {
            lib: "antd",
            theme: "outlined",
            icon: "plus",
          },
        },
      ]}
      actionsHidden={true}
    />
  );
  expect(screen.queryByRole("button")).toBe(null);
});
