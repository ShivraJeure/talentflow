
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("TalentFlow rendering error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              TalentFlow encountered an unexpected error. Please try again.
            </p>

            <button
              onClick={this.handleRetry}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
