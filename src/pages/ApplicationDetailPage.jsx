import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplicationById, updateStatus, deleteApplication } from '../api/applicationApi';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUSES = ['APPLIED', 'INTERVIEW_SCHEDULED', 'OFFER_RECEIVED', 'REJECTED'];

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState('');

    const { data: app, isLoading } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplicationById(id).then(r => r.data),
        onSuccess: (data) => setSelectedStatus(data.status),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['application', id] });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Status updated!');
        },
        onError: () => toast.error('Failed to update status'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            toast.success('Application deleted');
            navigate('/applications');
        },
    });

    if (isLoading) return <LoadingSpinner />;
    if (!app) return <p>Application not found</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{app.jobTitle}</h1>
                    <p className="text-gray-500">{app.companyName}</p>
                </div>
                <button
                    onClick={() => {
                        if (confirm('Delete this application?')) {
                            deleteMutation.mutate(app.id);
                        }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                     rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* info cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card">
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <StatusBadge status={app.status} />
                </div>
                <div className="card">
                    <p className="text-sm text-gray-500 mb-1">Match Score</p>
                    {app.matchScore ? (
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {app.matchScore}%
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-green-500 h-1.5 rounded-full"
                                    style={{ width: `${app.matchScore}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Not calculated</p>
                    )}
                </div>
            </div>

            {/* update status */}
            <div className="card">
                <h2 className="font-semibold text-gray-900 mb-3">Update Status</h2>
                <div className="grid grid-cols-2 gap-2">
                    {STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => {
                                setSelectedStatus(status);
                                updateMutation.mutate({ id: app.id, status });
                            }}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left
                ${app.status === status
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* job description */}
            {app.description && (
                <div className="card">
                    <h2 className="font-semibold text-gray-900 mb-3">Job Description</h2>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {app.description}
                    </p>
                </div>
            )}

            {/* interview prep link */}
            {app.status === 'INTERVIEW_SCHEDULED' && (
                <Link
                    to={`/interview-prep?applicationId=${app.id}&company=${app.companyName}&role=${app.jobTitle}`}
                    className="card flex items-center gap-3 hover:shadow-md transition-shadow
                     bg-green-50 border-green-200"
                >
                    <GraduationCap size={24} className="text-green-600" />
                    <div>
                        <p className="font-semibold text-green-800">Interview scheduled!</p>
                        <p className="text-sm text-green-600">
                            Get AI-generated interview questions and prep plan →
                        </p>
                    </div>
                </Link>
            )}
        </div>
    );
}