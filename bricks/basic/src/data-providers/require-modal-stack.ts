import { createProviderClass } from "@next-core/utils/general";

const stack: number[] = [];

let nextId = 1;
function getNextId() {
  return nextId++;
}

export interface ModalStack {
  push: () => void;
  pull: () => void;
  isTop: () => boolean;
}

export function requireModalStack(): ModalStack {
  const id = getNextId();

  const pull = () => {
    const found = stack.indexOf(id);
    if (found > -1) {
      stack.splice(found, 1);
    }
  };

  const push = () => {
    pull();
    stack.push(id);
  };

  const isTop = (): boolean => {
    return stack.length > 0 && stack[stack.length - 1] === id;
  };

  return { push, pull, isTop };
}

customElements.define(
  "basic.require-modal-stack",
  createProviderClass(requireModalStack)
);
