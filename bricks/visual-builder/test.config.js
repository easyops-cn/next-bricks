// @ts-check
/** @type {import("@next-core/test-next").TestNextConfig} */
export default {
  // Todo(steve): Work in progress
  testPathIgnorePatterns: [
    "<rootDir>/src/chat-conversation/",
    "<rootDir>/src/chat-preview/",
    "<rootDir>/src/pre-generated-",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/chat-conversation/",
    "<rootDir>/src/chat-preview/",
    "<rootDir>/src/pre-generated-",
    "<rootDir>/src/data-providers/chat-preview/",
    "<rootDir>/src/data-providers/inject-chat-preview-agent",
    // Todo(sailor): Work in progress
    "<rootDir>/src/property-editor",
  ],
};
