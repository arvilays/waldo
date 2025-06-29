import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
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

  if (loading) return <p>Loading maps...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-title">FinD & SeeK</div>
        <div className="home-window">
          {maps.map(map => (
            <Link to={`/play/${map.slug}`} className="home-scenario" key={map.id}>
              <img
                className="home-scenario-image"
                src={map.thumbnailUrl}
                alt={map.name}
                title={`Image Source: ${map.imageCreator}`}
              />
              <div className="home-scenario-name">{map.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;