import { createProviderClass } from "@next-core/utils/general";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";

export interface GeneratedView {
  attrInstanceId: string;
  input: string;
  output: string;
  list: unknown[];
  defaultVisualWeight?: number;
  systemPromptVersion?: string;
}

export async function batchUpdateRawDataGeneratedView(
  generations: GeneratedView[]
): Promise<unknown> {
  return Promise.allSettled(
    generations.map(({ attrInstanceId, ...props }) =>
      InstanceApi_createInstance("RAW_DATA_GENERATED_VIEW@EASYOPS", {
        ...props,
        attr: [attrInstanceId],
      })
    )
  );
}

customElements.define(
  "visual-builder.batch-update-raw-data-generated-view",
  createProviderClass(batchUpdateRawDataGeneratedView)
);
