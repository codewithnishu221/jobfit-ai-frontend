import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { generateInterviewPrep } from '../api/interviewApi';
import { getAllResumes } from '../api/resumeApi';
import toast from 'react-hot-toast';
import { GraduationCap, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const DIFFICULTY_COLORS = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700',
};

export default function InterviewPrepPage() {
    const [searchParams] = useSearchParams();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            companyName: searchParams.get('company') || '',
            jobTitle: searchParams.get('role') || '',
        }
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const response = await generateInterviewPrep({
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                jobDescription: data.jobDescription,
            });
            setResult(response.data);
            toast.success('Interview prep generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Interview Prep</h1>
                <p className="text-gray-500 mt-1">
                    AI-generated questions and preparation plan for your interview
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company *
                        </label>
                        <input
                            className="input-field"
                            placeholder="Google"
                            {...register('companyName', { required: 'Company required' })}
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
                            placeholder="Backend Developer"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description *
                    </label>
                    <textarea
                        className="input-field h-40 resize-none"
                        placeholder="Paste the job description..."
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
                    <GraduationCap size={18} />
                    {loading
                        ? 'Generating prep plan... (45-90 seconds)'
                        : 'Generate Interview Prep'
                    }
                </button>
            </form>

            {loading && (
                <div className="card text-center py-8">
                    <GraduationCap size={32} className="text-blue-600 mx-auto mb-3 animate-pulse" />
                    <p className="text-gray-600 font-medium">
                        Generating your personalized interview prep...
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Finding real interview experiences and generating questions
                    </p>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {/* technical questions */}
                    <QuestionSection
                        title="Technical Questions"
                        questions={result.technicalQuestions}
                        expandedQuestion={expandedQuestion}
                        setExpandedQuestion={setExpandedQuestion}
                        sectionKey="tech"
                    />

                    {/* behavioral questions */}
                    <QuestionSection
                        title="Behavioral Questions"
                        questions={result.behavioralQuestions}
                        expandedQuestion={expandedQuestion}
                        setExpandedQuestion={setExpandedQuestion}
                        sectionKey="behavioral"
                    />

                    {/* system design */}
                    {result.systemDesignQuestions?.length > 0 && (
                        <QuestionSection
                            title="System Design Questions"
                            questions={result.systemDesignQuestions}
                            expandedQuestion={expandedQuestion}
                            setExpandedQuestion={setExpandedQuestion}
                            sectionKey="design"
                        />
                    )}

                    {/* resources */}
                    {result.resources?.length > 0 && (
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Real Interview Experiences
                            </h3>
                            <div className="space-y-3">
                                {result.resources.map((resource, i) => (
                                    <a
                                        key={i}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50
                               transition-colors group"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {resource.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{resource.source}</p>
                                            {resource.excerpt && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {resource.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400 group-hover:text-blue-600 mt-0.5 shrink-0"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* prep plan */}
                    {result.prepPlan?.length > 0 && (
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                7-Day Preparation Plan
                            </h3>
                            <div className="space-y-3">
                                {result.prepPlan.map(day => (
                                    <div key={day.dayNumber} className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full
                                    flex items-center justify-center text-sm font-bold shrink-0">
                                            {day.dayNumber}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{day.focus}</p>
                                            <ul className="mt-1 space-y-1">
                                                {day.tasks.map((task, i) => (
                                                    <li key={i} className="text-sm text-gray-500 flex items-start gap-1">
                                                        <span className="text-blue-400 mt-0.5">•</span>
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QuestionSection({ title, questions, expandedQuestion, setExpandedQuestion, sectionKey }) {
    if (!questions?.length) return null;
    return (
        <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="space-y-2">
                {questions.map((q, i) => {
                    const key = `${sectionKey}-${i}`;
                    const isOpen = expandedQuestion === key;
                    return (
                        <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setExpandedQuestion(isOpen ? null : key)}
                                className="w-full flex items-center justify-between p-3
                           hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                   ${DIFFICULTY_COLORS[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                                    <p className="text-sm font-medium text-gray-900">{q.question}</p>
                                </div>
                                {isOpen
                                    ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                                    : <ChevronDown size={16} className="text-gray-400 shrink-0" />
                                }
                            </button>
                            {isOpen && q.hint && (
                                <div className="px-3 pb-3 pt-0">
                                    <p className="text-sm text-blue-600 bg-blue-50 rounded p-2">
                                        💡 Hint: {q.hint}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}