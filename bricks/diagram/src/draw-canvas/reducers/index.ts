import { Reducer } from "react";
import type { DrawCanvasAction, DrawCanvasState } from "./interfaces";
import { cells } from "./cells";
import { layoutKey } from "./layoutKey";

type ReducersMapObject<S, A> = {
  [K in keyof S]: Reducer<S[K], A>;
};

function combineReducers<S, A>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> {
  return ((state, action) =>
    Object.fromEntries(
      Object.entries<Reducer<any, A>>(reducers).map(([key, value]) => [
        key,
        value(state[key as keyof S], action),
      ])
    )) as Reducer<S, A>;
}

export const rootReducer = combineReducers<DrawCanvasState, DrawCanvasAction>({
  cells,
  layoutKey,
});
