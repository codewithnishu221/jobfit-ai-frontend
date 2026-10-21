import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateResume } from '../api/matchApi';
import { getAllResumes } from '../api/resumeApi';
import toast from 'react-hot-toast';
import { Sparkles, Copy, Check, Download } from 'lucide-react';

export default function GenerateResumePage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    const { data: resumesData } = useQuery({
        queryKey: ['resumes'],
        queryFn: () => getAllResumes().then(r => r.data),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const response = await generateResume({
                resumeId: parseInt(data.resumeId),
                jobDescription: data.jobDescription,
                jobTitle: data.jobTitle,
                companyName: data.companyName,
            });
            setResult(response.data);
            // invalidate resumes so the new generated resume appears in list
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            toast.success('Resume generated and saved!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Generation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result.tailoredResume);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([result.tailoredResume], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailored-resume-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate Resume</h1>
                <p className="text-gray-500 mt-1">
                    AI-tailored resume optimized for a specific job description
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                        </label>
                        <input
                            className="input-field"
                            placeholder="Google"
                            {...register('companyName')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                        </label>
                        <input
                            className="input-field"
                            placeholder="Backend Developer"
                            {...register('jobTitle')}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Resume *
                    </label>
                    <select
                        className="input-field"
                        {...register('resumeId', { required: 'Select a resume' })}
                    >
                        <option value="">Choose your base resume...</option>
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
                        placeholder="Paste the full job description..."
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

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Sparkles size={18} />
                    {loading
                        ? 'Generating... (30-60 seconds)'
                        : 'Generate Tailored Resume'
                    }
                </button>
            </form>

            {loading && (
                <div className="card text-center py-8">
                    <div className="animate-pulse flex justify-center gap-1 mb-4">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                    <p className="text-gray-600 font-medium">
                        AI is crafting your tailored resume...
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        This takes 30-60 seconds. Please wait.
                    </p>
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    {/* key changes */}
                    {result.keyChanges?.length > 0 && (
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Key Changes Made
                            </h3>
                            <ul className="space-y-2">
                                {result.keyChanges.map((change, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* tailored resume */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Tailored Resume</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="btn-secondary flex items-center gap-1 text-sm py-1.5"
                                >
                                    <Download size={14} />
                                    Download
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="btn-secondary flex items-center gap-1 text-sm py-1.5"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed
                            bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {result.tailoredResume}
            </pre>
                    </div>

                    {/* cover letter */}
                    {result.coverLetter && (
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-3">Cover Letter</h3>
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {result.coverLetter}
              </pre>
                        </div>
                    )}

                    {result.savedResumeId && (
                        <p className="text-sm text-green-600 text-center">
                            ✓ Resume saved to your library (ID: {result.savedResumeId})
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}