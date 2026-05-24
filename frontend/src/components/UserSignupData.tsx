import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Calendar, Users } from 'lucide-react'

const UserSignupData = () => {

  type FormData = {
    email:string,
    displayName:string,
    photoURL:string
    password:string,
    confirmPassword:string,
    dob:string|number,
    gender:string,
  }
  const [formData, setFormData] = useState<FormData>({ 
    email:'',
    displayName:'',
    photoURL:'',
    password: '',
    confirmPassword:'',
    dob:'',
    gender: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const {setUser} = useAuthContext()

  useEffect(()=>{
    const ss = onAuthStateChanged(auth,currUser => {
      setFormData(prev => ({ ...prev,
        email: currUser?.email || '',
        displayName:currUser?.displayName || '',
        photoURL:currUser?.photoURL || '' 
      }))
    })
    return ()=>ss()
  },[])
 
  const handleChange = (e:any): void => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  // Get min date (120 years ago from today) for DOB validation
  const getMinDate = () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    return minDate.toISOString().split('T')[0]
  }

  const checkPassword = ():boolean => {
   return (formData.password === formData.confirmPassword) ? true : false 
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!checkPassword()){
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/signup-detail',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data = await response.json()
      if(data.status){
        setUser(prev => ({...prev,isLoggedIn:true}))
        navigate('/preferences')
      } else {
        setError('Signup failed. Please try again.')
        navigate('/signup')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 top-[88px] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Just a few more details to get started
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* User Info Display */}
          {formData.displayName && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                {formData.photoURL && (
                  <img 
                    src={formData.photoURL} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Welcome, {formData.displayName}!
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {formData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Date of Birth and Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth Field */}
              <div>
                <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={formData.dob}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing setup...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default UserSignupData