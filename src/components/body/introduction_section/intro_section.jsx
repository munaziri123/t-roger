import React, { useState, useEffect } from 'react';
import './introduction_section.css';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import tRogerImage1 from '../introduction_section/images/events_images/afro.png';
import tRogerImage2 from '../introduction_section/images/events_images/t-roger.png';
import tRogerImage3 from '../introduction_section/images/events_images/singing.png';
import tRogerImage4 from '../introduction_section/images/events_images/cyangwe.png';
import tRogerImage5 from '../introduction_section/images/events_images/sing.png';
import { useNavigate } from 'react-router-dom';

const IntroductionSection = () => {
  const images = [tRogerImage1, tRogerImage2, tRogerImage3, tRogerImage4, tRogerImage5];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrent((current - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % images.length);
  };
  const navigate = useNavigate();

  return (
    <section className="intro-wrapper">
      {/* Intro Content */}
      <div className="intro-section">
        <div className="intro-text">
          <h2>Welcome to T-Roger Family</h2>
          <p>
            Where Talent Meets Opportunity and Dreams Take the Stage. At T-Roger 
            Family,
            we live and breathe talent., undiscovered potential to polished champions,
            our mission is to find the stars of tomorrow and help them shine today. Whether it’s
            music, sports, dance, art, or beyond—we scout, nurture, and elevate individuals with
            passion and purpose. We also create unforgettable experiences through professionally
            planned events that give talent the spotlight they deserve.
            
       {/* Fire Button */}
      <div className="fire-button-wrapper">
        <button
          className="fire-button"
          onClick={() => navigate('/perform ')}
        >
          🔥 Click to Open Upcoming Events
        </button>
      </div>
          </p>
        </div>
        
      </div>
      

      {/* Carousel */}
      
      <div className="carousel">
        <div>
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            {index === current && (
              <div className="slide-caption">
                <h3>Event {index + 1}</h3>
                <p>Stay tuned for more!</p>
              </div>
            )}
          </div>
        ))}
        <button className="nav left" onClick={prevSlide}>
          <FiArrowLeft />
        </button>
        <button className="nav right" onClick={nextSlide}>
          <FiArrowRight />
        </button>
      </div>
      </div>
      <div>
        
      </div>
    </section>
  );
};


export default IntroductionSection;
