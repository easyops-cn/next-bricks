import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMsgItemContext } from "../../MsgItemContext.js";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import { useChatViewContext } from "../../../../ChatViewContext.js";

interface UseDataProps {
  text: string;
  chatting: boolean;
}

function useData({ text, chatting }: UseDataProps) {
  const cahceTextRef = useRef<string>("");
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [parseData, setParseData] = useState<any>();

  useEffect(() => {
    if (cahceTextRef.current !== text) {
      cahceTextRef.current = text;
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        setIsError(true);
        return;
      }
      setParseData(data);
    }
  }, [text]);

  useEffect(() => {
    if (chatting) {
      if (text.match(/\n[`]{0,3}$/)) {
        setIsEnd(true);
      }
    } else {
      setIsEnd(true);
    }
  }, [text, chatting]);

  return {
    parseData,
    isError: isEnd && isError,
  };
}

export default function CustomComponent({
  text,
  language,
}: {
  text: string;
  language: string;
}) {
  const { commandBricks } = useChatViewContext();
  const { chatting, agentId, conversationId, taskId } = useMsgItemContext();

  const { parseData, isError } = useData({
    text,
    chatting: !!chatting,
  });

  const commandBrickConf = useMemo(() => {
    const config = commandBricks?.[language];
    if (config) {
      const data = {
        data: parseData,
        agentId,
        conversationId,
        taskId,
      };
      return {
        component: (
          <ReactUseMultipleBricks useBrick={config.useBrick} data={data} />
        ),
        ...config,
      };
    }
    return {
      component: null,
      showOriginData: true,
    };
  }, [commandBricks, language, parseData, agentId, conversationId, taskId]);

  return (
    <div className="custom-component-wrapper">
      {commandBrickConf?.showOriginData ? (
        <>
          <div className="params">
            <div className="params-tip">【查询语句】: </div>
            <pre>
              <code>{text}</code>
            </pre>
          </div>
          {isError ? (
            <div className="error-tip">【查询失败】</div>
          ) : (
            <>
              <div className="result-tip">【查询结果】:</div>
              <div className="custom-component">
                {commandBrickConf.component}
              </div>
            </>
          )}
        </>
      ) : (
        commandBrickConf.component
      )}
    </div>
  );
}
