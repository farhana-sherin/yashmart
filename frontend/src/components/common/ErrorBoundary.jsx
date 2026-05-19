import React from "react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold">Something went wrong.</h1>
          <p className="mb-6 text-muted-foreground">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
