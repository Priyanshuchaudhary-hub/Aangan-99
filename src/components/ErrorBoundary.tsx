import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nostalgia Machine Error Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('nostalgia_has_seen_boot');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#120f0e] text-[#fcd34d] font-mono flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] [background-size:100%_4px] pointer-events-none z-10" />
          
          <div className="relative z-20 max-w-xl w-full bg-[#1c140e] border-2 border-[#f59e0b] rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#352012] border border-[#f59e0b]/60 flex items-center justify-center mx-auto text-[#f59e0b]">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#fcd34d] tracking-wide font-pixel">
                SIGNAL TEMPORARILY LOST
              </h1>
              <p className="text-xs sm:text-sm text-[#d6c4a8] leading-relaxed">
                The nostalgia transmitter experienced a brief hiccup while tuning analog frequencies.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-[#0d0a08] border border-[#443021] text-[11px] text-left text-[#f87171] overflow-x-auto max-h-32">
                <span className="font-bold text-[#f59e0b]">Diagnostic: </span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retune Antenna (Reload)</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#261912] hover:bg-[#38261b] border border-[#6b472e] text-[#fcd34d] text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Reset Memory Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
