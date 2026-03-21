// Form validation utility functions

export const ValidationRules = {
    // Email validation
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Phone validation (Indonesian format)
    isValidPhoneNumber: (phone: string): boolean => {
        if (!phone) return true; // Optional field
        const phoneRegex = /^(?:\+62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone.replace(/\s|-/g, ""));
    },

    // Password strength validation
    isValidPassword: (password: string): boolean => {
        // Min 6 characters
        return password.length >= 6;
    },

    // Strong password check
    getPasswordStrength: (password: string): "weak" | "medium" | "strong" => {
        if (password.length < 6) return "weak";
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

        const strength =
            [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

        if (strength <= 2) return "weak";
        if (strength === 3) return "medium";
        return "strong";
    },

    // Phone number formatter
    formatPhoneNumber: (phone: string): string => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("62")) {
            return `+${cleaned}`;
        }
        if (cleaned.startsWith("0")) {
            return `+62${cleaned.slice(1)}`;
        }
        return cleaned;
    },

    // Validation messages
    getValidationError: (field: string, rule: string): string => {
        const messages: Record<string, Record<string, string>> = {
            email: {
                required: "Email wajib diisi",
                invalid: "Format email tidak valid (contoh: nama@email.com)",
            },
            password: {
                required: "Password wajib diisi",
                weak: "Password minimal 6 karakter",
                mismatch: "Password konfirmasi tidak sesuai",
            },
            nama: {
                required: "Nama lengkap wajib diisi",
                minLength: "Nama minimal 2 karakter",
            },
            noHp: {
                invalid: "Format nomor handphone tidak valid (contoh: 08123456789 atau +62812345678)",
            },
            confirmPassword: {
                required: "Konfirmasi password wajib diisi",
            },
            judul: {
                required: "Judul wajib diisi",
                minLength: "Judul minimal 3 karakter",
            },
            isi: {
                required: "Isi konten wajib diisi",
                minLength: "Isi konten minimal 10 karakter",
            },
        };

        return messages[field]?.[rule] || `${field} tidak valid`;
    },
};

// Validation hook type hints
export interface ValidationError {
    field: string;
    message: string;
}

// Multi-field validation
export const validateForm = (
    formData: Record<string, unknown>,
    rules: Record<string, Array<[string, (value: unknown) => boolean]>>
): ValidationError[] => {
    const errors: ValidationError[] = [];

    Object.entries(rules).forEach(([field, fieldRules]) => {
        fieldRules.forEach(([ruleName, validate]) => {
            if (!validate(formData[field])) {
                errors.push({
                    field,
                    message: ValidationRules.getValidationError(field, ruleName),
                });
            }
        });
    });

    return errors;
};
