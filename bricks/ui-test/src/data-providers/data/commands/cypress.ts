import { CommandDoc } from "../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "./utils.js";

export default function getCypressCommands(): CommandDoc[] {
  return [
    // <!-- Cypress queries start
    {
      name: "as",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Alias name",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "children",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "No selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "By selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "closest",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "contains",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "By content",
          params: [
            {
              label: "Content",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "By selector and content",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Content",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "document",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "eq",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Index",
          required: true,
          type: "number",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "filter",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "find",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "first",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "focused",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "get",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Selector (or alias)",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "hash",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // TODO: invoke (spread args)
    {
      name: "its",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Property name",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "last",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "location",
      category: "query",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "Without key",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With key",
          params: [
            {
              label: "Key",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "next",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "nextAll",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "nextUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "not",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "parent",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "parents",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "parentsUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prev",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prevAll",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prevUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "root",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "shadow",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "siblings",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "title",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "url",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "window",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Cypress queries end -->

    // <!-- Cypress actions start
    {
      name: "check",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Check all",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "Check by a single value",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Check by multiple values",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "clear",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "click",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "dblclick",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "rightclick",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "scrollIntoView",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "scrollTo",
      category: "action",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "Select",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Select by a single value or text content",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Select by a single index",
          params: [
            {
              label: "Index",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Select by multiple values or indexes or text contents",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    // Todo: selectFile
    {
      name: "trigger",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With position",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "type",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Text",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      icon: {
        lib: "fa",
        icon: "keyboard",
      },
    },
    {
      name: "uncheck",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Uncheck all",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "Uncheck by a single value",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Uncheck by multiple values",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    // Cypress actions end -->

    // <!-- Cypress assertions start
    {
      name: "should:be.empty",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.false",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.greaterThan",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["above"],
    },
    {
      name: "should:be.gte",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["least"],
    },
    {
      name: "should:be.lessThan",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lt", "below"],
    },
    {
      name: "should:be.lte",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lt", "most"],
    },
    {
      name: "should:be.true",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.undefined",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.null",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.NaN",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.within",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Start",
          required: true,
          type: "number",
        },
        {
          label: "Finish",
          required: true,
          type: "number",
        },
      ],
    },
    {
      name: "should:contain",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "string",
        },
      ],
      keywords: ["include", "includes", "contains"],
    },
    {
      name: "should:deep.equal",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "mixed",
        },
      ],
    },
    {
      name: "should:exist",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:equal",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "mixed",
        },
      ],
      keywords: ["eq"],
    },
    // Todo: should:eql
    {
      name: "should:have.deep.property",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "string",
        },
        {
          label: "Object",
          required: true,
          type: "mixed",
        },
      ],
    },
    {
      name: "should:have.length",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf"],
    },
    {
      name: "should:have.length.greaterThan",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf", "gt", "above"],
    },
    {
      name: "should:have.length.gte",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf", "least"],
    },
    {
      name: "should:have.length.lessThan",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf", "lt", "below"],
    },
    {
      name: "should:have.length.lte",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf", "most"],
    },
    {
      name: "should:have.length.within",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Start",
          required: true,
          type: "number",
        },
        {
          label: "Finish",
          required: true,
          type: "number",
        },
      ],
      keywords: ["lengthOf", "most"],
    },
    {
      name: "should:have.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:have.deep.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:have.ordered.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:have.ownProperty",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Property",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:have.property",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Property",
          required: true,
          type: "string",
        },
        {
          label: "Value",
          type: "mixed",
        },
      ],
    },
    {
      name: "should:have.nested.property",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Property",
          required: true,
          type: "string",
        },
        {
          label: "Value",
          type: "mixed",
        },
      ],
    },
    {
      name: "should:include.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:include.ordered.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:include.deep.members",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:respondTo",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:be.oneOf",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "List",
          required: true,
          type: "array",
        },
      ],
    },
    {
      name: "should:be.finite",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.checked",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.selected",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.enabled",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.disabled",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.focused",
      category: "assertion",
      chain: "child",
      from: "cypress",
      keywords: ["have", "focus"],
    },
    {
      name: "should:be.visible",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.hidden",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:have.attr",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Name",
          required: true,
          type: "string",
        },
        {
          label: "Value",
          type: "string",
        },
      ],
    },
    {
      name: "should:have.class",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Class name",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:have.css",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Name",
          required: true,
          type: "string",
        },
        {
          label: "Value",
          type: "string",
        },
      ],
    },
    {
      name: "should:have.data",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Name",
          required: true,
          type: "string",
        },
        {
          label: "Value",
          type: "string",
        },
      ],
    },
    {
      name: "should:have.id",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "ID",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:have.html",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "HTML",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:have.text",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Text",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:have.value",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Value",
          required: true,
          type: "string",
        },
      ],
    },
    {
      name: "should:match",
      category: "assertion",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
      ],
    },
    // Todo: should:to.match (RegExp)
    // Cypress assertions end -->

    // <!-- Cypress other commands start
    {
      name: "blur",
      category: "other",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // {
    //   name: "clearAllCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearAllLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearAllSessionStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "Name",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   overloads: [
    //     {
    //       label: "Clear by a single key",
    //       params: [
    //         {
    //           label: "Key",
    //           required: true,
    //           type: "string",
    //         },
    //         getParamDefinitionOfArbitraryOptions(),
    //       ],
    //     },
    //     {
    //       label: "Clear by multiple keys",
    //       params: [
    //         {
    //           label: "Keys",
    //           required: true,
    //           type: "array",
    //         },
    //         getParamDefinitionOfArbitraryOptions(),
    //       ],
    //     },
    //   ],
    // },
    // Ignore: clock
    {
      name: "debug",
      category: "other",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: each
    // Ignore: exec
    // Ignore: fixture
    {
      name: "focus",
      category: "other",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // {
    //   name: "getAllCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getAllLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getAllSessionStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "Name",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    {
      name: "go",
      category: "other",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Position",
          required: true,
          type: "number",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    // Ignore: intercept
    // Ignore: log
    // Ignore: origin
    {
      name: "pause",
      category: "other",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: readFile
    {
      name: "reload",
      category: "other",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Force reload",
          type: "boolean",
          default: false,
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "request",
      category: "other",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "With URL",
          params: [
            {
              label: "URL",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With method and URL",
          params: [
            {
              label: "Method",
              required: true,
              type: "string",
              enum: [
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "OPTIONS",
              ],
            },
            {
              label: "URL",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With options only",
          params: [
            {
              label: "Options",
              type: "object",
            },
          ],
        },
      ],
    },
    {
      name: "screenshot",
      category: "other",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filename",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With filename",
          params: [
            {
              label: "filename",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    // Ignore: session
    // {
    //   name: "setCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "name",
    //       required: true,
    //       type: "string",
    //     },
    //     {
    //       label: "Value",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // Ignore: spread
    // Ignore: spy
    // Ignore: stub
    {
      name: "submit",
      category: "other",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: task
    // Ignore: then
    // Ignore: tick
    {
      name: "viewport",
      category: "other",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "By dimension",
          params: [
            {
              label: "width",
              required: true,
              type: "number",
            },
            {
              label: "height",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "By preset",
          params: [
            {
              label: "preset",
              required: true,
              type: "string",
              enum: ["macbook-11", "macbook-13", "macbook-15", "macbook-16"],
            },
            {
              label: "orientation",
              // Note: in Cypress, the default orientation is "portrait"
              default: "landscape",
              type: "string",
              enum: ["landscape", "portrait"],
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "visit",
      category: "other",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "URL",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      icon: {
        lib: "fa",
        prefix: "far",
        icon: "compass",
        color: "var(--palette-teal-6)",
      },
    },
    // Ignore: wait
    // Ignore: within
    // Ignore: wrap
    // Ignore: writeFile
  ];
}
