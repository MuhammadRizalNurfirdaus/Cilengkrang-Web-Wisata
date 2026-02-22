import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", padding: "20px", background: "var(--body-bg, #f8f9fa)", color: "var(--body-color, #212529)" }}>
                    <div className="text-center" style={{ maxWidth: "500px" }}>
                        <i className="fas fa-exclamation-triangle fa-4x text-warning mb-4 d-block"></i>
                        <h1 className="fw-bold mb-3">Terjadi Kesalahan</h1>
                        <p className="text-muted mb-4">Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.</p>
                        <button className="btn btn-success rounded-pill px-4" onClick={() => window.location.reload()}>
                            <i className="fas fa-redo me-2"></i>Muat Ulang
                        </button>
                        <details className="mt-4 text-start small text-muted" style={{ whiteSpace: "pre-wrap" }}>
                            <summary className="mb-2" style={{ cursor: "pointer" }}>Detail Teknis</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
