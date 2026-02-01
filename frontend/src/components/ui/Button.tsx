import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link" | "outline-success";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: ReactNode;
}

export default function Button({
    variant = "success",
    size = "md",
    isLoading = false,
    className = "",
    disabled,
    children,
    ...props
}: ButtonProps) {
    const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

    return (
        <button
            className={`btn btn-${variant} ${sizeClass} ${className} d-flex align-items-center justify-content-center gap-2`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
            {children}
        </button>
    );
}
