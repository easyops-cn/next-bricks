import { CommandDoc } from "../../../../interface.js";

export default function getCypressAssertionCommands(): CommandDoc[] {
  const positiveAssertions: CommandDoc[] = [
    {
      name: "should:be.empty",
      category: "assertion",
      description: "断言当前目标是空字符串、或空数组、或空集合",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.false",
      category: "assertion",
      description: "断言当前目标是 `false`",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.greaterThan",
      category: "assertion",
      description: "断言当前目标大于指定数字",
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
      description: "断言当前目标大于或等于指定数字",
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
      description: "断言当前目标小于指定数字",
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
      description: "断言当前目标小于或等于指定数字",
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
      description: "断言当前目标是 `true`",
      category: "assertion",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.undefined",
      category: "assertion",
      description: "断言当前目标是 `undefined`",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.null",
      category: "assertion",
      description: "断言当前目标是 `null`",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.NaN",
      category: "assertion",
      description: "断言当前目标是 `NaN`",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.within",
      category: "assertion",
      description: "断言当前目标介于指定范围内",
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
      description: "断言当前目标包含指定内容",
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
      description: "断言当前目标深度等同于指定对象",
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
      description: "断言当前目标存在（不等于 `null` 或 `undefined`）",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:equal",
      category: "assertion",
      description: "断言当前目标等于指定值",
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
      description: "断言当前目标含有指定属性值（使用 deep-equal 比较）",
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
      description: "断言当前目标（数组）具有指定长度",
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
      description: "断言当前目标（数组）的长度大于指定值",
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
      description: "断言当前目标（数组）的长度大于或等于指定值",
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
      description: "断言当前目标（数组）的长度小于指定值",
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
      description: "断言当前目标（数组）的长度小于或等于指定值",
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
      description: "断言当前目标（数组）的长度介于指定范围内",
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
      description: "断言当前目标（数组）包含指定成员",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
      keywords: ["include"],
    },
    {
      name: "should:have.deep.members",
      category: "assertion",
      description: "断言当前目标（数组）包含指定成员（使用 deep-equal 比较）",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
      keywords: ["include"],
    },
    {
      name: "should:have.ordered.members",
      category: "assertion",
      description: "断言当前目标（数组）包含顺序匹配的指定成员",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Values",
          required: true,
          type: "array",
        },
      ],
      keywords: ["include"],
    },
    {
      name: "should:have.ownProperty",
      category: "assertion",
      description: "断言当前目标拥有指定属性（忽略继承的属性）",
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
      description: "断言当前目标具有指定属性",
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
      description:
        "断言当前目标具有指定属性（可使用 `.` 和 `[]` 来访问嵌套属性）",
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
      name: "should:respondTo",
      category: "assertion",
      description: "断言当前目标具有指定方法",
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
      description: "断言当前目标是所列选项其中之一",
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
      description: "断言当前目标是有限值（不为 `NaN` 或 正/负 `Infinity`）",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.checked",
      category: "assertion",
      description: "断言当前目标被勾选",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.selected",
      category: "assertion",
      description: "断言当前目标被选中",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.enabled",
      category: "assertion",
      description: "断言当前目标被启用",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.disabled",
      category: "assertion",
      description: "断言当前目标被禁用",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.focused",
      category: "assertion",
      description: "断言当前目标被聚焦",
      chain: "child",
      from: "cypress",
      keywords: ["have", "focus"],
    },
    {
      name: "should:be.visible",
      category: "assertion",
      description: "断言当前目标可见",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:be.hidden",
      category: "assertion",
      description: "断言当前目标不可见",
      chain: "child",
      from: "cypress",
    },
    {
      name: "should:have.attr",
      category: "assertion",
      description: "断言当前目标具有指定属性值",
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
      description: "断言当前目标具有指定 CSS 类",
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
      description: "断言当前目标具有指定 CSS 属性值",
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
      description: "断言当前目标具有指定 data 属性值",
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
      description: "断言当前目标具有指定 ID",
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
      description: "断言当前目标包含指定 HTML 内容",
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
      description: "断言当前目标包含指定文本内容",
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
      description: "断言当前目标包含指定值",
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
      description: "断言当前目标匹配指定选择器",
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

  const negativeAssertions = positiveAssertions.map(
    ({ name, description, ...rest }) => ({
      name: name.replace(":", ":not."),
      description: description ? `（否定）${description}` : undefined,
      ...rest,
    })
  );

  return [...positiveAssertions, ...negativeAssertions];
}
