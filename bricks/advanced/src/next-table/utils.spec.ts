import { naturalComparator } from "./utils";

describe("naturalComparator", () => {
  test("default order (ascend)", () => {
    const list: unknown[] = [1, null, 6, 23, undefined, "35", 12];
    list.sort(naturalComparator);
    expect(list).toEqual([1, 6, 12, 23, "35", null, undefined]);
  });

  test("descend", () => {
    const list: unknown[] = [1, null, 6, 23, undefined, "35", 12];
    list.sort((a, b) => naturalComparator(b, a, "descend"));
    expect(list).toEqual(["35", 23, 12, 6, 1, null, undefined]);
  });
});
