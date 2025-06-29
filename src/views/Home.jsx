import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Status from "../components/Status";
import "../styles/home.css";

function Home() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = useOutletContext();

  useEffect(() => {
    const fetchMaps = async() => {
      try {
        const data = await apiClient.request("/maps");
        setMaps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaps();
  }, [apiClient]);

  if (loading) {
    return (
      <Status
        title="waking up servers..."
        description="(check back in a couple minutes!)"
        type="wake"
      />
    );
  }

  if (error) {
    return (
      <Status
        title="error"
        description={error}
        type="error"
      />
    );
  }

  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-title">FinD & SeeK</div>
        <div className="home-window">
          {maps.map(map => (
            <div className="home-map">
              <Link to={`/play/${map.slug}`} className="home-scenario" key={map.id}>
                <img
                  className="home-scenario-image"
                  src={map.thumbnailUrl}
                  alt={map.name}
                  title={`Image Source: ${map.imageCreator}`}
                />
                <div className="home-scenario-name">{map.name}</div>
              </Link>
              <Link to={`/leaderboard/${map.slug}`} className="home-map-leaderboard">🏆</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="credits">hidden object project by <a href="https://github.com/arvilays">arvilays</a></div>
    </div>
  );
};

export default Home;