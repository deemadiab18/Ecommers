import { Component } from "react";
import Button from "./ui/Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary", error, info?.componentStack);
    }
  }

  handleRetry = () => {
    this.setState((state) => ({ error: null, resetKey: state.resetKey + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
          <p className="max-w-md text-sm text-muted">
            The page hit an unexpected error. You can retry or head back home.
          </p>
          {process.env.NODE_ENV === "development" ? (
            <pre className="max-w-lg overflow-auto rounded-xl bg-surface p-3 text-left text-xs text-discount">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.location.assign("/")}>
              Go home
            </Button>
          </div>
        </div>
      );
    }
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}