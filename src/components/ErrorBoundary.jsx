import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 mb-2">Terjadi Kesalahan</h1>
            <p className="text-neutral-500 text-sm mb-8">
              Maaf, terjadi kesalahan tak terduga pada sistem kami.
            </p>
            <Button 
              fullWidth
              onClick={() => window.location.reload()}
              className="flex justify-center items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
