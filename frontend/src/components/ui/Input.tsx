import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = "", id, type, ...props }, ref) => {
        const isPasswordField = type === "password";
        const [showPassword, setShowPassword] = useState(false);

        const resolvedType = isPasswordField ? (showPassword ? "text" : "password") : type;

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
                        type={resolvedType}
                        className={`form-control ${icon ? "border-start-0 ps-0" : ""} ${isPasswordField ? "border-end-0 pe-0" : ""} ${error ? "is-invalid" : ""} ${className}`}
                        {...props}
                    />
                    {isPasswordField && (
                        <button
                            type="button"
                            className="input-group-text border-start-0 text-muted password-toggle-btn"
                            onClick={() => setShowPassword((previous) => !previous)}
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            aria-pressed={showPassword}
                        >
                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    )}
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
            </div>
        );
    }
);

export default Input;
