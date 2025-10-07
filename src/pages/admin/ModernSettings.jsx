import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faSpinner,
  faExclamationTriangle,
  faInfoCircle,
  faRobot,
  faCrown,
  faStar,
  faGem
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';
import axios from 'axios';

const ModernSettings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    site_description: '',
    site_url: '',
    admin_email: '',
    max_upload_size: 10,
    allowed_file_types: 'jpg,jpeg,png,gif,mp4,mov',
    auto_approve_artworks: false,
    auto_approve_posts: false,
    require_email_verification: true,
    enable_notifications: true,
    maintenance_mode: false,
    max_artworks_per_user: 50,
    max_posts_per_user: 20,
    enable_comments: true,
    enable_likes: true,
    enable_sharing: true,
  });

  const [aiLimits, setAiLimits] = useState({
    free: 10,
    basic: 50,
    premium: 200,
    pro: 1000,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isAiLimitsDirty, setIsAiLimitsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use Redux Query for data fetching
  const {
    data: settingsData,
    isLoading: settingsLoading
  } = useGetAdminSettingsQuery();

  // Mutation for updating settings
  const [updateSettings] = useUpdateAdminSettingsMutation();

  // Toast notifications
  const toast = useToast();

  // Load settings when data is available
  useEffect(() => {
    if (settingsData?.data) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...settingsData.data
      }));
      setIsDirty(false);
    }
  }, [settingsData]);

  // Load AI generation limits
  useEffect(() => {
    const fetchAiLimits = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        const response = await axios.get(`${baseURL}/admin/ai-generation-limits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('AI Limits Response:', response.data);
        
        if (response.data.success) {
          setAiLimits(response.data.data);
          console.log('AI Limits set:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching AI limits:', error);
        toast.error('Failed to load AI generation limits', 'Load Error');
      }
    };

    fetchAiLimits();
  }, [toast]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };

  // Handle AI limits input changes
  const handleAiLimitChange = (tier, value) => {
    console.log('AI Limit change:', tier, value);
    setAiLimits(prev => {
      const newLimits = {
        ...prev,
        [tier]: parseInt(value) || 0
      };
      console.log('New AI limits:', newLimits);
      return newLimits;
    });
    setIsAiLimitsDirty(true);
  };

  // Handle AI limits save
  const handleSaveAiLimits = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      console.log('Saving AI limits:', aiLimits);
      
      const response = await axios.put(`${baseURL}/admin/ai-generation-limits`, aiLimits, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Save response:', response.data);
      toast.success('AI generation limits updated successfully', 'AI Limits Updated');
      setIsAiLimitsDirty(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to update AI limits', 'Save Failed');
    }
  };

  // Handle form submission
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings).unwrap();
      toast.success('Settings saved successfully', 'Settings Updated');
      setIsDirty(false);
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to save settings', 'Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        site_name: 'Mural Finder',
        site_description: 'Discover and share amazing murals',
        site_url: 'https://muralfinder.net',
        admin_email: '',
        max_upload_size: 10,
        allowed_file_types: 'jpg,jpeg,png,gif,mp4,mov',
        auto_approve_artworks: false,
        auto_approve_posts: false,
        require_email_verification: true,
        enable_notifications: true,
        maintenance_mode: false,
        max_artworks_per_user: 50,
        max_posts_per_user: 20,
        enable_comments: true,
        enable_likes: true,
        enable_sharing: true,
      });
      setIsDirty(true);
    }
  };

  if (settingsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Settings</h1>
              <p className="text-gray-600 font-raleway mt-1">Manage platform configuration and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              {isDirty && (
                <span className="text-sm text-orange-600 font-raleway flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-raleway"
              >
                Reset to Defaults
            </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  placeholder="Enter site name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.site_url}
                  onChange={(e) => handleInputChange('site_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                placeholder="https://muralfinder.net"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  placeholder="Enter site description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                value={settings.admin_email}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                placeholder="admin@muralfinder.net"
              />
              </div>
            </div>
          </div>

          {/* Upload Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">Upload Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Max Upload Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.max_upload_size}
                  onChange={(e) => handleInputChange('max_upload_size', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  min="1"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Allowed File Types
                </label>
                <input
                  type="text"
                  value={settings.allowed_file_types}
                  onChange={(e) => handleInputChange('allowed_file_types', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  placeholder="jpg,jpeg,png,gif,mp4,mov"
                />
              </div>
            </div>
          </div>

          {/* Content Moderation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">Content Moderation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Auto-approve Artworks
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Automatically approve new artwork submissions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_approve_artworks}
                  onChange={(e) => handleInputChange('auto_approve_artworks', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Auto-approve Posts
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Automatically approve new blog post submissions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_approve_posts}
                  onChange={(e) => handleInputChange('auto_approve_posts', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Require Email Verification
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Users must verify their email before posting
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require_email_verification}
                  onChange={(e) => handleInputChange('require_email_verification', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
            
            {/* Save Button for General Settings */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={!isDirty || isSaving}
                className={`px-6 py-2 rounded-lg font-raleway flex items-center space-x-2 transition-colors ${
                  isDirty && !isSaving
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Generation Limits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-raleway flex items-center">
                <FontAwesomeIcon icon={faRobot} className="mr-2 text-purple-600" />
                AI Generation Limits
              </h3>
              {isAiLimitsDirty && (
                <button
                  onClick={handleSaveAiLimits}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-raleway flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Save AI Limits</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Free Tier */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 mr-2" />
                  <h4 className="font-semibold text-gray-700 font-raleway">Free Tier</h4>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 font-raleway mb-1">
                    Max Generations
                  </label>
                  <input
                    type="number"
                    value={aiLimits.free || ''}
                    onChange={(e) => {
                      console.log('Free tier input changed:', e.target.value);
                      handleAiLimitChange('free', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-raleway"
                    min="1"
                    max="1000"
                    placeholder="Enter limit"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-gray-500 font-raleway">
                  Lifetime limit for free users
                </p>
              </div>

              {/* Basic Tier */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon icon={faStar} className="text-blue-500 mr-2" />
                  <h4 className="font-semibold text-blue-700 font-raleway">Basic Tier</h4>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-blue-600 font-raleway mb-1">
                    Max Generations
                  </label>
                  <input
                    type="number"
                    value={aiLimits.basic || ''}
                    onChange={(e) => {
                      console.log('Basic tier input changed:', e.target.value);
                      handleAiLimitChange('basic', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-raleway"
                    min="1"
                    max="10000"
                    placeholder="Enter limit"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-blue-500 font-raleway">
                  Lifetime limit for basic subscribers
                </p>
              </div>

              {/* Premium Tier */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon icon={faCrown} className="text-yellow-500 mr-2" />
                  <h4 className="font-semibold text-yellow-700 font-raleway">Premium Tier</h4>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-yellow-600 font-raleway mb-1">
                    Max Generations
                  </label>
                  <input
                    type="number"
                    value={aiLimits.premium || ''}
                    onChange={(e) => {
                      console.log('Premium tier input changed:', e.target.value);
                      handleAiLimitChange('premium', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-raleway"
                    min="1"
                    max="50000"
                    placeholder="Enter limit"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-yellow-500 font-raleway">
                  Lifetime limit for premium subscribers
                </p>
              </div>

              {/* Pro Tier */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon icon={faGem} className="text-purple-500 mr-2" />
                  <h4 className="font-semibold text-purple-700 font-raleway">Pro Tier</h4>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-purple-600 font-raleway mb-1">
                    Max Generations
                  </label>
                  <input
                    type="number"
                    value={aiLimits.pro || ''}
                    onChange={(e) => {
                      console.log('Pro tier input changed:', e.target.value);
                      handleAiLimitChange('pro', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-raleway"
                    min="1"
                    max="100000"
                    placeholder="Enter limit"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-purple-500 font-raleway">
                  Lifetime limit for pro subscribers
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2 mt-1" />
                <div className="text-sm text-gray-600 font-raleway">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>These are <strong>lifetime limits</strong> - users cannot generate more even if they delete artworks</li>
                    <li>Changes take effect immediately for new generations</li>
                    <li>Existing users retain their current generation count</li>
                    <li>Higher tiers should have proportionally higher limits</li>
                  </ul>
                  
                  {/* Debug Info */}
                  <div className="mt-3 p-2 bg-white rounded border">
                    <p className="font-semibold text-xs">Debug Info:</p>
                    <p className="text-xs">Current AI Limits: {JSON.stringify(aiLimits)}</p>
                    <p className="text-xs">Is Dirty: {isAiLimitsDirty ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Enable Comments
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Allow users to comment on artworks and posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable_comments}
                  onChange={(e) => handleInputChange('enable_comments', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Enable Likes
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Allow users to like artworks and posts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable_likes}
                  onChange={(e) => handleInputChange('enable_likes', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Enable Sharing
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Allow users to share content on social media
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable_sharing}
                  onChange={(e) => handleInputChange('enable_sharing', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Send notifications for likes, comments, and follows
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable_notifications}
                  onChange={(e) => handleInputChange('enable_notifications', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 font-raleway">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 font-raleway">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default ModernSettings;