import React, { useEffect, useState } from "react";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import { UseSingleBrickConf } from "@next-core/types";

export function CacheUseBrickItem(props: {
  useBrick: UseSingleBrickConf | UseSingleBrickConf[];
  data: any;
}): React.ReactNode {
  const [cacheData, setCacheData] = useState<any>(props.data);

  useEffect(() => {
    setCacheData(props.data);
  }, Object.values(props.data));

  return <ReactUseMultipleBricks useBrick={props.useBrick} data={cacheData} />;
}
