import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Leaf,
  ChevronRight,
  Heart
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const SettingsOption = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    iconBg = "bg-green-100 dark:bg-green-900/30",
    iconColor = "text-green-600 dark:text-green-400"
  }) => (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 ${iconBg} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
      </div>
    </button>
  );

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleUpdateEcoPreferences = () => {
    // Pass state to indicate coming from settings
    navigate('/preferences', { state: { from: 'settings' } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
            <Settings className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account settings and sustainability preferences to personalize your experience.
          </p>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center">
              <div className="relative">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-4 border-green-600"
                  />
                ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                )}
            </div>

              <div className='ml-4'>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.displayName || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Options */}
        <div className="space-y-4">
          <SettingsOption
            title="Edit Profile"
            description="Update your personal information, contact details, and account preferences"
            icon={User}
            onClick={handleEditProfile}
          />

          <SettingsOption
            title="Update Eco Preferences"
            description="Customize your sustainability preferences and values to get personalized recommendations"
            icon={Leaf}
            onClick={handleUpdateEcoPreferences}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Heart className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Sustainability Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Keep your preferences updated to discover products and content that align with your values and help you make more sustainable choices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
