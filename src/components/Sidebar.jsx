import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard, FileText, Briefcase, Target,
    Sparkles, GraduationCap, User, LogOut, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/applications', icon: Briefcase, label: 'Applications' },
    { path: '/resumes', icon: FileText, label: 'Resumes' },
    { path: '/match-score', icon: Target, label: 'Match Score' },
    { path: '/generate-resume', icon: Sparkles, label: 'Generate Resume' },
    { path: '/interview-prep', icon: GraduationCap, label: 'Interview Prep' },
    { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
            {/* logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">JobFit AI</span>
                </div>
            </div>

            {/* navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* user info + logout */}
            <div className="px-4 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600
                     hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}