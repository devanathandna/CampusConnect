import React, { useState } from 'react';
import { X, Users, Lock, Globe, Eye, Plus } from 'lucide-react';
import { Group } from '../../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupData: Partial<Group>) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'club' as Group['type'],
    privacy: 'public' as Group['privacy'],
    tags: [] as string[],
    rules: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'club',
      privacy: 'public',
      tags: [],
      rules: [],
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addRule = () => {
    if (ruleInput.trim() && !formData.rules.includes(ruleInput.trim())) {
      setFormData({ ...formData, rules: [...formData.rules, ruleInput.trim()] });
      setRuleInput('');
    }
  };

  const removeRule = (rule: string) => {
    setFormData({ ...formData, rules: formData.rules.filter((r) => r !== rule) });
  };

  const groupTypes = [
    { value: 'major', label: 'Major', description: 'Department or major-based group' },
    { value: 'club', label: 'Club', description: 'Student club or organization' },
    { value: 'research', label: 'Research', description: 'Research project or lab group' },
    { value: 'career', label: 'Career', description: 'Career interest group' },
    { value: 'project', label: 'Project', description: 'Project collaboration team' },
  ];

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see and join' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Anyone can see, join requires approval' },
    { value: 'secret', label: 'Secret', icon: Eye, description: 'Only members can see' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display">Create New Group</h2>
              <p className="text-white/80 text-sm">Build your community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Computer Science Club"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={4}
              placeholder="Describe the purpose and activities of this group..."
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Group Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groupTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as Group['type'] })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.type === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{type.label}</div>
                  <div className="text-xs opacity-70">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Privacy *</label>
            <div className="grid grid-cols-3 gap-3">
              {privacyOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, privacy: option.value as Group['privacy'] })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.privacy === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm mb-1">{option.label}</div>
                    <div className="text-xs opacity-70">{option.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input-field flex-1"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
                aria-label="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="badge flex items-center space-x-1">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600" aria-label={`Remove tag ${tag}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Group Rules</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                className="input-field flex-1"
                placeholder="Add a rule and press Enter"
              />
              <button
                type="button"
                onClick={addRule}
                className="btn-secondary"
                aria-label="Add rule"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={rule} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-500 mt-0.5">{index + 1}.</span>
                  <span className="flex-1 text-sm text-gray-700">{rule}</span>
                  <button type="button" onClick={() => removeRule(rule)} className="text-gray-400 hover:text-red-600" aria-label={`Remove rule ${index + 1}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
