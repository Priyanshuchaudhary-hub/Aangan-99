import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export interface FolderErrorBoundaryProps {
  children: ReactNode;
  folderTitle?: string;
  onClose?: () => void;
}

export interface FolderErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FolderErrorBoundary extends React.Component<
  FolderErrorBoundaryProps,
  FolderErrorBoundaryState
> {
  constructor(props: FolderErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): FolderErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FolderErrorBoundary] Uncaught folder render error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-[#1a100a] text-[#fef3c7] font-mono rounded-lg border-2 border-[#b91c1c] shadow-lg space-y-4 max-w-lg mx-auto my-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#4d2a1b] pb-2 text-rose-400">
            <div className="flex items-center gap-2 font-bold font-pixel text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>SYSTEM ERROR: FOLDER FAULT</span>
            </div>
            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                className="p-1 hover:bg-rose-900/50 rounded text-gray-300 hover:text-white"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1 text-gray-300">
            <p className="font-bold text-amber-300">
              Could not render contents for: {this.props.folderTitle || 'Folder'}
            </p>
            <p className="text-[11px] text-rose-300/90 font-mono bg-black/40 p-2 rounded border border-rose-900/50 break-words">
              {this.state.error?.message || 'Unknown runtime exception'}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-3 py-1.5 bg-[#000080] hover:bg-[#1084d0] text-white font-pixel text-xs rounded border border-t-white border-l-white border-r-black border-b-black flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RETRY</span>
            </button>

            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                className="px-3 py-1.5 bg-[#7f1d1d] hover:bg-[#991b1b] text-white font-pixel text-xs rounded border border-t-white border-l-white border-r-black border-b-black shadow"
              >
                CLOSE WINDOW
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
