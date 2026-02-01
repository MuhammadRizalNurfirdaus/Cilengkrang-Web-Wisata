import { ReactNode } from "react";

interface AlertProps {
    variant?: "success" | "danger" | "warning" | "info";
    message: string | ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function Alert({ variant = "info", message, onClose, className = "" }: AlertProps) {
    return (
        <div className={`alert alert-${variant} alert-dismissible fade show ${className}`} role="alert">
            {message}
            {onClose && (
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
            )}
        </div>
    );
}
