import { ArrowRight } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h2 className="hero-subtitle">Premium Eyewear</h2>
        <h1 className="hero-title">
          See the World <br />
          <span className="text-gold">Through Gold.</span>
        </h1>
        <p className="hero-desc">
          Handcrafted in Zimbabwe. Designed for the bold.
          Experience the fusion of modern luxury and timeless style.
        </p>

        <button
          className="btn-primary"
          onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Shop Collection <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
