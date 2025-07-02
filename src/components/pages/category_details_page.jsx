import { useLocation, useNavigate } from 'react-router-dom';
import './category_details.css';

const CategoryDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No category selected.</p>;

  return (
    <div className="category-detail-wrapper">
      <div className="category-detail-flex">
        <div className="category-detail-image">
          <img src={state.image} alt={state.title} />
        </div>
        <div className="category-detail-text">
          <h2>{state.title}</h2>
          <p>
            Welcome to the <strong>{state.title}</strong> category! This is where
            creativity meets excellence. Show off your talent, be part of a
            community, and get a chance to win amazing rewards!
          </p>
          <h4>🏅 Rewards:</h4>
          <ul className="rewards-list">
            {(state.rewards || []).map((reward, index) => (
              <li key={index}>{reward}</li>
            ))}
          </ul>
          <button className="fire-buton" onClick={() => navigate('/register')}>
            Click to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
