import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

export function isInEmbedded(
  model: monaco.editor.ITextModel,
  position: monaco.Position
) {
  const previousStart = findPreviousMatch(model, "<%", position);
  if (!previousStart) {
    return false;
  }
  const nextEnd = findNextMatch(model, "%>", position);
  if (!nextEnd) {
    return false;
  }
  const previousEnd = findPreviousMatch(model, "%>", position);
  if (
    previousEnd &&
    previousStart.range
      .getEndPosition()
      .isBefore(previousEnd.range.getStartPosition())
  ) {
    return false;
  }
  const nextStart = findNextMatch(model, "<%", position);
  if (
    nextStart &&
    nextStart.range.getStartPosition().isBefore(nextEnd.range.getEndPosition())
  ) {
    return false;
  }
  return true;
}

/**
 * Find the previous match of the word in the model, but no loops to the end.
 */
function findPreviousMatch(
  model: monaco.editor.ITextModel,
  word: string,
  position: monaco.Position
) {
  const match = model.findPreviousMatch(
    word,
    position,
    false,
    false,
    null,
    false
  );
  if (match && position.isBefore(match.range.getStartPosition())) {
    return null;
  }
  return match;
}

/**
 * Find the next match of the word in the model, but no loops to the beginning.
 */
function findNextMatch(
  model: monaco.editor.ITextModel,
  word: string,
  position: monaco.Position
) {
  const match = model.findNextMatch(word, position, false, false, null, false);
  if (match && match.range.getEndPosition().isBefore(position)) {
    return null;
  }
  return match;
}
