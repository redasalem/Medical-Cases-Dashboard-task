import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Stethoscope, 
  Activity, 
  History, 
  Crosshair, 
  ClipboardList,
  Share2,
  Printer,
  Calendar,
  User,
  BadgeCheck,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import apiClient from '../utils/apiClient';

interface DetailedCase {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  symptoms?: string;
  history?: string;
  diagnosis?: string;
  treatment_plan?: string;
  created_at?: string;
}

const difficultyConfig = {
  Easy: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/60', dot: 'bg-emerald-500', ring: 'ring-emerald-100', gradient: 'from-emerald-500 to-emerald-600' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/60', dot: 'bg-amber-500', ring: 'ring-amber-100', gradient: 'from-amber-500 to-amber-600' },
  Hard: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/60', dot: 'bg-rose-500', ring: 'ring-rose-100', gradient: 'from-rose-500 to-rose-600' },
};

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<DetailedCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/cases/${id}/`);
        setCaseData(response.data);
      } catch (error: any) {
        console.error('Failed to fetch case details:', error);
        setError(error.message || 'Failed to load case details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCaseDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-20 animate-pulse">
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
            <div className="h-4 bg-slate-200 rounded-lg w-28"></div>
            <div className="h-9 bg-slate-200 rounded-lg w-2/3"></div>
            <div className="flex gap-4">
              <div className="h-5 bg-slate-200 rounded-full w-24"></div>
              <div className="h-5 bg-slate-200 rounded-full w-32"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                  <div className="h-5 bg-slate-200 rounded-lg w-1/3"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="h-5 bg-slate-200 rounded-lg w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Stethoscope className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-8">{error || "The medical record you're looking for is unavailable."}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const config = difficultyConfig[caseData.difficulty] || difficultyConfig.Easy;

  const sections = [
    { id: 'symptoms', icon: <Activity className="w-5 h-5" />, iconBg: 'bg-red-50', iconColor: 'text-red-500', title: 'Symptoms & Clinical Presentation', content: caseData.symptoms, defaultText: 'Detailed symptoms analysis pending clinician input.', accent: 'border-l-red-400' },
    { id: 'history', icon: <History className="w-5 h-5" />, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', title: 'Patient Clinical History', content: caseData.history, defaultText: 'No previous medical history recorded for this subject.', accent: 'border-l-indigo-400' },
    { id: 'diagnosis', icon: <Crosshair className="w-5 h-5" />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', title: 'Confirmed Diagnosis', content: caseData.diagnosis, defaultText: 'Diagnosis is strictly confidential until case submission.', accent: 'border-l-emerald-400' },
    { id: 'treatment', icon: <ClipboardList className="w-5 h-5" />, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', title: 'Management & Treatment Plan', content: caseData.treatment_plan, defaultText: 'Treatment strategy will be unlocked after diagnosis verification.', accent: 'border-l-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-20">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors mb-5 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${config.bg} ${config.color} ${config.border}`}>
                  <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`}></span>
                  {caseData.difficulty}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Case
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {caseData.title}
              </h1>
              <div className="flex items-center gap-5 text-slate-400 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Assigned to Student</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {caseData.created_at
                      ? new Date(caseData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'Report date unavailable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98] flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4" />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {sections.map((section) => {
              const content = section.content || section.defaultText;
              return (
                <div 
                  key={section.id}
                  id={section.id}
                  className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${activeSection === section.id ? 'ring-2 ring-blue-500/20' : ''}`}
                >
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${section.iconBg} ${section.iconColor} rounded-xl flex items-center justify-center`}>
                        {section.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{section.title}</h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`px-5 pb-5 ${activeSection === section.id ? 'block' : 'block'}`}>
                    <div className="border-l-2 pl-5 ml-5 space-y-3">
                      {content.split('\n').map((para, i) => (
                        para.trim() && <p key={i} className="text-slate-600 text-sm leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Quick Reference
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Case ID', value: `#${caseData.id}`, icon: <FileText className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: 'Difficulty', value: caseData.difficulty, icon: caseData.difficulty === 'Easy' ? <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> : caseData.difficulty === 'Medium' ? <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> },
                  { label: 'Status', value: 'Active', icon: <Clock className="w-3.5 h-3.5 text-blue-500" /> },
                  { label: 'Symptoms', value: caseData.symptoms ? 'Recorded' : 'Pending', icon: <HeartPulse className="w-3.5 h-3.5 text-red-400" /> },
                  { label: 'Treatment', value: caseData.treatment_plan ? 'Available' : 'Locked', icon: <Pill className="w-3.5 h-3.5 text-amber-400" /> },
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                    <span className="text-slate-500 flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="font-semibold text-slate-800 text-xs">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100/60">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">Case Status</h3>
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Active Investigation</span>
              </div>
              <p className="text-blue-600/70 text-xs leading-relaxed">
                All clinical data is simulated for educational purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
