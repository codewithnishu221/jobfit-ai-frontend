const STATUS_STYLES = {
    APPLIED: 'bg-blue-100 text-blue-700',
    INTERVIEW_SCHEDULED: 'bg-yellow-100 text-yellow-700',
    OFFER_RECEIVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
    APPLIED: 'Applied',
    INTERVIEW_SCHEDULED: 'Interview Scheduled',
    OFFER_RECEIVED: 'Offer Received',
    REJECTED: 'Rejected',
};

export default function StatusBadge({ status }) {
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
      {STATUS_LABELS[status] || status}
    </span>
    );
}