import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from './components/Login'
import { AuthContextProvider } from './context/AuthContext'
import Home from './components/Home'
import Logout from './components/Logout'
import SignUp from './components/SignUp'
import UserSignupData from "./components/UserSignupData"
import UserPreference from "./components/UserPreference"
import EditProfile from "./components/EditProfile"
import LandingPage from "./components/LandingPage";
import SearchProduct from "./components/SearchProduct";
import AboutUsBlog from "./components/AboutUs";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import EcoScoreCalculator from "./components/EcoScoreCalculator";
import ProductsPage from "./components/ProductsPage";
import ProductPage from "./components/subcomponents/ProductPage";
import Collections from "./components/Collections";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/aboutus" element={<AboutUsBlog />} />
          <Route path="/signup-detail" element={<UserSignupData />} />
          <Route path="/preferences" element={<UserPreference />} />
          <Route path="/search-product" element={<SearchProduct />} />
          <Route path="/edit-profile" element={<EditProfile/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/eco-score-calculator" element={<EcoScoreCalculator/>}/>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/eco-score-calculator"
            element={<EcoScoreCalculator />}
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path = "/product/:id" element ={<ProductPage/>} />
          <Route path = "/collections" element ={<Collections/>} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
