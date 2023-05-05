// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import illustrationsByCategory from "../generated/illustrationsByCategory.json";

function getIllustrationsByCategory() {
  return illustrationsByCategory.default;
}

customElements.define(
  "illustrations.get-illustrations-by-category",
  createProviderClass(getIllustrationsByCategory)
);
