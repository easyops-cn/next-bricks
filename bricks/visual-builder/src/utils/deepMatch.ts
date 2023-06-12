export function deepFilter<T>(data: Array<T>, q: string): Array<T> {
  const trimmedQuery = q?.trim();
  if (!trimmedQuery) {
    return data.slice();
  }
  return data.filter((item) => deepMatch(item, trimmedQuery.toLowerCase()));
}

export function deepMatch(data: unknown, lowerTrimmedQuery: string): boolean {
  switch (typeof data) {
    case "string":
      return data.toLowerCase().includes(lowerTrimmedQuery);
    case "boolean":
    case "number":
      return String(data).includes(lowerTrimmedQuery);
    case "object":
      return data === null
        ? "null".includes(lowerTrimmedQuery)
        : (Array.isArray(data) ? data : Object.entries(data).flat()).some(
            (item) => deepMatch(item, lowerTrimmedQuery)
          );
    default:
      return false;
  }
}

[
  {
    icon: {
      icon: "landmark",
      lib: "fa",
      prefix: "fas",
    },
    key: "summary",
    link: {
      to: "/visual-builder/project/5fdac3c4bb811/app/workflow-demo/project_settings/summary",
    },
    name: "概要",
  },
  {
    icon: {
      category: "app",
      icon: "cmdb-user-permission",
      lib: "easyops",
    },
    key: "permissions",
    link: {
      to: "/visual-builder/project/5fdac3c4bb811/app/workflow-demo/project_settings/permission",
    },
    name: "访问控制",
  },
];
