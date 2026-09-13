import { Component } from 'react';

/**
 * Catches rendering errors thrown by the WebGL hero scene (or any other
 * child) and renders nothing instead — the rest of the page survives.
 */
export default class WebGLErrorBoundary extends Component {
  state = { errored: false };

  static getDerivedStateFromError() {
    return { errored: true };
  }

  componentDidCatch(error, info) {
    console.warn('[WebGLErrorBoundary] caught:', error, info);
  }

  render() {
    if (this.state.errored) return null;
    return this.props.children;
  }
}
