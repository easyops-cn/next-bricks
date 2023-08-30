import { CommandDoc } from "../../../../interface.js";

export default function getCypressAssertionCommands(): CommandDoc[] {
  const positiveAssertions: CommandDoc[] = [
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
  ];

  const negativeAssertions = positiveAssertions.map(({ name, ...rest }) => ({
    name: name.replace(":", ":not."),
    ...rest,
  }));

  return [...positiveAssertions, ...negativeAssertions];
}
