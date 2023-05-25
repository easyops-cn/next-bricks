/** @jsx LegacyReact.createElement */
/** @jsxFrag LegacyReact.Fragment */
import type React from "react";
import { httpErrorToString } from "@next-core/runtime";

interface ErrorBoundaryState {
  error: unknown;
}

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

export function getLegacyErrorBoundary(LegacyReact: typeof React) {
  class LegacyErrorBoundary extends LegacyReact.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
  > {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      // Update state so the next render will show the fallback UI.
      return { error };
    }

    /* componentDidCatch(error, info) {
      // You can also log the error to an error reporting service
      logErrorToMyService(error, info);
    } */

    render(): React.ReactNode {
      if (this.state.error) {
        // You can render any custom fallback UI
        return (
          <div data-testid="error-boundaray">
            {/* this.props.t(K.SOMETHING_WENT_WRONG) */}
            <h3>Something went wrong</h3>
            <p>{httpErrorToString(this.state.error)}</p>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return LegacyErrorBoundary;
}
