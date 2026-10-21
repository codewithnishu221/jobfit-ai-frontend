import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { User, FileText, Briefcase, Target, TrendingUp, Calendar } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const STATUS_COLORS = {
    APPLIED: '#3b82f6',
    INTERVIEW_SCHEDULED: '#f59e0b',
    OFFER_RECEIVED: '#10b981',
    REJECTED: '#ef4444',
};

export default function ProfilePage() {
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile().then(r => r.data),
    });

    if (isLoading) return <LoadingSpinner message="Loading profile..." />;
    if (!profile) return <p>Could not load profile</p>;

    const pieData = profile.applicationsByStatus
        ? Object.entries(profile.applicationsByStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({ name: status.replace('_', ' '), value: count, status }))
        : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

            {/* user card */}
            <div className="card flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center
                        justify-center text-2xl font-bold text-blue-700">
                    {profile.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Member since {new Date(profile.joinedAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.profileCompleteness === 'COMPLETE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
          }`}>
            {profile.profileCompleteness === 'COMPLETE'
                ? '✓ Profile Complete'
                : 'Profile Incomplete'
            }
          </span>
                </div>
            </div>

            {/* stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Applications',
                        value: profile.totalApplications,
                        icon: Briefcase,
                        color: 'text-blue-600', bg: 'bg-blue-50'
                    },
                    {
                        label: 'Resumes Uploaded',
                        value: profile.totalResumes,
                        icon: FileText,
                        color: 'text-purple-600', bg: 'bg-purple-50'
                    },
                    {
                        label: 'Avg Match Score',
                        value: profile.averageMatchScore
                            ? `${profile.averageMatchScore}%`
                            : '—',
                        icon: Target,
                        color: 'text-green-600', bg: 'bg-green-50'
                    },
                    {
                        label: 'Interview Rate',
                        value: profile.interviewRate
                            ? `${profile.interviewRate}%`
                            : '—',
                        icon: TrendingUp,
                        color: 'text-orange-600', bg: 'bg-orange-50'
                    },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card">
                        <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                            <Icon size={18} className={color} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* pie chart */}
                {pieData.length > 0 && (
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Applications by Status
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* recent activity */}
                {profile.recentActivity?.length > 0 && (
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {profile.recentActivity.map(app => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between py-2
                             border-b border-gray-50 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {app.jobTitle}
                                        </p>
                                        <p className="text-xs text-gray-500">{app.companyName}</p>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={app.status} />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* this month */}
            <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-600" />
                    <div>
                        <p className="font-medium text-blue-900">
                            This Month: {profile.applicationsThisMonth} application
                            {profile.applicationsThisMonth !== 1 ? 's' : ''}
                        </p>
                        {profile.highestMatchScore && (
                            <p className="text-sm text-blue-600">
                                Best match score: {profile.highestMatchScore}%
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}