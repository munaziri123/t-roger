import './categories_section.css';
import { useNavigate } from 'react-router-dom';

import dancing from '../categories_section/images/dancing.png';
import singing from '../categories_section/images/singing.png';
import acting from '../categories_section/images/fashion.png';
import fashion from '../categories_section/images/journalist.png';
import comedy from '../categories_section/images/comedy.png';
import poetry from '../categories_section/images/poetry.png';

const categories = [
  {
    id: 1,
    title: 'Singing',
    image: singing,
    rewards: [
      "💵 $200",
      "🎶 1 song video and audio",
      "🎤 Media tour",
    ],
  },
  {
    id: 2,
    title: 'Dancing',
    image: dancing,
    rewards: [
      "💵 $200",
      "🎥 Media tour",
      "🎧 Connections to hitmakers",
    ],
  },
  {
    id: 3,
    title: 'Acting',
    image: acting,
    rewards: [
      "🏆 Winner's Trophy",
      "🌐 Media Exposure",
      "🎁 Sponsorship Opportunities",
    ],
  },
  {
    id: 4,
    title: 'Journalist',
    image: fashion,
    rewards: [
      "💵 $200",
      "🎤 Media tour",
      "📰 Direct job connection in a media house",
    ],
  },
  {
    id: 5,
    title: 'Comedy',
    image: comedy,
    rewards: [
      "🏆 Winner's Trophy",
      "🎤 Media Exposure",
      "🎁 Sponsorship Opportunities",
    ],
  },
  {
    id: 6,
    title: 'Poetry',
    image: poetry,
    rewards: [
      "💵 $200",
      "📝 Book publishing opportunity",
      "🎤 Live stage performance",
    ],
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handlePerformClick = (category) => {
    navigate('/category', { state: category });
  };

  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <h3 className="category-title">{cat.title}</h3>
            <div className="category-image-wrapper">
              <img src={cat.image} alt={cat.title} className="category-img" />
              <button
                className="perform-button"
                onClick={() => handlePerformClick(cat)}
              >
                Perform
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
