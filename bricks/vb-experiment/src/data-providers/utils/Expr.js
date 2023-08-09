/**
 * @overload
 * @param {"=" | "~" | "track context" | "track state"} flag
 * @param {any} expr
 * @return {any}
 */

/**
 * @overload
 * @param {any} expr
 * @return {any}
 */

/**
 * Expression
 * @param {string} flag
 * @param {any} expr
 * @returns {any}
 */
export function Expr(flag, expr) {
  throw new Error("Error: expression not transpiled!");
}
