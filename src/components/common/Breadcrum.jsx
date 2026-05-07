import { useNavigate } from "react-router-dom"

export default function Breadcrum({ breadcrumbs }) {
    const navigate = useNavigate();
    return (
        <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
            <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li
                        key={index}
                        className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                        aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                    >
                        {index === breadcrumbs.length - 1 ? (
                            breadcrumb.name
                        ) : (
                            <a onClick={() => navigate(breadcrumb.url)}>{breadcrumb.name}</a>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}