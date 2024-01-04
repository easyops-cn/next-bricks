import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactUseBrick } from "@next-core/react-runtime";
import { checkIfByTransform } from "@next-core/runtime";
import type {
  DiagramEdge,
  LineLabelConf,
  PositionTuple,
  RefRepository,
  RenderedLineLabel,
  TextOptions,
} from "./interfaces";

export interface LineLabelComponentGroupProps {
  labels?: RenderedLineLabel[];
  onRendered?: (refRepository: RefRepository | null) => void;
}

export function LineLabelComponentGroup({
  labels,
  onRendered,
}: LineLabelComponentGroupProps): JSX.Element {
  const [rendered, setRendered] = useState(false);
  const [renderedIds, setRenderedIds] = useState<string[]>([]);
  const refRepository = useMemo<RefRepository>(() => new Map(), []);

  const handleRenderer = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        refRepository.set(id, element);
      }
      setRenderedIds((previous) =>
        previous.includes(id) ? previous : previous.concat(id)
      );
    },
    [refRepository]
  );

  const handleUnmount = useCallback(
    (id: string) => {
      setRenderedIds((previous) => {
        const index = previous.indexOf(id);
        return index === -1
          ? previous
          : previous.slice(0, index).concat(previous.slice(index + 1));
      });
      refRepository.delete(id);
    },
    [refRepository]
  );

  useEffect(() => {
    // All nodes have been rendered.
    setRendered(!labels?.some((label) => !renderedIds.includes(label.id)));
  }, [labels, renderedIds]);

  useEffect(
    () => {
      onRendered?.(rendered ? refRepository : null);
    },
    // Dot not re-run effect when `onRendered` changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [/* onRendered, */ refRepository, rendered]
  );

  return (
    <React.Fragment>
      {labels?.map(({ text, label, position, id, edge }) =>
        label ? (
          <div
            key={id}
            className="line-label"
            style={{
              left: position[0],
              top: position[1],
            }}
          >
            <LineLabelComponent
              id={id}
              edge={edge}
              label={label}
              onRendered={handleRenderer}
              onUnmount={handleUnmount}
            />
          </div>
        ) : (
          <LineTextComponent
            key={id}
            id={id}
            text={text!}
            position={position}
            onRendered={handleRenderer}
          />
        )
      )}
    </React.Fragment>
  );
}

export interface LineTextComponentProps {
  id: string;
  text: TextOptions;
  position: PositionTuple;
  onRendered?: (id: string, element: HTMLElement | null) => void;
  // onUnmount?: (id: string) => void;
}

export function LineTextComponent({
  id,
  text,
  position,
  onRendered /* , onUnmount */,
}: LineTextComponentProps): JSX.Element {
  const refCallback = useCallback(
    (element: HTMLDivElement) => {
      onRendered?.(id, element);
    },
    [id, onRendered]
  );

  return (
    <div
      className="line-label"
      ref={refCallback}
      style={{
        left: position[0],
        top: position[1],
        ...text!.style,
      }}
    >
      {text!.content}
    </div>
  );
}

// export const LineLabelComponentGroup = React.memo(LegacyLineLabelComponentGroup);

export interface LineLabelComponentProps {
  id: string;
  edge: DiagramEdge;
  label: LineLabelConf;
  onRendered?: (id: string, element: HTMLElement | null) => void;
  onUnmount?: (id: string) => void;
}

export function LineLabelComponent({
  id,
  edge,
  label,
  onRendered,
  onUnmount,
}: LineLabelComponentProps): JSX.Element | null {
  const useBrick = useMemo(
    () => (checkIfByTransform(label, { edge }) ? label.useBrick : null),
    [edge, label]
  );

  const memoizedData = useMemo(() => ({ edge }), [edge]);

  useEffect(() => {
    if (!useBrick) {
      // Keep the same time delay for reporting rendered.
      setTimeout(() => {
        onRendered?.(id, null);
      });
    }
  }, [id, onRendered, useBrick]);

  useEffect(
    () => {
      return () => {
        onUnmount?.(id);
      };
    },
    // Only unmount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        // Todo: correctly wait for `useBrick` in v3 to be rendered (after layout)
        // Wait a macro task to let `useBrick` to be rendered.
        setTimeout(() => {
          onRendered?.(id, element.parentElement);
        });
      }
    },
    [id, onRendered]
  );

  const ignoredCallback = useCallback(() => {
    setTimeout(() => {
      onRendered?.(id, null);
    });
  }, [id, onRendered]);

  if (!useBrick) {
    return null;
  }

  return (
    <ReactUseBrick
      refCallback={refCallback}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore For v3 only
      ignoredCallback={ignoredCallback}
      useBrick={useBrick}
      data={memoizedData}
    />
  );
}
