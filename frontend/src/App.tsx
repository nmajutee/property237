import { Route, Routes } from 'react-router-dom'
import './App.css'
// React state not needed here; header manages its own state
import Header from './components/Header'
import Home from './pages/Home'
import Agents from './pages/Agents'
import AgentProfile from './pages/AgentProfile'
import PropertyDetail from './pages/PropertyDetail'
import Buy from './pages/Buy'
import Rent from './pages/Rent'
import Sell from './pages/Sell'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogArticle from './pages/BlogArticle'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import DashboardIndex from './pages/dashboard/Index'
import DashboardProperties from './pages/dashboard/Properties'
import DashboardAddProperty from './pages/dashboard/AddProperty'
import DashboardFavorites from './pages/dashboard/Favorites'
import DashboardEnquiries from './pages/dashboard/Enquiries'
import DashboardSettings from './pages/dashboard/Settings'
import DashboardUpgrade from './pages/dashboard/Upgrade'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import DataRights from './pages/DataRights'
import Disclaimer from './pages/Disclaimer'
import Accessibility from './pages/Accessibility'

export default function App() {

  return (
    <div>
  <Header />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/property/:slug" element={<PropertyDetail />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/buy/:city" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/rent/:city" element={<Rent />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardIndex />} />
          <Route path="/dashboard/properties" element={<DashboardProperties />} />
          <Route path="/dashboard/add-property" element={<DashboardAddProperty />} />
          <Route path="/dashboard/favorites" element={<DashboardFavorites />} />
          <Route path="/dashboard/enquiries" element={<DashboardEnquiries />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          <Route path="/dashboard/upgrade" element={<DashboardUpgrade />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/data-rights" element={<DataRights />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Routes>
      </main>
    </div>
  )
}
