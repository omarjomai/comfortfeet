import { Component, type ReactNode } from 'react';

/** Shows the real error instead of a blank page, so a customer (or the owner) can report it. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error('ComfortFeet crash:', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container section center">
        <h1>Oups, une erreur est survenue</h1>
        <p className="muted">Votre panier est conservé. Rechargez la page pour continuer.</p>
        <button className="btn-primary" onClick={() => location.reload()}>Recharger la page</button>
        <pre className="err-detail">{this.state.error.name}: {this.state.error.message}</pre>
      </div>
    );
  }
}
