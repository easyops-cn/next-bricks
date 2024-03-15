import { describe, test, expect } from "@jest/globals";
import { getParseYaml } from "./parseYaml.js";

let parseYaml: any;
beforeAll(async () => {
  parseYaml = await getParseYaml({
    showDSKey: true,
  });
});

describe("parseYaml should work", () => {
  test("basic usage", () => {
    const result = parseYaml(
      `basic: <% CTX.basic %>
trackContext: <% "track context", CTX.trackContext %>
trackAny: <%= CTX.trackAny %>
function: <% FN.testA(CTX.a, CTX.b) + FN.testB(CTX.c) %>
state: <% STATE.a %>
tpl: <% TPL.a %>
`,
      ["CTX", "FN"],
      [
        { token: "CTX", params: ["basic", "a", "b"] },
        { token: "STATE", message: "Not allow STATE", level: "info" },
        { token: "TPL", message: "Error", level: "error" },
        { token: "FN", params: ["testA"], message: "Not Found Function" },
      ]
    );

    expect(result).toEqual({
      markers: [
        {
          endColumn: 51,
          endLineNumber: 2,
          message: "Miss Property",
          severity: 4,
          startColumn: 35,
          startLineNumber: 2,
        },
        {
          endColumn: 27,
          endLineNumber: 3,
          message: "Miss Property",
          severity: 4,
          startColumn: 15,
          startLineNumber: 3,
        },
        {
          endColumn: 22,
          endLineNumber: 4,
          message: "Not Found Function",
          severity: 4,
          startColumn: 14,
          startLineNumber: 4,
        },
        {
          endColumn: 47,
          endLineNumber: 4,
          message: "Miss Property",
          severity: 4,
          startColumn: 39,
          startLineNumber: 4,
        },
        {
          endColumn: 53,
          endLineNumber: 4,
          message: "Miss Property",
          severity: 4,
          startColumn: 48,
          startLineNumber: 4,
        },
        {
          endColumn: 18,
          endLineNumber: 5,
          message: "Not allow STATE",
          severity: 2,
          startColumn: 11,
          startLineNumber: 5,
        },
        {
          endColumn: 14,
          endLineNumber: 6,
          message: "Error",
          severity: 8,
          startColumn: 9,
          startLineNumber: 6,
        },
      ],
      tokens: [
        {
          endColumn: 20,
          endLineNumber: 1,
          property: "basic",
          startColumn: 11,
          startLineNumber: 1,
          token: "CTX",
        },
        {
          endColumn: 51,
          endLineNumber: 2,
          property: "trackContext",
          startColumn: 35,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 27,
          endLineNumber: 3,
          property: "trackAny",
          startColumn: 15,
          startLineNumber: 3,
          token: "CTX",
        },
        {
          endColumn: 22,
          endLineNumber: 4,
          property: "testA",
          startColumn: 14,
          startLineNumber: 4,
          token: "FN",
        },
        {
          endColumn: 28,
          endLineNumber: 4,
          property: "a",
          startColumn: 23,
          startLineNumber: 4,
          token: "CTX",
        },
        {
          endColumn: 35,
          endLineNumber: 4,
          property: "b",
          startColumn: 30,
          startLineNumber: 4,
          token: "CTX",
        },
        {
          endColumn: 47,
          endLineNumber: 4,
          property: "testB",
          startColumn: 39,
          startLineNumber: 4,
          token: "FN",
        },
        {
          endColumn: 53,
          endLineNumber: 4,
          property: "c",
          startColumn: 48,
          startLineNumber: 4,
          token: "CTX",
        },
      ],
      value: {
        basic: "<% CTX.basic %>",
        function: "<% FN.testA(CTX.a, CTX.b) + FN.testB(CTX.c) %>",
        state: "<% STATE.a %>",
        tpl: "<% TPL.a %>",
        trackAny: "<%= CTX.trackAny %>",
        trackContext: '<% "track context", CTX.trackContext %>',
      },
    });
  });

  test("match should work", () => {
    const result = parseYaml(
      `match: <% \`\${CTX.match}\` %>
match2: <% CTX.match + "CTX.noMatch" %>
match3: <% CTX.match.b %>
noMatch1: <% "CTX.basic" %>
noMatch2: CTX.basic
noMatch3: <% CTX.basic
noMatch4: CTX.basic %>
noMatch5: <%CTX.basic%>
noMatch6: <%CTX.basic %>
noMatch7: <% CTX.basic%>
notMatch8: <% CTXA.basic %>
notMatch9: <% ACTX.basic %>
notMatch10: <% a.CTX.a %>
`,
      ["CTX", "FN"],
      [{ token: "CTX", params: ["match"] }]
    );

    expect(result).toEqual({
      markers: [],
      tokens: [
        {
          endColumn: 23,
          endLineNumber: 1,
          property: "match",
          startColumn: 14,
          startLineNumber: 1,
          token: "CTX",
        },
        {
          endColumn: 21,
          endLineNumber: 2,
          property: "match",
          startColumn: 12,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 21,
          endLineNumber: 3,
          property: "match",
          startColumn: 12,
          startLineNumber: 3,
          token: "CTX",
        },
      ],
      value: {
        match: "<% `${CTX.match}` %>",
        match2: '<% CTX.match + "CTX.noMatch" %>',
        match3: "<% CTX.match.b %>",
        noMatch1: '<% "CTX.basic" %>',
        noMatch2: "CTX.basic",
        noMatch3: "<% CTX.basic",
        noMatch4: "CTX.basic %>",
        noMatch5: "<%CTX.basic%>",
        noMatch6: "<%CTX.basic %>",
        noMatch7: "<% CTX.basic%>",
        notMatch10: "<% a.CTX.a %>",
        notMatch8: "<% CTXA.basic %>",
        notMatch9: "<% ACTX.basic %>",
      },
    });
  });

  test("object should work", () => {
    const result = parseYaml(
      `object1:
  a: <% CTX.object1A %>
  b:
    b1: <% CTX.object1B1 %>
object2: |
  <% { a: CTX.object2A, b: { b1: CTX.object2B1} } %>
object3: |
  <%
    {
      a: CTX.object3A,
      b: {
        b1: CTX.object3B1
      }
    }
  %>`,
      ["CTX"]
    );

    expect(result).toStrictEqual({
      markers: [],
      tokens: [
        {
          endColumn: 21,
          endLineNumber: 2,
          property: "object1A",
          startColumn: 9,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 25,
          endLineNumber: 4,
          property: "object1B1",
          startColumn: 12,
          startLineNumber: 4,
          token: "CTX",
        },
        {
          endColumn: 23,
          endLineNumber: 6,
          property: "object2A",
          startColumn: 11,
          startLineNumber: 6,
          token: "CTX",
        },
        {
          endColumn: 47,
          endLineNumber: 6,
          property: "object2B1",
          startColumn: 34,
          startLineNumber: 6,
          token: "CTX",
        },
        {
          endColumn: 22,
          endLineNumber: 10,
          property: "object3A",
          startColumn: 10,
          startLineNumber: 10,
          token: "CTX",
        },
        {
          endColumn: 26,
          endLineNumber: 12,
          property: "object3B1",
          startColumn: 13,
          startLineNumber: 12,
          token: "CTX",
        },
      ],
      value: {
        object1: { a: "<% CTX.object1A %>", b: { b1: "<% CTX.object1B1 %>" } },
        object2: "<% { a: CTX.object2A, b: { b1: CTX.object2B1} } %>\n",
        object3:
          "<%\n  {\n    a: CTX.object3A,\n    b: {\n      b1: CTX.object3B1\n    }\n  }\n%>\n",
      },
    });
  });

  test("array should work", () => {
    const result = parseYaml(
      `array1:
  - <% CTX.array1A %>
  - b: <% CTX.array1B %>
array2: |
  <% [ CTX.array2A, { b: CTX.array2B } ] %>
array3: |
  <%
    [
      CTX.array3A,
      { b: CTX.array3B }
    ]
  %>`,
      ["CTX"]
    );

    expect(result).toEqual({
      markers: [],
      tokens: [
        {
          endColumn: 19,
          endLineNumber: 2,
          property: "array1A",
          startColumn: 8,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 22,
          endLineNumber: 3,
          property: "array1B",
          startColumn: 11,
          startLineNumber: 3,
          token: "CTX",
        },
        {
          endColumn: 19,
          endLineNumber: 5,
          property: "array2A",
          startColumn: 8,
          startLineNumber: 5,
          token: "CTX",
        },
        {
          endColumn: 37,
          endLineNumber: 5,
          property: "array2B",
          startColumn: 26,
          startLineNumber: 5,
          token: "CTX",
        },
        {
          endColumn: 18,
          endLineNumber: 9,
          property: "array3A",
          startColumn: 7,
          startLineNumber: 9,
          token: "CTX",
        },
        {
          endColumn: 23,
          endLineNumber: 10,
          property: "array3B",
          startColumn: 12,
          startLineNumber: 10,
          token: "CTX",
        },
      ],
      value: {
        array1: ["<% CTX.array1A %>", { b: "<% CTX.array1B %>" }],
        array2: "<% [ CTX.array2A, { b: CTX.array2B } ] %>\n",
        array3: "<%\n  [\n    CTX.array3A,\n    { b: CTX.array3B }\n  ]\n%>\n",
      },
    });
  });

  test("expression should work", () => {
    const result = parseYaml(
      `condtion: |
  <% CTX.baisc ? CTX.b : CTX.c %>
expression: <% CTX.a.map(item => FN.test(item)) %>`,
      ["CTX", "FN"]
    );

    expect(result).toStrictEqual({
      markers: [],
      tokens: [
        {
          endColumn: 15,
          endLineNumber: 2,
          property: "baisc",
          startColumn: 6,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 23,
          endLineNumber: 2,
          property: "b",
          startColumn: 18,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 31,
          endLineNumber: 2,
          property: "c",
          startColumn: 26,
          startLineNumber: 2,
          token: "CTX",
        },
        {
          endColumn: 21,
          endLineNumber: 3,
          property: "a",
          startColumn: 16,
          startLineNumber: 3,
          token: "CTX",
        },
        {
          endColumn: 41,
          endLineNumber: 3,
          property: "test",
          startColumn: 34,
          startLineNumber: 3,
          token: "FN",
        },
      ],
      value: {
        condtion: "<% CTX.baisc ? CTX.b : CTX.c %>\n",
        expression: "<% CTX.a.map(item => FN.test(item)) %>",
      },
    });
  });

  test("special should work", () => {
    const result = parseYaml(
      `test1: |
  <%
    CTX.test1
  %>
test2: |-
  <%=
    CTX.test2
  %>
test3: >
  <%~
    CTX.test3
  %>
test4: >-
  <%
    CTX.test4
  %>
test5: |
  <% CTX.test5 %>
test6: |
  <% CTX.test6
  %>
test7: |
  <%
    CTX.test7 %>
test8: |
  <% CTX.test8 %>
test9: |
  <%= CTX.test90 +
    CTX.test91 || CTX.test92
  %>
  `,
      ["CTX"]
    );

    expect(result.tokens).toStrictEqual([
      {
        endColumn: 14,
        endLineNumber: 3,
        property: "test1",
        startColumn: 5,
        startLineNumber: 3,
        token: "CTX",
      },
      {
        endColumn: 14,
        endLineNumber: 7,
        property: "test2",
        startColumn: 5,
        startLineNumber: 7,
        token: "CTX",
      },
      {
        endColumn: 14,
        endLineNumber: 11,
        property: "test3",
        startColumn: 5,
        startLineNumber: 11,
        token: "CTX",
      },
      {
        endColumn: 14,
        endLineNumber: 15,
        property: "test4",
        startColumn: 5,
        startLineNumber: 15,
        token: "CTX",
      },
      {
        endColumn: 15,
        endLineNumber: 18,
        property: "test5",
        startColumn: 6,
        startLineNumber: 18,
        token: "CTX",
      },
      {
        endColumn: 15,
        endLineNumber: 20,
        property: "test6",
        startColumn: 6,
        startLineNumber: 20,
        token: "CTX",
      },
      {
        endColumn: 14,
        endLineNumber: 24,
        property: "test7",
        startColumn: 5,
        startLineNumber: 24,
        token: "CTX",
      },
      {
        endColumn: 15,
        endLineNumber: 26,
        property: "test8",
        startColumn: 6,
        startLineNumber: 26,
        token: "CTX",
      },
      {
        endColumn: 17,
        endLineNumber: 29,
        property: "test90",
        startColumn: 7,
        startLineNumber: 29,
        token: "CTX",
      },
      {
        endColumn: 15,
        endLineNumber: 30,
        property: "test91",
        startColumn: 5,
        startLineNumber: 30,
        token: "CTX",
      },
      {
        endColumn: 29,
        endLineNumber: 30,
        property: "test92",
        startColumn: 19,
        startLineNumber: 30,
        token: "CTX",
      },
    ]);
  });

  test("should match CTX.DS", () => {
    const result = parseYaml(`a: <% CTX.DS.a + CTX.b + DS.a %>`, [
      "CTX",
      "DS",
      "CTX.DS",
    ]);

    expect(result).toEqual({
      markers: [],
      tokens: [
        {
          endColumn: 15,
          endLineNumber: 1,
          property: "a",
          startColumn: 7,
          startLineNumber: 1,
          token: "CTX.DS",
        },
        {
          endColumn: 23,
          endLineNumber: 1,
          property: "b",
          startColumn: 18,
          startLineNumber: 1,
          token: "CTX",
        },
        {
          endColumn: 30,
          endLineNumber: 1,
          property: "a",
          startColumn: 26,
          startLineNumber: 1,
          token: "DS",
        },
      ],
      value: { a: "<% CTX.DS.a + CTX.b + DS.a %>" },
    });
  });

  test("yaml error should throw error", () => {
    expect(() => {
      parseYaml(`a: 1
a: 1
`);
    }).toThrow("parse_yaml_error");
  });
});
