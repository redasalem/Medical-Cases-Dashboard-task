import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Stethoscope, 
  Activity, 
  History, 
  Crosshair, 
  ClipboardList,
  Loader2,
  Share2,
  Printer,
  Calendar,
  User,
  BadgeCheck
} from 'lucide-react';
import apiClient from '../utils/apiClient';

/**
 * Detailed Case Data Interface
 */
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

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<DetailedCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // GET /api/cases/[id]/ (proxied)
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-500 font-medium tracking-wide">Analysing Medical Records...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-8">{error || "The medical record you're looking for is unavailable."}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 px-3 py-1';
      case 'Medium': return 'bg-amber-100 text-amber-800 px-3 py-1';
      case 'Hard': return 'bg-red-100 text-red-800 px-3 py-1';
      default: return 'bg-slate-100 text-slate-800 px-3 py-1';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Container */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold rounded-full uppercase tracking-widest ${getDifficultyStyles(caseData.difficulty)}`}>
                  {caseData.difficulty} Case
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium uppercase tracking-widest border-l pl-3">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  Verified Case
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
                {caseData.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Assigned to Student</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Reported on {new Date(caseData.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors shadow-sm">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Symptoms Section */}
          <Section 
            icon={<Activity className="w-5 h-5 text-red-500" />} 
            title="Symptoms & Clinical Presentation" 
            content={caseData.symptoms || 'Detailed symptoms analysis pending clinician input.'}
            bgColor="bg-white"
          />

          {/* History Section */}
          <Section 
            icon={<History className="w-5 h-5 text-indigo-500" />} 
            title="Patient Clinical History" 
            content={caseData.history || 'No previous medical history recorded for this subject.'}
            bgColor="bg-white"
          />

          {/* Diagnosis Section */}
          <Section 
            icon={<Crosshair className="w-5 h-5 text-emerald-500" />} 
            title="Confirmed Diagnosis" 
            content={caseData.diagnosis || 'Diagnosis is strictly confidential until case submission.'}
            bgColor="bg-blue-50/50"
            border="border-blue-100"
          />

          {/* Treatment Plan Section */}
          <Section 
            icon={<ClipboardList className="w-5 h-5 text-amber-500" />} 
            title="Management & Treatment Plan" 
            content={caseData.treatment_plan || 'Treatment strategy will be unlocked after diagnosis verification.'}
            bgColor="bg-white"
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-4">Key Observations</h3>
            <ul className="space-y-4">
              {[
                { label: 'Respiratory Rate', value: 'Elevated' },
                { label: 'Patient Age', value: 'Elderly' },
                { label: 'Criticality', value: 'High Priority' },
                { label: 'Risk Factors', value: 'Chronic condition' }
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-3">Case Status</h3>
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Active Investigation</span>
            </div>
            <p className="text-emerald-700 italic opacity-80 text-sm">
              All clinical data is simulated for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  bgColor?: string;
  border?: string;
}

const Section: React.FC<SectionProps> = ({ icon, title, content, bgColor = "bg-white", border = "border-slate-100" }) => (
  <div className={`${bgColor} ${border} p-8 rounded-[2rem] border shadow-sm transition-all hover:shadow-md`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
      {content.split('\n').map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  </div>
);

export default CaseDetails;
