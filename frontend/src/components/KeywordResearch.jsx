import { useState } from 'react';
import { seoAPI, projectsAPI, keywordsAPI } from '../services/api';
import { Search, Save } from 'lucide-react';

const KeywordResearch = ({ projects, onProjectsChange }) => {
  const [searchType, setSearchType] = useState('keyword');
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState(2840);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const locations = [
    { code: 2840, name: 'United States' },
    { code: 2826, name: 'United Kingdom' },
    { code: 2124, name: 'Canada' },
    { code: 2036, name: 'Australia' },
    { code: 2276, name: 'Germany' },
    { code: 2250, name: 'France' }
  ];

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a keyword or domain');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      if (searchType === 'keyword') {
        const response = await seoAPI.comprehensiveResearch({
          keyword: searchInput,
          locationCode: location,
          languageCode: 'en'
        });
        setResults(response.data.data);
      } else {
        const response = await seoAPI.domainKeywords({
          domain: searchInput,
          locationCode: location,
          languageCode: 'en',
          limit: 100
        });
        setResults({ keywords: response.data.data });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const saveToProject = async (projectId, selectedKeywords) => {
    try {
      const keywordsData = selectedKeywords.map(kw => ({
        keyword: kw.keyword,
        searchVolume: kw.keyword_info?.search_volume || kw.search_volume || 0,
        keywordDifficulty: kw.keyword_properties?.keyword_difficulty || kw.keyword_difficulty || 0,
        cpc: kw.keyword_info?.cpc || kw.cpc || 0
      }));

      await keywordsAPI.bulkCreate({
        projectId,
        keywords: keywordsData
      });

      alert('Keywords saved successfully!');
    } catch (err) {
      alert('Failed to save keywords: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setSearchType('keyword')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              searchType === 'keyword'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            By Keyword
          </button>
          <button
            onClick={() => setSearchType('domain')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              searchType === 'domain'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            By Domain
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={searchType === 'keyword' ? 'Enter a keyword...' : 'Enter a domain...'}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {locations.map(loc => (
              <option key={loc.code} value={loc.code}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {results && results.keywords && results.keywords.length > 0 && (
        <KeywordResultsTable
          keywords={results.keywords}
          projects={projects}
          onSave={saveToProject}
          onProjectsChange={onProjectsChange}
        />
      )}

      {/* PAA Section */}
      {results && results.paa && results.paa.length > 0 && (
        <PeopleAlsoAsk questions={results.paa} />
      )}

      {/* AI Overview */}
      {results && results.aiOverview && (
        <AIOverview data={results.aiOverview} />
      )}
    </div>
  );
};

const KeywordResultsTable = ({ keywords, projects, onSave, onProjectsChange }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'searchVolume', direction: 'desc' });

  const sortedKeywords = [...keywords].sort((a, b) => {
    let aVal, bVal;

    switch(sortConfig.key) {
      case 'keyword':
        aVal = (a.keyword || '').toLowerCase();
        bVal = (b.keyword || '').toLowerCase();
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      case 'searchVolume':
        aVal = a.keyword_info?.search_volume || a.search_volume || 0;
        bVal = b.keyword_info?.search_volume || b.search_volume || 0;
        break;
      case 'difficulty':
        aVal = a.keyword_properties?.keyword_difficulty || a.keyword_difficulty || 0;
        bVal = b.keyword_properties?.keyword_difficulty || b.keyword_difficulty || 0;
        break;
      case 'cpc':
        aVal = a.keyword_info?.cpc || a.cpc || 0;
        bVal = b.keyword_info?.cpc || b.cpc || 0;
        break;
      default:
        return 0;
    }

    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await projectsAPI.create({ name: newProjectName });
      setNewProjectName('');
      setShowCreateProject(false);
      onProjectsChange();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleSaveSelected = () => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }
    if (selectedKeywords.length === 0) {
      alert('Please select keywords to save');
      return;
    }

    const keywordsToSave = keywords.filter((_, idx) => selectedKeywords.includes(idx));
    onSave(selectedProject, keywordsToSave);
    setSelectedKeywords([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Keyword Ideas</h2>
          <p className="text-sm text-gray-600 mt-1">{keywords.length} keywords found</p>
        </div>

        {selectedKeywords.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateProject(true)}
              className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              + New Project
            </button>
            <button
              onClick={handleSaveSelected}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Save size={16} />
              Save {selectedKeywords.length} keywords
            </button>
          </div>
        )}
      </div>

      {showCreateProject && (
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-200 flex items-center gap-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
          />
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            Create
          </button>
          <button
            onClick={() => setShowCreateProject(false)}
            className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedKeywords(keywords.map((_, idx) => idx));
                    } else {
                      setSelectedKeywords([]);
                    }
                  }}
                  checked={selectedKeywords.length === keywords.length}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                onClick={() => handleSort('keyword')}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Keyword {sortConfig.key === 'keyword' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('searchVolume')}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Volume {sortConfig.key === 'searchVolume' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('difficulty')}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Difficulty {sortConfig.key === 'difficulty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('cpc')}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                CPC {sortConfig.key === 'cpc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedKeywords.map((kw, idx) => {
              const volume = kw.keyword_info?.search_volume || kw.search_volume || 0;
              const difficulty = kw.keyword_properties?.keyword_difficulty || kw.keyword_difficulty || 0;
              const cpc = kw.keyword_info?.cpc || kw.cpc || 0;

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedKeywords.includes(idx)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedKeywords([...selectedKeywords, idx]);
                        } else {
                          setSelectedKeywords(selectedKeywords.filter(i => i !== idx));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{kw.keyword}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{volume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      difficulty >= 70 ? 'bg-red-100 text-red-800' :
                      difficulty >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">${cpc.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PeopleAlsoAsk = ({ questions }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">People Also Ask</h2>
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{q.title || q.question}</p>
        </div>
      ))}
    </div>
  </div>
);

const AIOverview = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Overview</h2>
    <p className="text-sm text-gray-700 leading-relaxed">{data.text || data.description}</p>
  </div>
);

export default KeywordResearch;
