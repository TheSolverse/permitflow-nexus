import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F1B13] text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2D22] border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Error Caught</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              An unhandled rendering exception occurred. You can safely reload the page or clear local storage cache to restore session data.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-100 dark:bg-[#122017] rounded-xl text-[11px] font-mono text-rose-700 dark:text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#2E6F40] hover:bg-[#235833] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Clear Storage & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
