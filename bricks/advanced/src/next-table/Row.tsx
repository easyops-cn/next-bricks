import React, { Ref, forwardRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Row = forwardRef(function LegacyRow(
  props: RowProps,
  ref: Ref<HTMLTableRowElement>
): React.ReactElement {
  return <tr {...props} ref={ref} />;
});

interface DraggableRowProps extends RowProps {
  "data-row-key": string;
}

export function DraggableRow(props: DraggableRowProps): React.ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
    touchAction: "none",
    ...(isDragging ? { position: "relative", zIndex: 999 } : {}),
  };

  return (
    <Row
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
}
