import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = "", id, ...props }, ref) => {
        return (
            <div className="mb-3">
                <label htmlFor={id} className="form-label small fw-semibold text-muted">
                    {label}
                </label>
                <div className="input-group has-validation">
                    {icon && (
                        <span className="input-group-text border-end-0 text-muted">
                            <i className={`fas ${icon}`}></i>
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={`form-control ${icon ? "border-start-0 ps-0" : ""} ${error ? "is-invalid" : ""} ${className}`}
                        {...props}
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
            </div>
        );
    }
);

export default Input;
