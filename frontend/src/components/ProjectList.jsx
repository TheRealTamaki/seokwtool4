import { useState } from 'react';
import { projectsAPI, keywordsAPI } from '../services/api';
import { Folder, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectList = ({ projects, loading, onRefresh }) => {
  const [expandedProject, setExpandedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [newName, setNewName] = useState('');

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project and all its keywords?')) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      onRefresh();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleEdit = async (projectId) => {
    if (!newName.trim()) return;

    try {
      await projectsAPI.update(projectId, { name: newName });
      setEditingProject(null);
      setNewName('');
      onRefresh();
    } catch (err) {
      alert('Failed to update project');
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Folder size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600 mb-6">Create your first project to organize your keyword research</p>
        <CreateProjectForm onSuccess={onRefresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
        <CreateProjectForm onSuccess={onRefresh} />
      </div>

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {expandedProject === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <Folder size={20} className="text-indigo-600" />
                {editingProject === project.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleEdit(project.id)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(project.id)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setNewName('');
                      }}
                      className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600">{project.description}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {project.keywords?.length || 0} keywords
                </span>
                <button
                  onClick={() => {
                    setEditingProject(project.id);
                    setNewName(project.name);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  title="Edit project"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedProject === project.id && project.keywords && project.keywords.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Keyword</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Difficulty</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {project.keywords.map(kw => (
                      <tr key={kw.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{kw.keyword}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{kw.searchVolume?.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            kw.keywordDifficulty >= 70 ? 'bg-red-100 text-red-800' :
                            kw.keywordDifficulty >= 40 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {kw.keywordDifficulty}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">${parseFloat(kw.cpc || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateProjectForm = ({ onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await projectsAPI.create({ name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      onSuccess();
    } catch (err) {
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        + New Project
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="My SEO Project"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Project description..."
            rows="3"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setName('');
              setDescription('');
            }}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectList;
