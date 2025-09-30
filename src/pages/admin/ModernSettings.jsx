import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faSave,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';

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

  const [isDirty, setIsDirty] = useState(false);

  // Use Redux Query for data fetching
  const {
    data: settingsData,
    isLoading: settingsLoading,
    error: settingsError
  } = useGetAdminSettingsQuery();

  // Mutation for updating settings
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation();

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

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  // Handle form submission
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    try {
      await updateSettings(settings).unwrap();
      toast.success('Settings saved successfully', 'Settings Updated');
      setIsDirty(false);
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to save settings', 'Save Failed');
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

        <form onSubmit={handleSaveSettings} className="space-y-8">
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
          </div>

          {/* User Limits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">User Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Max Artworks per User
                </label>
                <input
                type="number"
                  value={settings.max_artworks_per_user}
                  onChange={(e) => handleInputChange('max_artworks_per_user', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  min="1"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Max Posts per User
                </label>
                <input
                type="number"
                  value={settings.max_posts_per_user}
                  onChange={(e) => handleInputChange('max_posts_per_user', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                  min="1"
                  max="1000"
                />
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

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isDirty || isUpdating}
              className={`px-6 py-3 rounded-lg font-raleway font-semibold flex items-center space-x-2 ${
                isDirty && !isUpdating
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              {isUpdating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
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
        </form>
      </div>
    </AdminLayout>
  );
};

export default ModernSettings;