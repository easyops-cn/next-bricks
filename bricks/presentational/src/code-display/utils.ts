import Prism from "prismjs";
import { languages } from "prismjs/components.js";
import { cloneDeep } from "lodash";

interface LanguageDetail {
  title: string;
  alias?: string | string[];
  require?: string | string[];
  requireDeps?: string[];
  optional?: string | string[];
  optionalDeps?: string[];
}

const loadedLanguages = Prism.languages;
const supportedLanguages = cloneDeep(languages) as Record<
  string,
  LanguageDetail
>;
const aliasMap = new Map<string, string>();

const initSupportedLanguages = () => {
  for (const language in supportedLanguages) {
    const languageDetail = supportedLanguages[language];

    languageDetail.requireDeps = ([] as string[]).concat(
      languageDetail.require || []
    );
    languageDetail.optionalDeps = ([] as string[]).concat(
      languageDetail.optional || []
    );

    aliasMap.set(language, language);
    const aliases = ([] as string[]).concat(languageDetail.alias || []);
    aliases.forEach((alias) => {
      aliasMap.set(alias, language);
    });
  }
};

initSupportedLanguages();

const importLanguage = (language: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    import(
      /* webpackChunkName: "./prismjs/languages/[request]" */
      `prismjs/components/prism-${language}.min.js`
    ).then(
      () => resolve(void 0),
      (err) => {
        const error = `load language failed: ${language}
        reason: ${err}`;

        // eslint-disable-next-line no-console
        console.error(error);
        reject(error);
      }
    );
  });
};

const loadLanguageAccordingToDeps = async (
  language: string
): Promise<unknown[] | unknown> => {
  if (loadedLanguages[language]) {
    return Promise.resolve();
  } else {
    const languageDetail = supportedLanguages[language];

    const requireDepsLoadingList = languageDetail.requireDeps.map((dep) =>
      loadLanguageAccordingToDeps(dep)
    );
    const optionalDepsLoadingList = languageDetail.optionalDeps.map((dep) =>
      loadLanguageAccordingToDeps(dep)
    );

    await Promise.all(requireDepsLoadingList);

    return Promise.all([importLanguage(language), ...optionalDepsLoadingList]);
  }
};

export const loadLanguage = async (language: string) => {
  const _language = aliasMap.get(language);
  if (!_language || !supportedLanguages[_language]) {
    const error = "unsupported language: " + language;

    // eslint-disable-next-line no-console
    console.error(error);
    return Promise.reject(error);
  } else {
    return loadLanguageAccordingToDeps(_language);
  }
};
