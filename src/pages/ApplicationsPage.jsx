import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllApplications, deleteApplication } from '../api/applicationApi';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, ChevronRight, Briefcase } from 'lucide-react';

export default function ApplicationsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['applications', page],
        queryFn: () => getAllApplications(page, 10).then(r => r.data),
        keepPreviousData: true,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Application deleted');
        },
        onError: () => toast.error('Failed to delete application'),
    });

    const filtered = data?.content?.filter(app =>
        app.companyName.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                    <p className="text-gray-500 mt-1">
                        {data?.totalElements || 0} total applications
                    </p>
                </div>
                <Link to="/applications/new" className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    New Application
                </Link>
            </div>

            {/* search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                    className="input-field pl-10"
                    placeholder="Search by company or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : filtered.length === 0 ? (
                <div className="card text-center py-12">
                    <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No applications yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Start tracking your job applications
                    </p>
                    <Link to="/applications/new" className="btn-primary inline-flex">
                        Add first application
                    </Link>
                </div>
            ) : (
                <>
                    <div className="card p-0 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Role / Company
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Match Score
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Applied
                                </th>
                                <th className="px-6 py-3" />
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {filtered.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{app.jobTitle}</p>
                                        <p className="text-sm text-gray-500">{app.companyName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {app.matchScore ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${app.matchScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">
                            {app.matchScore}%
                          </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this application?')) {
                                                        deleteMutation.mutate(app.id);
                                                    }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500
                                     hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <Link
                                                to={`/applications/${app.id}`}
                                                className="p-1.5 text-gray-400 hover:text-blue-600
                                     hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination */}
                    {data?.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="btn-secondary"
                            >
                                Previous
                            </button>
                            <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page + 1} of {data.totalPages}
              </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= data.totalPages - 1}
                                className="btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}