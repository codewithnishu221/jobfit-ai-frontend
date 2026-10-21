import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllResumes, uploadResume, deleteResume } from '../api/resumeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Upload, Trash2, FileText, Clock } from 'lucide-react';

export default function ResumesPage() {
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['resumes'],
        queryFn: () => getAllResumes().then(r => r.data),
    });

    const uploadMutation = useMutation({
        mutationFn: uploadResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Resume uploaded successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Upload failed');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Resume deleted');
        },
        onError: () => toast.error('Failed to delete resume'),
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are supported');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File must be under 10MB');
            return;
        }
        uploadMutation.mutate(file);
    };

    const resumes = data?.content || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
                    <p className="text-gray-500 mt-1">
                        {resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded
                    </p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadMutation.isPending}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Upload size={18} />
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload PDF'}
                    </button>
                </div>
            </div>

            {/* upload zone */}
            <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center
                   hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                    Drop your PDF resume here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-1">Maximum file size: 10MB</p>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : resumes.length === 0 ? (
                <div className="card text-center py-8">
                    <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No resumes yet — upload your first one above</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {resumes.map(resume => (
                        <div
                            key={resume.id}
                            className="card flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                    <FileText size={20} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {resume.originalFileName}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                        <Clock size={12} />
                                        Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                                    </div>
                                    {resume.parsedText && (
                                        <p className="text-xs text-gray-500 mt-1 max-w-md truncate">
                                            {resume.parsedText}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Delete this resume?')) {
                                        deleteMutation.mutate(resume.id);
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                           rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}