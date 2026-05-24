import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Calendar,
  Users,
  User,
  Save,
  X,
} from "lucide-react";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  editType: "name" | "gender" | "dob" | "password";
  currentValue?: string;
  onUpdate: (data: any) => Promise<{ success: boolean; message?: string }>;
  user?: any;
}

const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  onClose,
  editType,
  currentValue,
  onUpdate,
  // user
}) => {
  const [formData, setFormData] = useState({
    displayName: "",
    gender: "",
    dob: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function to format date for input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    try {
      // If it's already in YYYY-MM-DD format, use it directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Try to parse the date string
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "";
      }

      // Format to YYYY-MM-DD for input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setError("");

      switch (editType) {
        case "name":
          setFormData((prev) => ({
            ...prev,
            displayName: currentValue || "",
          }));
          break;
        case "gender":
          setFormData((prev) => ({
            ...prev,
            gender: currentValue || "",
          }));
          break;
        case "dob":
          setFormData((prev) => ({
            ...prev,
            dob: currentValue ? formatDateForInput(currentValue) : "",
          }));
          break;
        case "password":
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }));
          break;
      }
    }
  }, [isOpen, editType, currentValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    );
    return maxDate.toISOString().split("T")[0];
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 120,
      today.getMonth(),
      today.getDate(),
    );
    return minDate.toISOString().split("T")[0];
  };

  const validatePasswordChange = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (editType === "password" && !validatePasswordChange()) return;

    setIsLoading(true);
    setError("");

    try {
      let updateData = {};

      switch (editType) {
        case "name":
          updateData = { displayName: formData.displayName };
          break;
        case "gender":
          updateData = { gender: formData.gender };
          break;
        case "dob":
          updateData = { dob: formData.dob };
          break;
        case "password":
          updateData = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          };
          break;
        default:
          return;
      }

      const result = await onUpdate(updateData);

      if (result.success) {
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setShowCurrentPassword((prev) => !prev);
        break;
      case "new":
        setShowNewPassword((prev) => !prev);
        break;
      case "confirm":
        setShowConfirmPassword((prev) => !prev);
        break;
    }
  };

  const handleClose = () => {
    setError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const getTitle = () => {
    switch (editType) {
      case "name":
        return "Edit Display Name";
      case "gender":
        return "Edit Gender";
      case "dob":
        return "Edit Date of Birth";
      case "password":
        return "Change Password";
      default:
        return "Edit Field";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {getTitle()}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {editType === "name" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {editType === "gender" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  autoFocus
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {editType === "dob" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="dob"
                  type="date"
                  required
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={formData.dob}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  autoFocus
                />
              </div>
            </div>
          )}

          {editType === "password" && (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter current password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    minLength={6}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    minLength={6}
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Update
              </>
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;

