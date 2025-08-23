import React, { ErrorInfo, ReactNode } from 'react';
import Button from './Button';
import { IconAlertTriangle, IconRefresh } from '../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  declare state: State;
  declare props: Readonly<Props>;
  declare setState: (state: Partial<State>) => void;
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // In a real app, you'd send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-slate-300 mb-6">
              We encountered an unexpected error. Don&apos;t worry, your work is safe.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                leftIcon={<IconRefresh className="w-4 h-4" />}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="secondary"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            
            {true && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-slate-800 rounded text-xs text-red-300 font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;