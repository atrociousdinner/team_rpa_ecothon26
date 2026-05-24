import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, AreaChart, Area } from 'recharts';
import { Heart, Clock, X, TrendingUp, Leaf, Star, Eye, Calendar, Award } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { convertDateToString } from '../utils/EditProfile'

const Dashboard = () => {
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  type Score = {
    name:string,
    value:number
  }
  const [scorepie,setScorepie] = useState<Score[]>([])
  const piecolors = ['#16a34a', 'transparent']

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        if (data.status) {
          setDashboardData(data.dashboardData);
        } else {
          console.error('Error fetching dashboard data:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    }
    const getUserEcoScore = async () => {
      try{
        const response = await fetch('/api/get-user-score')
        const data = await response.json()
        if(data.userScore){
          const userEcoScore = Math.round(data.userScore*100)/10
          setScorepie([ { name: 'Score', value: userEcoScore },
    { name: '', value: 10 - userEcoScore }])
        } 
      }catch(err){
        console.error(err)
      }
    }
    Promise.all([fetchDashboardData(),getUserEcoScore()])
  }, []);
  

  // Create dynamic collections data based on API response
  const getMyCollections = () => {
    if (!dashboardData) return [];
    
    return [
      { 
        name: 'Favorites', 
        value: dashboardData.favoritesCount || 0, 
        color: '#ef4444', 
        icon: Heart 
      },
      { 
        name: 'Review Later', 
        value: dashboardData.reviewLaterCount || 0, 
        color: '#3b82f6', 
        icon: Clock 
      },
      { 
        name: 'Not Interested', 
        value: dashboardData.notInterestedCount || 0, 
        color: '#6b7280', 
        icon: X 
      }
    ];
  };

  // Calculate percentage of 4+ star ratings
  const getHighRatingsPercentage = () => {
    if (!dashboardData?.ratings?.rows || dashboardData.ratings.rows.length === 0) return 0;
    
    const ratingsData = dashboardData.ratings.rows;
    const totalRatings = ratingsData.reduce((sum, item) => sum + parseInt(item.count || 0), 0);
    const highRatings = ratingsData
      .filter(item => parseInt(item.rating) >= 4)
      .reduce((sum, item) => sum + parseInt(item.count || 0), 0);
    
    return totalRatings > 0 ? Math.round((highRatings / totalRatings) * 100) : 0;
  };

  // Format ratings distribution for chart
  const getRatingsDistribution = () => {
    if (!dashboardData?.ratings?.rows) return [];
    
    return dashboardData.ratings.rows
      .filter(row => {
        const rating = row.rating;
        return rating !== null && 
               rating !== undefined && 
               !isNaN(rating) && 
               rating >= 1 && 
               rating <= 5;
      })
      .map(row => ({
        rating: `${row.rating} ${row.rating === 1 ? 'Star' : 'Stars'}`,
        count: parseInt(row.count) || 0
      }));
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get first name for greeting
  const getFirstName = (name) => {
    if (!name) return 'User';
    return name.split(' ')[0];
  };

  // Format join date
  // const formatJoinDate = (dateString) => {
  //   if (!dateString) return '';
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  const PersonalMetricCard = ({ title, value, icon: Icon, subtitle, color = 'text-green-600' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  // Show loading state if user data is not available or data is still loading
  if (!user || loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const myCollections = getMyCollections();
  const ratingsDistribution = getRatingsDistribution();
  const averageRating = parseFloat(dashboardData.ratings?.averageRating || 0).toFixed(2);
  const viewedDuration = dashboardData.averageViewedDuration?.average_duration || 0;
  const totalViews = dashboardData.averageViewedDuration?.viewed || 0;
  const percentageFavorites = dashboardData.favoritesCount && dashboardData.productCount 
    ? (dashboardData.favoritesCount / dashboardData.productCount * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Personal Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
             {user.photoURL ? (                
              <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-4 border-green-600"
                />) : (<span className="text-white font-bold text-lg">
                {getUserInitials(user.displayName)}
              </span>)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {getFirstName(user.displayName)}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your personal eco-journey dashboard • Member since {convertDateToString(new Date(user.createdAt).toLocaleDateString())}
              
              </p>
            </div>
          </div>
        </div>

        {/* Personal Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PersonalMetricCard 
            title="Products Explored" 
            value={totalViews}
            subtitle="lifetime views"
            icon={Eye} 
          />
          <PersonalMetricCard 
            title="My Favorites" 
            value={dashboardData.favoritesCount}
            subtitle="saved products"
            icon={Heart} 
            color="text-red-600"
          />
          <PersonalMetricCard 
            title="My Avg Rating" 
            value={averageRating}
            subtitle="out of 5 stars"
            icon={Star} 
            color="text-yellow-600"
          />
          <PersonalMetricCard 
            title="Eco Commitment" 
            value={`${percentageFavorites}%`}
            subtitle="products favorited"
            icon={Leaf} 
            color="text-green-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* My Collections */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Product Collections
            </h3>
            {myCollections.length > 0 && myCollections.some(item => item.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={myCollections}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {myCollections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {myCollections.map((collection, index) => {
                    const Icon = collection.icon;
                    return (
                      <div key={index} className="text-center">
                        <Icon className={`w-5 h-5 mx-auto mb-1`} style={{color: collection.color}} />
                        <p className="text-sm font-medium dark:text-gray-100">{collection.value}</p>
                        <p className="text-xs dark:text-gray-400">{collection.name}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start exploring products to build your collections!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* My EcoScore Profile */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              My EcoScore Profile
            </h3>
            {dashboardData.ecoScoreProfile && dashboardData.ecoScoreProfile.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart data={dashboardData.ecoScoreProfile} innerRadius="30%" outerRadius="80%">
                    <RadialBar dataKey="count" cornerRadius={10} fill="#10b981" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dashboardData.ecoScoreProfile[0]?.percentage || 0}% of your favorites are excellent eco products!
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start favoriting eco-friendly products to see your profile!</p>
                </div>
              </div>
            )}
          </div>

          {/* My Activity Timeline - Updated to show Favorites and Review Later */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              My Collection Journey
            </h3>
            {dashboardData.activityTimeline && dashboardData.activityTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.activityTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="favorited" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.8} 
                    name="Favorites"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="review_later" 
                    stackId="2" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                    name="Review Later"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start favoriting and saving products to see your collection timeline!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* My Rating Patterns */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              My Rating Patterns
            </h3>
            {ratingsDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingsDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You're quite positive! {getHighRatingsPercentage()}% of your ratings are 4+ stars
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start rating products to see your rating patterns!</p>
                </div>
              </div>
            )}
          </div>

          {/* My Sustainability Focus */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              My Score
            </h3>
            {scorepie[0].value > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scorepie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={1}
                      stroke="none"
                      cornerRadius={19}
                      dataKey="value"
                      startAngle={0}
                    >
                      {scorepie.map((_entry, index) =>{ 
                      return (

                        <Cell key={`cell-${index}`} fill={piecolors[index]} />
                      )})}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your Score will appear here.</p>
                </div>
              </div>
            )}
          </div> 
        </div>

        {/* Personal Insights Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Your Eco Journey Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Eco Champion</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                You prefer high-quality eco products with {getHighRatingsPercentage()}% positive ratings
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Thoughtful Explorer</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                You spend {Math.round(viewedDuration / 60)} minutes on average exploring each product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
