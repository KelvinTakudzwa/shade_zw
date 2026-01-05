import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import AboutBrand from './components/AboutBrand';
import ContactFloat from './components/ContactFloat';
import Footer from './components/Footer';
import Admin from './components/Admin';
import './App.css';

function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <AboutBrand />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <ContactFloat />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
