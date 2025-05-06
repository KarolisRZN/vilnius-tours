import { Component } from "react";
import NotFound from "./NotFound";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Optional: log error or info
  }

  render() {
    if (this.state.hasError) {
      return <NotFound message="Something went wrong." />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
