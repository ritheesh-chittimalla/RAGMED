import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 antialiased">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive">Application Recovered</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Unexpected Render Error</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering error occurred. The system trapped the error to prevent application downtime.'}
              </p>
            </div>

            {this.state.errorInfo && (
              <details className="w-full text-left bg-muted p-3 rounded-xl border border-border/50 text-[10px] font-mono text-muted-foreground overflow-auto max-h-32">
                <summary className="cursor-pointer font-bold uppercase text-[9px] tracking-wider text-foreground mb-1">
                  Error Details & Stack
                </summary>
                {this.state.error?.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            )}

            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-card border border-border text-foreground hover:bg-muted py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-primary text-primary-foreground hover:brightness-110 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Home className="h-3.5 w-3.5" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
