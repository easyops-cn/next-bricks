export function setDragImage(
  e: DragEvent | React.DragEvent,
  title: string
): void {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);
  const context = canvas.getContext("2d");
  canvas.width = context.measureText(title).width + 60;
  canvas.height = 20;
  canvas.style.position = "absolute";
  canvas.style.left = "-100%";
  canvas.style.zIndex = "-100";

  context.fillStyle = "#333333";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#999999";
  context.font = "bold 14px Arial";
  context.fillText(title, 20, 15);

  e.dataTransfer.setDragImage(canvas, 0, 0);
}
