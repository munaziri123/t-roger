import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/body/introduction_section/intro_section.jsx';
import Register from './components/userAuth/registration_form';
import Navbar from './components/navbar/navbar.jsx';
import CategoriesSection from './components/body/categories_section/categories.jsx';
import CategoryDetails from './components/pages/category_details_page.jsx';
import PerformancePage from './components/pages/performing_page.jsx';
import PaymentPage from './components/pages/payment_page.jsx';
import Footer from './components/footer/footer.jsx';
import AdminLogin from './components/admin/adminLogin.jsx';
import Dashboard from './components/admin/dashbord.jsx';
import Competitors from './components/admin/competitors.jsx';

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<CategoriesSection />} />
        <Route path="/category" element={<CategoryDetails />} />
        <Route path="/perform" element={<PerformancePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protect Dashboard and Competitors routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competitors"
          element={
            <ProtectedRoute>
              <Competitors />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
