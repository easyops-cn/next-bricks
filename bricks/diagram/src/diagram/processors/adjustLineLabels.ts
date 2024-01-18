import type { RefRepository, RenderedLineLabel } from "../interfaces";

export function adjustLineLabels(
  renderedLineLabels: RenderedLineLabel[],
  lineLabelsRefRepository: RefRepository
) {
  for (const {
    id,
    position,
    placement,
    angle,
    size: _size,
  } of renderedLineLabels) {
    const label = lineLabelsRefRepository.get(id);
    if (label) {
      label.style.left = `${position[0]}px`;
      label.style.top = `${position[1]}px`;
      label.style.visibility = "visible";
      // label.classList.add(placement);
      if (placement !== "center" && angle !== undefined) {
        const [width, height] = _size ?? [0, 0];
        // Get the numbered direction of the line
        //
        // \    |    /
        //  \ 5 | 6 /
        //  4 \ | / 7
        // -----x-----
        //  3 / | \ 0
        //  / 2 | 1 \
        // /    |    \
        const tempDirection = Math.floor(
          ((angle < 0 ? Math.PI * 2 + angle : angle) / Math.PI) * 4
        );
        // Swap direction for end labels.
        const direction =
          placement === "start" ? tempDirection : (tempDirection + 4) % 8;
        const tangent = Math.tan(angle);
        const offsetAngle =
          angle + ((placement === "start" ? 1 : -1) * Math.PI) / 2;
        const offset = 2;
        const offsetSin = Math.sin(offsetAngle) * offset;
        const offsetCos = Math.cos(offsetAngle) * offset;
        let transform: string;
        switch (direction) {
          case 0:
            transform = `translate(0,${width * tangent + offsetSin}px)`;
            break;
          case 1:
            transform = `translate(${height / tangent - offsetCos}px,0)`;
            break;
          case 2:
            transform = `translate(calc(${
              height / tangent + offsetCos
            }px - 100%),0)`;
            break;
          case 3:
            transform = `translate(-100%,${-width * tangent - offsetSin}px)`;
            break;
          case 4:
            transform = `translate(-100%,calc(${
              -width * tangent + offsetSin
            }px - 100%))`;
            break;
          case 5:
            transform = `translate(calc(${
              -height / tangent - offsetCos
            }px - 100%),-100%)`;
            break;
          case 6:
            transform = `translate(${-height / tangent + offsetCos}px,-100%)`;
            break;
          default:
            transform = `translate(0,calc(${
              width * tangent - offsetSin
            }px - 100%))`;
        }
        label.style.transform = transform;
      }
    }
  }
}
