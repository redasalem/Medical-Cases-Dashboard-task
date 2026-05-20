import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Stethoscope,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import apiClient from '../utils/apiClient';

interface MedicalCase {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  created_at?: string;
}

const difficultyConfig = {
  Easy: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
    icon: <Sparkles className="w-3 h-3" />,
    gradient: 'from-emerald-500/10 to-emerald-500/5'
  },
  Medium: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
    icon: <TrendingUp className="w-3 h-3" />,
    gradient: 'from-amber-500/10 to-amber-500/5'
  },
  Hard: { 
    bg: 'bg-rose-50', 
    text: 'text-rose-700', 
    border: 'border-rose-200/60',
    dot: 'bg-rose-500',
    icon: <AlertCircle className="w-3 h-3" />,
    gradient: 'from-rose-500/10 to-rose-500/5'
  },
};

const Dashboard: React.FC = () => {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<MedicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get('/api/cases/');
      setCases(response.data || []);
      setFilteredCases(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch cases:', err);
      setError('Failed to fetch cases. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    const filtered = cases.filter((c) => {
      const caseName = c.title || '';
      const matchesSearch = caseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
    setFilteredCases(filtered);
  }, [searchTerm, difficultyFilter, cases]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const stats = [
    { label: 'Total Cases', value: cases.length, icon: <Stethoscope className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Easy', value: cases.filter(c => c.difficulty === 'Easy').length, icon: <Sparkles className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Medium', value: cases.filter(c => c.difficulty === 'Medium').length, icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Hard', value: cases.filter(c => c.difficulty === 'Hard').length, icon: <AlertCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      <nav className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/50">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">MedCase</h1>
              <p className="text-[11px] text-blue-600 font-semibold tracking-wide uppercase">Clinical Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Medical Cases</h2>
            <p className="text-slate-500 text-sm">Explore clinical scenarios and sharpen your diagnostic skills.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
              />
            </div>

            <div className="relative min-w-[130px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {!isLoading && !error && cases.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-2xl border border-red-100 shadow-sm max-w-md mx-auto">
            <div className="p-4 bg-red-50 rounded-2xl text-red-500">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div className="px-6">
              <h3 className="text-lg font-semibold text-slate-800">Connection Error</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-2">{error}</p>
            </div>
            <button 
              onClick={() => fetchCases()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200/50 cursor-pointer text-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                  <div className="h-5 w-5 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-100 rounded-lg w-3/4"></div>
                  <div className="h-3 bg-slate-50 rounded w-full"></div>
                  <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="h-3 bg-slate-100 rounded w-20"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="p-5 bg-slate-50 text-slate-400 rounded-full">
              <Search className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">No cases found</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-1">
                We couldn{"'"}t find any cases matching "{searchTerm}". Try adjusting your filters.
              </p>
            </div>
            <button 
              onClick={() => { setSearchTerm(''); setDifficultyFilter('All'); }}
              className="text-blue-600 font-medium hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((caseItem) => {
              const config = difficultyConfig[caseItem.difficulty] || difficultyConfig.Easy;
              return (
                <div 
                  key={caseItem.id}
                  onClick={() => navigate(`/case/${caseItem.id}`)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 hover:border-slate-200 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`}></div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}>
                        <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`}></span>
                        {caseItem.difficulty}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-slate-500 text-[13px] line-clamp-2 leading-relaxed flex-1">
                      {caseItem.description || 'Comprehensive clinical presentation involving multiple physiological systems and diagnostic challenges.'}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">
                          {caseItem.created_at 
                            ? new Date(caseItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-semibold text-xs group-hover:gap-2 transition-all">
                        Open Case
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
