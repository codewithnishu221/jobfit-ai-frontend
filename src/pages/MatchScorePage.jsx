import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getMatchScore } from '../api/matchApi';
import { getAllResumes } from '../api/resumeApi';
import toast from 'react-hot-toast';
import { Target, AlertCircle, CheckCircle } from 'lucide-react';

export default function MatchScorePage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data: resumesData } = useQuery({
        queryKey: ['resumes'],
        queryFn: () => getAllResumes().then(r => r.data),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const response = await getMatchScore({
                resumeId: parseInt(data.resumeId),
                jobDescription: data.jobDescription,
            });
            setResult(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to calculate match score'
            );
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-500';
    };

    const getScoreBg = (score) => {
        if (score >= 75) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Match Score</h1>
                <p className="text-gray-500 mt-1">
                    Check how well your resume matches a job description
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Resume *
                    </label>
                    <select
                        className="input-field"
                        {...register('resumeId', { required: 'Please select a resume' })}
                    >
                        <option value="">Choose a resume...</option>
                        {resumesData?.content?.map(r => (
                            <option key={r.id} value={r.id}>{r.originalFileName}</option>
                        ))}
                    </select>
                    {errors.resumeId && (
                        <p className="text-red-500 text-xs mt-1">{errors.resumeId.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description *
                    </label>
                    <textarea
                        className="input-field h-48 resize-none"
                        placeholder="Paste the full job description here..."
                        {...register('jobDescription', {
                            required: 'Job description is required',
                            minLength: { value: 50, message: 'Minimum 50 characters' }
                        })}
                    />
                    {errors.jobDescription && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.jobDescription.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Target size={18} />
                    {loading ? 'Analyzing... (this takes 15-30 seconds)' : 'Calculate Match Score'}
                </button>
            </form>

            {loading && (
                <div className="card text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2
                          border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                        AI is analyzing your resume...
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        This may take up to 30 seconds
                    </p>
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    {/* score card */}
                    <div className="card text-center">
                        <p className="text-sm text-gray-500 mb-2">Match Score</p>
                        <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div
                                className={`h-3 rounded-full transition-all duration-700 ${getScoreBg(result.score)}`}
                                style={{ width: `${result.score}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-3">{result.explanation}</p>
                    </div>

                    {/* missing skills */}
                    {result.missingSkills?.length > 0 && (
                        <div className="card">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle size={18} className="text-orange-500" />
                                <h3 className="font-semibold text-gray-900">Missing Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.missingSkills.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full
                               text-sm font-medium"
                                    >
                    {skill}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.score >= 75 && (
                        <div className="card bg-green-50 border-green-200">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                <p className="text-green-800 font-medium">
                                    Strong match! This role is well-suited for your profile.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}