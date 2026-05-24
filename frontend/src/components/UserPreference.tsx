import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { 
  Leaf, 
  Heart, 
  MapPin, 
  CheckCircle, 
  Package, 
  ShoppingBag,
  Save,
  AlertTriangle,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const UserPreference = () => {
  const [preferences, setPreferences] = useState({
    animalEthics: [],
    certifications: [],
    productType: [],
    packaging: [],
    materialSafety: [],
    distancePreference: [],
    additiveAwareness: []
  });

  const { user, loading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchingPreferences, setFetchingPreferences] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from settings page
  const cameFromSettings = location.state?.from === 'settings';

  const handleMultiSelect = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      setFetchingPreferences(true);
      try {
        const response = await fetch('/api/get-preferences', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        console.log(data)
        
        if (data.status && data.data) {
          const fetchedPreferences = {
            animalEthics: data.data.animalEthics || [],
            certifications: data.data.certifications || [],
            productType: data.data.productType || [],
            packaging: data.data.packaging || [],
            materialSafety: data.data.materialSafety || [],
            distancePreference: data.data.distancePreference || [],
            additiveAwareness: data.data.additiveAwareness || []
          };
          
          setPreferences(fetchedPreferences);
          // console.log('Fetched preferences:', fetchedPreferences);
        } else {
          // console.log('No preferences found or error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setFetchingPreferences(false);
      }
    };
    
    fetchPreferences();
  }, [user.isLoggedIn]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/set-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      // console.log(data);
      if (data.status) {
        setSaved(true);
        // console.log('Preferences saved successfully:', data);
        
        // Navigate based on where user came from
        if (cameFromSettings) {
          navigate('/settings');
        } else {
          navigate('/home');
        }
        
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PreferenceSection = ({ title, icon: Icon, children, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl mr-3">
          <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );

  const MultiSelectButton = ({ value, selected, onClick, children }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${
        selected
          ? 'bg-green-600 text-white border-green-600 shadow-md'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
    >
      {selected && <CheckCircle className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );

  // Show loading spinner while fetching preferences
  if (fetchingPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Show only if user came from settings */}
        {cameFromSettings && (
          <div className="mb-6">
            <Link 
              to="/settings"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sustainability Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help us personalize your experience by sharing your sustainability values and preferences. 
            We'll use this to recommend products and content that align with your values.
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                Your preferences have been saved successfully!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Animal Ethics */}
          <PreferenceSection 
            title="Animal Ethics" 
            icon={Heart}
            description="What are your preferences regarding animal welfare?"
          >
            <div className="flex flex-wrap gap-3">
              {['vegan'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.animalEthics.includes(option)}
                  onClick={(value) => handleMultiSelect('animalEthics', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Certifications */}
          <PreferenceSection 
            title="Certifications" 
            icon={CheckCircle}
            description="Which certifications do you trust and value?"
          >
            <div className="flex flex-wrap gap-3">
              {['fsc', 'usda-organic', 'fair-trade'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.certifications.includes(option)}
                  onClick={(value) => handleMultiSelect('certifications', value)}
                >
                  {option.replace(/-/g, ' ').toUpperCase()}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Product Type */}
          <PreferenceSection 
            title="Product Type" 
            icon={ShoppingBag}
            description="What types of products are you most interested in?"
          >
            <div className="flex flex-wrap gap-3">
              {['plant-based', 'dairy', 'canned', 'gluten-free'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.productType.includes(option)}
                  onClick={(value) => handleMultiSelect('productType', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Packaging */}
          <PreferenceSection 
            title="Packaging" 
            icon={Package}
            description="What packaging preferences do you have?"
          >
            <div className="flex flex-wrap gap-3">
              {['recyclable', 'compostable'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.packaging.includes(option)}
                  onClick={(value) => handleMultiSelect('packaging', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Material Safety */}
          <PreferenceSection 
            title="Material Safety" 
            icon={Leaf}
            description="What materials do you prefer to avoid or prioritize?"
          >
            <div className="flex flex-wrap gap-3">
              {['biodegradable', 'plastic-free'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.materialSafety.includes(option)}
                  onClick={(value) => handleMultiSelect('materialSafety', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Distance Preference */}
          <PreferenceSection 
            title="Distance Preference" 
            icon={MapPin}
            description="How far are you willing to source products from?"
          >
            <div className="flex flex-wrap gap-3">
              {['local', 'regional', 'global'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.distancePreference.includes(option)}
                  onClick={(value) => handleMultiSelect('distancePreference', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Additive Awareness */}
          <PreferenceSection 
            title="Additive Awareness" 
            icon={AlertTriangle}
            description="Which additives do you prefer to avoid or include?"
          >
            <div className="flex flex-wrap gap-3">
              {['avoid-artificial-preservatives', 'avoid-colorants', 'avoid-antioxidants', 'avoid-stabilizers'].map(option => (
                <MultiSelectButton
                  key={option}
                  value={option}
                  selected={preferences.additiveAwareness.includes(option)}
                  onClick={(value) => handleMultiSelect('additiveAwareness', value)}
                >
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MultiSelectButton>
              ))}
            </div>
          </PreferenceSection>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving preferences...
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreference;
