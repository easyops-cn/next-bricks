import React, { useMemo } from "react";

export function ProgressText({ text }: { text: string }): React.ReactNode {
  const renderText = useMemo(() => {
    // 文本末尾存在 \n ```, 会导致在渲染快结束的时候突然有一个换行，在结束的时候，换行被干掉，导致页面闪动的情况
    // 所以在这里计算，如果文本将要关闭，则默认不然 \n ``` 显示
    const newText = text.replace(/\n[`]{0,3}$/, "");
    return newText;
  }, [text]);

  return <div className="progress-text">{renderText}</div>;
}
