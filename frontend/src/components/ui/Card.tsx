import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../api/client";

interface CardProps {
    image?: string | null;
    title: string;
    subtitle?: string;
    description?: string;
    linkTo?: string;
    linkText?: string;
    footer?: ReactNode;
    className?: string;
    badge?: string;
}

export default function Card({
    image,
    title,
    subtitle,
    description,
    linkTo,
    linkText = "Lihat Detail",
    footer,
    className = "",
    badge,
}: CardProps) {
    return (
        <div className={`card h-100 shadow-sm hover-shadow transition-all ${className}`}>
            {image && (
                <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                    <img
                        src={getImageUrl(image)}
                        className="card-img-top h-100 w-100 object-fit-cover transition-transform"
                        alt={title}
                    />
                    {badge && (
                        <span className="position-absolute top-0 end-0 m-3 badge bg-success shadow-sm">
                            {badge}
                        </span>
                    )}
                </div>
            )}
            <div className="card-body d-flex flex-column">
                {subtitle && <h6 className="card-subtitle mb-2 text-muted small">{subtitle}</h6>}
                <h5 className="card-title fw-bold text-success mb-3">{title}</h5>
                {description && (
                    <p className="card-text text-muted mb-4 flex-grow-1 line-clamp-3">
                        {description}
                    </p>
                )}
                {linkTo && (
                    <Link to={linkTo} className="btn btn-outline-success btn-sm align-self-start mt-auto">
                        {linkText} <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                )}
                {footer}
            </div>
        </div>
    );
}
