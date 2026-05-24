import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaStar,
  FaCheck,
} from "react-icons/fa";
import { MdSecurity, MdSpeed, MdDevices } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {user} = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if(user.isLoggedIn){
    navigate('/home')
    return
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to the Future of
              <span className="text-green-600 dark:text-green-400">
                {" "}
                Digital Innovation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience seamless security, elegant design, and powerful
              functionality in one revolutionary platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to='/signup'
                className="group bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
              to = "/login"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-600 dark:hover:border-green-400 font-medium py-4 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Modern Users
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature is crafted with precision, security, and user
              experience at its core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Security Feature */}
            <div className="group p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MdSecurity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Enterprise-Grade Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Advanced encryption, secure authentication, and privacy-first
                design principles protect your data at every level.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  End-to-end encryption
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Multi-factor authentication
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  GDPR compliant
                </li>
              </ul>
            </div>

            {/* Performance Feature */}
            <div className="group p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MdSpeed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Lightning Fast Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Built with modern technologies for instant loading, real-time
                updates, and seamless interactions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Sub-second load times
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Real-time synchronization
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Offline capabilities
                </li>
              </ul>
            </div>

            {/* Cross-Platform Feature */}
            <div className="group p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MdDevices className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Universal Compatibility
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Seamless experience across all devices with responsive design
                and dark mode support.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Mobile responsive
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Dark mode support
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheck className="h-4 w-4 text-green-600 mr-2" />
                  Cross-browser compatible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      // Enhanced Stats Section with Dark Theme and Animations
      <section className="py-20 bg-gray-900 dark:bg-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              Trusted by Thousands
            </h2>
            <p className="text-gray-300 text-lg animate-fade-in-delay">
              Join our growing community of satisfied users
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Uptime Stat */}
            <div className="group text-center transform transition-all duration-500 hover:scale-110 animate-slide-up">
              <div className="bg-gray-800 dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20">
                <div className="text-5xl font-bold text-green-400 mb-3 group-hover:text-green-300 transition-colors duration-300 animate-count-up">
                  99.9%
                </div>
                <div className="text-gray-300 font-medium">
                  Uptime Guarantee
                </div>
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full animate-progress-bar"
                    style={{ width: "99.9%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Users Stat */}
            <div className="group text-center transform transition-all duration-500 hover:scale-110 animate-slide-up delay-100">
              <div className="bg-gray-800 dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-blue-500/20">
                <div className="text-5xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors duration-300 animate-count-up">
                  10k+
                </div>
                <div className="text-gray-300 font-medium">Active Users</div>
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full animate-progress-bar delay-200"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Support Stat */}
            <div className="group text-center transform transition-all duration-500 hover:scale-110 animate-slide-up delay-200">
              <div className="bg-gray-800 dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20">
                <div className="text-5xl font-bold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors duration-300 animate-count-up">
                  24/7
                </div>
                <div className="text-gray-300 font-medium">
                  Support Available
                </div>
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full animate-progress-bar delay-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Rating Stat */}
            <div className="group text-center transform transition-all duration-500 hover:scale-110 animate-slide-up delay-300">
              <div className="bg-gray-800 dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-yellow-500/20">
                <div className="text-5xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors duration-300 animate-count-up">
                  5★
                </div>
                <div className="text-gray-300 font-medium">User Rating</div>
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full animate-progress-bar delay-400"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Innovators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our users are saying about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div
                key={testimonial}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  "This platform has revolutionized how we handle our digital
                  workflow. The security features give us peace of mind, and the
                  interface is incredibly intuitive."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Sarah Johnson
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tech Lead, InnovateCorp
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Be Among the First to Experience Innovation
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join our exclusive early access program and get notified when we
            launch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
            to = '/signup'
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300"
            >
              Join Early Access
            </Link>
            <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-600 font-medium py-4 px-8 rounded-lg transition-all duration-300">
              Learn More
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No spam • Exclusive updates • First access to new features
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-300 mb-6">
              Contact us to learn more about our platform
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:hello@yourapp.com"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                hello@yourapp.com
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="#"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Your App Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
