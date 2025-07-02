import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/body/introduction_section/intro_section.jsx';
import Register from './components/userAuth/registration_form';
import Navbar from './components/navbar/navbar.jsx';
import CategoriesSection from './components/body/categories_section/categories.jsx';
import CategoryDetails from './components/pages/category_details_page.jsx';
import PerformancePage from './components/pages/performing_page.jsx';
import Footer from './components/footer/footer.jsx';
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
  </Routes>
  <Footer />
</BrowserRouter>

  );
}

export default App;