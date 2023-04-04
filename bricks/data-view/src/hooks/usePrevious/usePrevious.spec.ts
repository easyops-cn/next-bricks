import { renderHook } from "@testing-library/react";
import {usePrevious} from './index.js';
import { describe, test, expect } from "@jest/globals";

const setUp = () => renderHook(( state=0 ) => usePrevious(state));
describe("usePrevious", () =>{
    test('should return undefined on initial render', () => {
        const { result } = renderHook(() => usePrevious());
        expect(result.current).toBeUndefined();
    });
    test('should always return previous state after each update', () => {
        const { result, rerender } = setUp();

        rerender(2);
        expect(result.current).toBe(0);

        rerender(4);
        expect(result.current).toBe(2);

        rerender(6);
        expect(result.current).toBe(4);
    });
})
