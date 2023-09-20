// istanbul ignore file
import { getRuntime } from "@next-core/runtime";
import { initializeI18n } from "@next-core/i18n";

initializeI18n();
getRuntime();

/**
 * V3 挂件伴侣：用于在 v2 容器中使用 v3 挂件包的伴侣。
 *
 * 在 v2 容器中，如果识别到 v3 挂件，则始终先加载该伴侣后，再加载 v3 挂件。
 * 因为 v3 挂件并不包含其必需的共享模块，这些共享模块存在于其他普通的 v3 构件包中。
 *
 * @internal
 */
customElements.define("basic.v3-widget-mate", class extends HTMLElement {});
