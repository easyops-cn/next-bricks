import { requireModalStack } from "./require-modal-stack";

describe("requireModalStack", () => {
  it("should not be top initially", () => {
    const modalStack = requireModalStack();
    expect(modalStack.isTop()).toBe(false);
  });

  it("should be top after push", () => {
    const modalStack = requireModalStack();
    modalStack.push();
    expect(modalStack.isTop()).toBe(true);
  });

  it("should not be top after push and pull", () => {
    const modalStack = requireModalStack();
    modalStack.push();
    modalStack.pull();
    expect(modalStack.isTop()).toBe(false);
  });

  it("should handle multiple modal stacks correctly", () => {
    const modalStack1 = requireModalStack();
    const modalStack2 = requireModalStack();

    modalStack1.push();
    expect(modalStack1.isTop()).toBe(true);
    expect(modalStack2.isTop()).toBe(false);

    modalStack2.push();
    expect(modalStack1.isTop()).toBe(false);
    expect(modalStack2.isTop()).toBe(true);

    modalStack2.pull();
    expect(modalStack1.isTop()).toBe(true);
    expect(modalStack2.isTop()).toBe(false);
  });

  it("should ensure that push removes the existing instance from the stack", () => {
    const modalStack1 = requireModalStack();
    const modalStack2 = requireModalStack();

    modalStack1.push();
    modalStack2.push();
    modalStack1.push(); // Should reposition modalStack1 to the top

    expect(modalStack1.isTop()).toBe(true);
    expect(modalStack2.isTop()).toBe(false);
  });

  it("should do nothing when pulling a non-existent modal from the stack", () => {
    const modalStack1 = requireModalStack();
    const modalStack2 = requireModalStack();

    modalStack1.push();
    modalStack2.pull(); // No effect since modalStack2 is not in the stack

    expect(modalStack1.isTop()).toBe(true);
  });
});
