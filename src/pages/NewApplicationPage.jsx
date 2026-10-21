import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApplication, checkReuse } from '../api/applicationApi';
import { getAllResumes } from '../api/resumeApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Lightbulb, RefreshCw } from 'lucide-react';

export default function NewApplicationPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [reuseRecommendation, setReuseRecommendation] = useState(null);
    const [checkingReuse, setCheckingReuse] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const jobDescription = watch('jobDescription');

    const { data: resumesData } = useQuery({
        queryKey: ['resumes'],
        queryFn: () => getAllResumes().then(r => r.data),
    });

    const createMutation = useMutation({
        mutationFn: createApplication,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Application added successfully!');
            navigate(`/applications/${response.data.id}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create application');
        },
    });

    const handleCheckReuse = async () => {
        if (!jobDescription || jobDescription.length < 50) {
            toast.error('Please enter a job description first (minimum 50 characters)');
            return;
        }
        setCheckingReuse(true);
        try {
            const response = await checkReuse(jobDescription);
            setReuseRecommendation(response.data);
        } catch {
            toast.error('Could not check for similar applications');
        } finally {
            setCheckingReuse(false);
        }
    };

    const onSubmit = (data) => {
        createMutation.mutate({
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
            resumeId: data.resumeId ? parseInt(data.resumeId) : null,
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Application</h1>
                    <p className="text-gray-500 text-sm">Track a new job application</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="card space-y-4">
                    <h2 className="font-semibold text-gray-900">Job Details</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name *
                            </label>
                            <input
                                className="input-field"
                                placeholder="Google, Amazon..."
                                {...register('companyName', { required: 'Company name required' })}
                            />
                            {errors.companyName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.companyName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                className="input-field"
                                placeholder="Backend Developer..."
                                {...register('jobTitle', { required: 'Job title required' })}
                            />
                            {errors.jobTitle && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.jobTitle.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Job Description *
                            </label>
                            <button
                                type="button"
                                onClick={handleCheckReuse}
                                disabled={checkingReuse}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <RefreshCw size={12} className={checkingReuse ? 'animate-spin' : ''} />
                                Check for similar applications
                            </button>
                        </div>
                        <textarea
                            className="input-field h-48 resize-none"
                            placeholder="Paste the full job description here..."
                            {...register('jobDescription', {
                                required: 'Job description required',
                                minLength: { value: 50, message: 'Minimum 50 characters' }
                            })}
                        />
                        {errors.jobDescription && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.jobDescription.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* reuse recommendation */}
                {reuseRecommendation && (
                    <div className={`card border-l-4 ${
                        reuseRecommendation.shouldReuse
                            ? 'border-l-green-400'
                            : 'border-l-gray-300'
                    }`}>
                        <div className="flex items-start gap-3">
                            <Lightbulb size={20} className={
                                                     reuseRecommendation.shouldReuse
                                                         ? 'text-green-500 mt-0.5'
                                                         : 'text-gray-400 mt-0.5'
                                                 } />
                            <div>
                                <p className="font-medium text-gray-900">
                                    {reuseRecommendation.shouldReuse
                                        ? 'Similar application found!'
                                        : 'No similar applications found'}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {reuseRecommendation.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* resume selection */}
                <div className="card space-y-3">
                    <h2 className="font-semibold text-gray-900">
                        Attach Resume (Optional)
                    </h2>
                    <p className="text-sm text-gray-500">
                        Attaching a resume enables AI match scoring
                    </p>
                    <select
                        className="input-field"
                        {...register('resumeId')}
                    >
                        <option value="">Select a resume...</option>
                        {resumesData?.content?.map(resume => (
                            <option key={resume.id} value={resume.id}>
                                {resume.originalFileName}
                            </option>
                        ))}
                    </select>
                    {resumesData?.content?.length === 0 && (
                        <p className="text-sm text-yellow-600">
                            No resumes uploaded yet.{' '}
                            <a href="/resumes" className="underline">Upload one first</a>
                        </p>
                    )}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="btn-primary"
                    >
                        {createMutation.isPending ? 'Saving...' : 'Save Application'}
                    </button>
                </div>
            </form>
        </div>
    );
}