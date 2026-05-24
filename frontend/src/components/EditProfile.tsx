import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { User, Edit3, Save, ArrowLeft, CheckCircle } from 'lucide-react'
import EditFieldModal from './subcomponents/EditFieldModal'
import { formatGender, formatDate, convertDateToString } from '../utils/EditProfile'
// import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const EditProfile = () => {
  const { user, setUser } = useAuthContext()
//   const navigate= useNavigate();
//   if(!(user.isLoggedIn)){
//     navigate('/login');
//   }
  
  type EditMode = 'name' | 'gender' | 'dob' | 'password' | null

  const [editMode, setEditMode] = useState<EditMode>(null)
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


    const getCurrentValue = () => {
    switch (editMode) {
      case 'name': return user?.displayName || ''
      case 'gender': return user?.gender || ''
      case 'dob': return user?.dob || ''
      case 'password': return '' // Password doesn't have a current value to display
      default: return ''
    }
  }

  const handleUpdate = async (updateData: any) => {
    try {
      const response = await fetch(`/api/update/${editMode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (data.success) {
        // Update user context with new data (except for password)
        if (editMode !== 'password') {
          setUser(prev => ({
            ...prev,
            ...updateData
          }))
        }
  const labelMap = {
    name: 'Name',
    gender: 'Gender',
    dob: 'Date of Birth',
    password: 'Password'
  };
  setSuccessMessage(`${labelMap[editMode!]} updated successfully!`);
  setShowSuccessPopup(true);

        return { success: true }
      } else {
        return { success: false, message: data.message || 'Failed to update profile' }
      }
    } catch (err) {
      return { success: false, message: 'Something went wrong. Please try again.' }
    }
  }

  const openEditMode = (mode: EditMode) => {
    setEditMode(mode)
  }

  const closeEditMode = () => {
    setEditMode(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/settings"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          {/* User Avatar Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-green-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Email Display (Read-only) */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-lg text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                Can not be changed
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Display Name */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {user?.displayName || 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => openEditMode('name')}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {formatGender(user?.gender || '')}
                </p>
              </div>
              <button
                onClick={() => openEditMode('gender')}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {formatDate(user?.dob || '')}
                </p>
              </div>
              {/*<button
                onClick={() => openEditMode('dob')}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>*/}
              <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                Can not be changed
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</p>
                <p className="text-lg text-gray-900 dark:text-white">••••••••</p>
              </div>
              <button
                onClick={() => openEditMode('password')}
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Change
              </button>
            </div>
          </div>

          {/*update preferences*/} 
          <div className="pt-6">
            <Link to={'/preferences'}
              className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              Update Preferences
            </Link>
          </div>

          {/* Account Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Account created: {user?.createdAt ? convertDateToString(new Date(user.createdAt).toLocaleDateString()) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <EditFieldModal
          isOpen={!!editMode}
          onClose={closeEditMode}
          editType={editMode}
          currentValue={getCurrentValue()}
          onUpdate={handleUpdate}
          user={user}
        />
        
      )}
      {showSuccessPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Success!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {successMessage}
        </p>
        <button
          onClick={() => {setShowSuccessPopup(false);
             closeEditMode();}
            }
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default EditProfile
