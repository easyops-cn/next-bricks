/** @jsx LegacyReact.createElement */
/** @jsxFrag LegacyReact.Fragment */
import { loadScript } from "@next-core/loader";
import { createProviderClass, unwrapProvider } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import {
  authenticate,
  getAuth,
  isLoggedIn,
  logout,
  getCssPropertyValue,
  getCurrentTheme,
  getCurrentMode,
  batchSetAppsLocalTheme,
  applyTheme,
  getHistory,
  handleHttpError,
  httpErrorToString,
  checkIfByTransform,
  checkIfOfComputed,
  StoryboardFunctionRegistryFactory,
  unstable_createRoot,
  __secret_internals,
} from "@next-core/runtime";
import { i18n, i18nText } from "@next-core/i18n";
import * as Http from "@next-core/http";
import * as History from "history";
import * as JsYaml from "js-yaml";
import lodash from "lodash";
import moment from "moment";
import "@next-core/theme";
import {
  ReactUseBrick,
  ReactUseMultipleBricks,
} from "./legacy-brick-kit/LegacyUseBrick.js";
import { getLegacyRuntime } from "./legacy-brick-kit/getLegacyRuntime.js";
import { loadLazyBricks } from "./legacy-brick-kit/LazyBrickRegistry.js";
import { getLegacyUseFeatureFlags } from "./legacy-brick-kit/getLegacyUseFeatureFlags.js";
import { getLegacyErrorBoundary } from "./legacy-brick-kit/getLegacyErrorBoundary.js";
import { getLegacyUseRecentApps } from "./legacy-brick-kit/getLegacyUseRecentApps.js";
import { getLegacyUseProvider } from "./legacy-brick-kit/getLegacyUseProvider.js";
import { EmptySvg } from "./legacy-brick-kit/EmptySvg.js";
import { useCurrentTheme } from "./legacy-brick-kit/useCurrentTheme.js";
import { getDll } from "./dll.js";

// eslint-disable-next-line
// @ts-ignore
window.DLL_PATH = DLL_PATH;

const dllPromises = new Map<string, Promise<void>>();

interface DLL {
  (moduleId: string): any;
}

interface IconsByCategory {
  [category: string]: string[];
}

interface LegacyFaIconProps {
  icon: [string, string] | string;
  gradientColor?: {
    startColor: string;
    endColor: string;
    direction?: string;
  };
}

const MAIN_KEY = "";

// Specify brick dependencies:
/*#__PURE__*/ wrapBrick("icons.easyops-icon");
/*#__PURE__*/ wrapBrick("icons.fa-icon");
const getEasyopsIcons = unwrapProvider("icons.get-easyops-icons");
const getFaIcons = unwrapProvider("icons.get-fa-icons");
const getIllustration = unwrapProvider("illustrations.get-illustration");
const translateIllustrationConfig = unwrapProvider(
  "illustrations.translate-illustration-config"
);

export async function loadBricks(
  adapterPkgFilePath: string,
  brickPkgFilePath: string,
  bricks: string[],
  dlls: string[] | undefined
) {
  let mainPromise = dllPromises.get(MAIN_KEY);
  if (!mainPromise) {
    mainPromise = loadMainDll(adapterPkgFilePath);
    dllPromises.set(MAIN_KEY, mainPromise);
  }
  await mainPromise;
  await loadDlls(adapterPkgFilePath, dlls);
  await loadScript(brickPkgFilePath, window.PUBLIC_ROOT ?? "");
  await loadLazyBricks(bricks);
}

async function loadDlls(adapterPkgFilePath: string, dlls?: string[]) {
  if (!Array.isArray(dlls)) {
    return;
  }
  if (dlls.includes("editor-bricks-helper")) {
    await loadDll(adapterPkgFilePath, "react-dnd");
  }
  for (const dll of dlls) {
    await loadDll(adapterPkgFilePath, dll);
  }
}

function loadDll(adapterPkgFilePath: string, dll: string) {
  let promise = dllPromises.get(dll);
  if (!promise) {
    promise = doLoadDll(adapterPkgFilePath, dll);
    dllPromises.set(dll, promise);
  }
  return promise;
}

async function doLoadDll(adapterPkgFilePath: string, dll: string) {
  const jsFile = window.DLL_PATH?.[dll];
  if (!jsFile) {
    throw new Error(`DLL ${dll} not found`);
  }
  await loadScript(
    `${adapterPkgFilePath.substring(
      0,
      adapterPkgFilePath.indexOf("/dist/")
    )}/dist/dll/${jsFile}`,
    window.PUBLIC_ROOT ?? ""
  );
}

async function loadMainDll(adapterPkgFilePath: string) {
  window.MIGRATE_TO_BRICK_NEXT_V3 = true;

  import("@next-core/styles-v3");

  const [easyopsIcons, faIcons] = await Promise.all([
    getEasyopsIcons(),
    getFaIcons() as Promise<IconsByCategory>,
    doLoadDll(adapterPkgFilePath, ""),
  ]);

  const dll = getDll();

  const LegacyBrickKit = dll("tYg3");
  const LegacyReact = dll("q1tI");
  const LegacyI18next = dll("XzT5");
  const LegacyReactI18next = dll("9kay");
  const LegacyHttp = dll("JxWY");
  const LegacyBrickIcons = dll("AE1K");
  const LegacyIllustrations = dll("M7uQ");
  const LegacyHistory = dll("LhCv");
  const LegacyJsYaml = dll("ZR4k");
  const LegacyReactFontAwesome = dll("IP2g");
  const LegacyFontAwesomeLibrary = dll("9RIe");
  const LegacyLodash = dll("LvDl");
  const LegacyMoment = dll("wd/R");
  const LegacyAntd = dll("gdfu");
  const antdLocaleEnUS = dll("D7Yy");
  const { antdLocaleZhCN } = LegacyBrickKit;

  defineModule(LegacyI18next, {
    default: i18n,
  });

  LegacyReactI18next.initReactI18next.init(i18n);

  defineModule(LegacyHttp, Http);
  defineModule(LegacyHistory, History);
  defineModule(LegacyJsYaml, JsYaml);
  LegacyLodash.__inject(lodash);
  LegacyMoment.__inject(moment);

  const { useFeatureFlags, FeatureFlagsProvider, DisplayByFeatureFlags } =
    getLegacyUseFeatureFlags(LegacyReact);
  const LegacyErrorBoundary = getLegacyErrorBoundary(LegacyReact);

  const EasyopsEmpty = (props: any) => {
    const illustration = LegacyReact.useMemo(
      () => props.illustration && getIllustration(props.illustration),
      [props.illustration]
    );
    // Todo(steve): empty svg
    const image = props.noImage ? null : props.illustration ? (
      illustration
    ) : (
      <EmptySvg isBig={props.useBigEmptyImage}></EmptySvg>
    );
    const imageStyle =
      props.imageStyle ??
      (props.useBigEmptyImage ? undefined : { height: "60px" });
    return (
      <LegacyAntd.Empty
        image={image}
        imageStyle={imageStyle}
        description={props.description}
        style={{ color: "var(--text-color-secondary)" }}
      />
    );
  };

  defineModule(LegacyBrickIcons, {
    BrickIcon({ category, icon }: { category?: string; icon: string }) {
      const EasyOpsIcon = "icons.easyops-icon" as any;
      return <EasyOpsIcon category={category} icon={icon} />;
    },
    iconsByCategory: easyopsIcons,
  });

  defineModule(LegacyReactFontAwesome, {
    FontAwesomeIcon({ icon, gradientColor }: LegacyFaIconProps) {
      const FaIcon = "icons.fa-icon" as any;
      return (
        <FaIcon
          {...{
            ...(Array.isArray(icon)
              ? {
                  prefix: icon[0],
                  icon: icon[1],
                }
              : {
                  icon,
                }),
            ...(gradientColor
              ? {
                  // Need to be keybab-case here, since fa-icon is a web component
                  "start-color": gradientColor.startColor,
                  "end-color": gradientColor.endColor,
                  "gradient-direction": gradientColor.direction,
                }
              : null),
          }}
        />
      );
    },
  });

  defineModule(
    LegacyFontAwesomeLibrary,
    Object.fromEntries(
      ["fas", "fab"].map((prefix) => [
        prefix,
        Object.fromEntries(
          (faIcons[prefix] ?? []).map((iconName) => [
            `${prefix}-${iconName}`,
            { prefix, iconName },
          ])
        ),
      ])
    )
  );

  defineModule(LegacyIllustrations, {
    getIllustration,
    translateIllustrationConfig,
  });

  defineModule(LegacyBrickKit, {
    getRuntime: getLegacyRuntime,
    getHistory,
    handleHttpError,
    httpErrorToString,
    looseCheckIfByTransform: checkIfByTransform,
    looseCheckIfOfComputed: checkIfOfComputed,
    i18nText,
    StoryboardFunctionRegistryFactory,

    // Auth
    getAuth,
    authenticate,
    logout,
    isLoggedIn,

    // Theme and mode
    getCssPropertyValue,
    getCurrentTheme,
    getCurrentMode,
    batchSetAppsLocalTheme,
    applyTheme,

    doTransform: __secret_internals.legacyDoTransform,

    BrickWrapper(props: {
      wrapperConfig?: {
        empty?: any;
      };
      children: unknown;
    }) {
      // istanbul ignore next
      const featureFlags =
        process.env.NODE_ENV === "test"
          ? {}
          : getLegacyRuntime().getFeatureFlags();
      const locale =
        i18n.language && i18n.language.split("-")[0] === "en"
          ? antdLocaleEnUS
          : antdLocaleZhCN;
      return (
        <LegacyErrorBoundary>
          <FeatureFlagsProvider value={featureFlags}>
            <LegacyAntd.ConfigProvider
              locale={locale}
              autoInsertSpaceInButton={false}
              renderEmpty={() => (
                <EasyopsEmpty {...props.wrapperConfig?.empty} />
              )}
            >
              {props.children}
            </LegacyAntd.ConfigProvider>
          </FeatureFlagsProvider>
        </LegacyErrorBoundary>
      );
    },

    EasyopsEmpty,

    // Feature flags helpers
    useFeatureFlags,
    FeatureFlagsProvider,
    DisplayByFeatureFlags,

    useProvider: getLegacyUseProvider(LegacyReact),

    useCurrentTheme,
    useApplyPageTitle(pageTitle: string) {
      LegacyReact.useEffect(() => {
        getLegacyRuntime().applyPageTitle(pageTitle);
      }, [pageTitle]);
    },

    SingleBrickAsComponent: ReactUseBrick,
    BrickAsComponent: ReactUseMultipleBricks,

    ...getLegacyUseRecentApps(LegacyReact),

    developHelper: {
      ...lodash.pick(__secret_internals, [
        "updateStoryboardByRoute",
        "updateStoryboardByTemplate",
        "updateTemplatePreviewSettings",
        "updateStoryboardBySnippet",
        "updateSnippetPreviewSettings",
      ]),
      createRoot: unstable_createRoot,
    },
  });
}

function defineModule(target: object, modules: object) {
  for (const [key, value] of Object.entries(modules)) {
    Object.defineProperty(target, key, { value });
  }
}

customElements.define(
  "v2-adapter.load-bricks",
  createProviderClass(loadBricks)
);
