import React, { useMemo, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import classNames from "classnames";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import { useChatViewContext, type ToolCall } from "../../ChatViewContext";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");

export interface ToolCallsProps {
  toolCalls: ToolCall[];
}

interface ProcessedToolCall {
  id: string;
  functionName: string;
  processedArguments: ProcessedValue;
  processedResponse?: ProcessedValue;
  args: string;
  response?: string;
}

interface ProcessedValue {
  ok: boolean;
  data?: unknown;
  error?: unknown;
}

type ProcessStatus = "processing" | "ok" | "failed";

export function ToolCalls({ toolCalls }: ToolCallsProps) {
  const [expanded, setExpanded] = useState(false);

  const processedToolCalls = useMemo(() => {
    return toolCalls.map<ProcessedToolCall>(
      ({ id, function: func, response }) => {
        let processedArguments: ProcessedValue;
        try {
          const data = JSON.parse(func.arguments);
          processedArguments = {
            ok: true,
            data,
          };
        } catch (e) {
          processedArguments = {
            ok: false,
            error: e,
          };
        }

        let processedResponse: ProcessedValue | undefined;
        if (typeof response === "string") {
          let data: unknown;
          try {
            data = JSON.parse(response);
            processedResponse = {
              ok: true,
              data,
            };
          } catch (e) {
            processedResponse = {
              ok: false,
              error: e,
            };
          }
        }

        return {
          id,
          functionName: func.name,
          processedArguments,
          processedResponse,
          args: func.arguments,
          response,
        };
      }
    );
  }, [toolCalls]);

  const processStatus = useMemo(() => {
    let status: ProcessStatus = "ok";
    for (const toolCall of processedToolCalls) {
      if (toolCall.processedResponse === undefined) {
        status = "processing";
        break;
      }
      if (toolCall.processedResponse.ok === false) {
        status = "failed";
      }
    }
    return status;
  }, [processedToolCalls]);

  return (
    <div className="tool-calls">
      {expanded ? (
        <>
          <div className="tool-calls-summary">
            <WrappedButton type="ghost" onClick={() => setExpanded(false)}>
              <span style={{ marginRight: 8 }}>隐藏工具调用过程</span>
              <WrappedIcon
                lib="fa"
                prefix="fas"
                icon="chevron-up"
                className="tool-calls-summary-toggle"
              />
            </WrappedButton>
          </div>
          {processedToolCalls.map((toolCall) => (
            <ToolCallComponent
              id={toolCall.id}
              key={toolCall.id}
              functionName={toolCall.functionName}
              processedArguments={toolCall.processedArguments}
              processedResponse={toolCall.processedResponse}
              args={toolCall.args}
              response={toolCall.response}
            />
          ))}
        </>
      ) : (
        <div className="tool-calls-summary" onClick={() => setExpanded(true)}>
          <span className={classNames("tool-calls-status", processStatus)}>
            {processStatus === "processing" ? (
              <WrappedIcon lib="fa" prefix="fas" icon="spinner" spinning />
            ) : processStatus === "ok" ? (
              <WrappedIcon lib="fa" prefix="far" icon="circle-check" />
            ) : (
              <WrappedIcon lib="fa" prefix="fas" icon="triangle-exclamation" />
            )}
            <span>
              {processStatus === "processing"
                ? "工具调用中"
                : processStatus === "ok"
                  ? "工具调用完成"
                  : "工具调用失败"}
            </span>
          </span>
          <WrappedIcon
            lib="fa"
            prefix="fas"
            icon="chevron-down"
            className="tool-calls-summary-toggle"
          />
        </div>
      )}
    </div>
  );
}

interface ToolCallProps {
  id: string;
  functionName: string;
  processedArguments: ProcessedValue;
  processedResponse?: ProcessedValue;
  args: string;
  response?: string;
}

function ToolCallComponent({
  functionName,
  processedArguments,
  processedResponse,
  args,
  response,
}: ToolCallProps) {
  const { toolNames } = useChatViewContext();

  return (
    <div className="tool-call">
      <div className="tool-call-function-name">
        <WrappedIcon lib="antd" theme="outlined" icon="function" />
        {toolNames.get(functionName) ?? functionName}
      </div>
      <WrappedTag outline>Arguments</WrappedTag>
      <div
        className={classNames("tool-call-function-arguments", {
          failed: !processedArguments.ok,
        })}
      >
        <pre>
          <code>
            {processedArguments.ok ? dumpYaml(processedArguments.data) : args}
          </code>
        </pre>
      </div>
      {processedResponse ? (
        <>
          <WrappedTag outline>Response</WrappedTag>
          <div
            className={classNames("tool-call-function-response", {
              failed: !processedResponse.ok,
            })}
          >
            <pre>
              <code>
                {processedResponse.ok
                  ? dumpYaml(processedResponse.data)
                  : response}
              </code>
            </pre>
          </div>
        </>
      ) : (
        <div className="tool-call-wait-response">…</div>
      )}
    </div>
  );
}

function dumpYaml(value: unknown) {
  return safeDump(value, {
    schema: JSON_SCHEMA,
    skipInvalid: true,
    noRefs: true,
    noCompatMode: true,
  });
}
