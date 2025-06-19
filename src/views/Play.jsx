import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import "../styles/play.css";

function Play() {
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { nameShort } = useParams();

  const apiClient = useOutletContext();

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const data = await apiClient.request(`/maps/${nameShort}`);
        setMapData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMap();
  }, [nameShort]);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="play-container">
      <img src={mapData.imageUrl} alt={mapData.name} className="play-image" />
    </div>
  );
}

export default Play;