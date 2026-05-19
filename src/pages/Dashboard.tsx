import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Brain,
  Stethoscope,
  LayoutGrid,
  AlertCircle
} from 'lucide-react';
import apiClient from '../utils/apiClient';
import axios from 'axios';

/**
 * Medical Case Type Definition
 */
interface MedicalCase {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  created_at?: string;
}

const Dashboard: React.FC = () => {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<MedicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const navigate = useNavigate();

  // Fetch cases on mount
  const fetchCases = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      // GET /api/cases/ (proxied)
      const response = await apiClient.get('/api/cases/', { signal });
      setCases(response.data || []);
      setFilteredCases(response.data || []);
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      console.error('Failed to fetch cases:', err);
      setError('Failed to fetch cases. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCases(controller.signal);
    return () => controller.abort();
  }, []);

  // Filter logic: Search + Difficulty Dropdown
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

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-50 text-green-700 border-green-200/60';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Hard': return 'bg-red-50 text-red-700 border-red-200/60';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">MedCase Dashboard</h1>
              <p className="text-xs text-blue-600 font-medium mt-1">Hello, Student!</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        {/* Header & Filter Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Available Cases</h2>
            <p className="text-slate-500">Explore and solve clinical cases to build your diagnosis skills.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium text-slate-700 hover:border-slate-300 cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-red-100 shadow-sm max-w-md mx-auto">
            <div className="p-4 bg-red-50 rounded-full text-red-500">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div className="px-6">
              <h3 className="text-xl font-semibold text-slate-800">Connection Error</h3>
              <p className="text-slate-500 max-w-sm mt-2">
                {error}
              </p>
            </div>
            <button 
              onClick={() => fetchCases()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          // Skeleton Loading Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
                <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-slate-100 rounded-full w-20"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="p-5 bg-blue-50/50 text-blue-500 rounded-full ring-8 ring-blue-50/20">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">No cases found</h3>
              <p className="text-slate-500 max-w-sm mt-1">
                We couldn{"'"}t find any cases matching "{searchTerm}". Try adjusting your filters.
              </p>
            </div>
            <button 
              onClick={() => { setSearchTerm(''); setDifficultyFilter('All'); }}
              className="text-blue-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          // Responsive Card Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <div 
                key={caseItem.id}
                onClick={() => navigate(`/case/${caseItem.id}`)}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getDifficultyStyles(caseItem.difficulty)}`}>
                      {caseItem.difficulty}
                    </span>
                    <LayoutGrid className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{caseItem.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {caseItem.description || 'Comprehensive clinical presentation involving multiple physiological systems and diagnostic challenges.'}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                      <Brain className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
                    View Report
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
