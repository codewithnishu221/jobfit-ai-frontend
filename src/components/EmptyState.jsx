import { Link } from 'react-router-dom';

export default function EmptyState({
                                       icon: Icon,
                                       title,
                                       description,
                                       actionText,
                                       actionLink,
                                       onAction,
                                   }) {
    return (
        <div className="card text-center py-12 flex flex-col items-center justify-center">
            {Icon && (
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                    <Icon size={32} />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && (
                <p className="text-gray-500 text-sm max-w-sm mb-5">{description}</p>
            )}

            {actionText && actionLink && (
                <Link to={actionLink} className="btn-primary inline-flex">
                    {actionText}
                </Link>
            )}

            {actionText && onAction && !actionLink && (
                <button onClick={onAction} className="btn-primary inline-flex">
                    {actionText}
                </button>
            )}
        </div>
    );
}