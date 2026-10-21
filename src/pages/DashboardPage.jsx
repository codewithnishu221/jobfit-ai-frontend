import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProfile } from '../api/authApi';
import { getAllApplications } from '../api/applicationApi';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Briefcase, FileText, Target, TrendingUp, Plus, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile().then(r => r.data),
    });

    const { data: applications, isLoading: appsLoading } = useQuery({
        queryKey: ['applications', 0, 5],
        queryFn: () => getAllApplications(0, 5).then(r => r.data),
    });

    if (profileLoading) return <LoadingSpinner message="Loading dashboard..." />;

    const stats = [
        {
            label: 'Total Applications',
            value: profile?.totalApplications || 0,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Resumes Uploaded',
            value: profile?.totalResumes || 0,
            icon: FileText,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            label: 'Avg Match Score',
            value: profile?.averageMatchScore
                ? `${profile.averageMatchScore}%`
                : 'N/A',
            icon: Target,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Interview Rate',
            value: profile?.interviewRate
                ? `${profile.interviewRate}%`
                : 'N/A',
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here's your job search overview</p>
                </div>
                <Link to="/applications/new" className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    New Application
                </Link>
            </div>

            {/* stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card">
                        <div className={`inline-flex p-2.5 rounded-lg ${bg} mb-3`}>
                            <Icon size={20} className={color} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* profile completeness */}
            {profile?.profileCompleteness !== 'COMPLETE' && (
                <div className="card border-l-4 border-l-yellow-400">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        Complete your profile
                    </h3>
                    {profile?.profileCompleteness === 'NEEDS_RESUME' && (
                        <p className="text-gray-600 text-sm">
                            Upload your resume to start getting AI-powered match scores.{' '}
                            <Link to="/resumes" className="text-blue-600 hover:underline">
                                Upload now →
                            </Link>
                        </p>
                    )}
                    {profile?.profileCompleteness === 'NEEDS_APPLICATION' && (
                        <p className="text-gray-600 text-sm">
                            Add your first job application to start tracking.{' '}
                            <Link to="/applications/new" className="text-blue-600 hover:underline">
                                Add application →
                            </Link>
                        </p>
                    )}
                </div>
            )}

            {/* recent applications */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Applications
                    </h2>
                    <Link
                        to="/applications"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        View all <ChevronRight size={14} />
                    </Link>
                </div>

                {appsLoading ? (
                    <LoadingSpinner />
                ) : applications?.content?.length === 0 ? (
                    <div className="text-center py-8">
                        <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No applications yet</p>
                        <Link to="/applications/new" className="btn-primary mt-3 inline-flex">
                            Add your first application
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {applications?.content?.map(app => (
                            <Link
                                key={app.id}
                                to={`/applications/${app.id}`}
                                className="flex items-center justify-between p-3 rounded-lg
                           hover:bg-gray-50 transition-colors group"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{app.jobTitle}</p>
                                    <p className="text-sm text-gray-500">{app.companyName}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {app.matchScore && (
                                        <span className="text-sm font-medium text-green-600">
                      {app.matchScore}% match
                    </span>
                                    )}
                                    <StatusBadge status={app.status} />
                                    <ChevronRight
                                        size={16}
                                        className="text-gray-400 group-hover:text-gray-600"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/match-score" className="card hover:shadow-md transition-shadow group">
                    <Target size={24} className="text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Check Match Score</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        See how well your resume fits a job description
                    </p>
                </Link>
                <Link to="/generate-resume" className="card hover:shadow-md transition-shadow">
                    <FileText size={24} className="text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Generate Resume</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        AI-tailored resume for any job description
                    </p>
                </Link>
                <Link to="/interview-prep" className="card hover:shadow-md transition-shadow">
                    <TrendingUp size={24} className="text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Interview Prep</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Get AI-generated interview questions and prep plan
                    </p>
                </Link>
            </div>
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}