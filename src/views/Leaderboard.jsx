import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { formatDuration } from "../helpers";
import "../styles/leaderboard.css";
import homeIcon from "../assets/home-circle-outline.svg";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();
  const apiClient = useOutletContext();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const res = await apiClient.request(`/leaderboard/${slug}`);
        setLeaderboardData(res.leaderboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, [slug, apiClient]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="leaderboard-container">
      <Link to="/">
        <img className="leaderboard-home-button" src={homeIcon} alt="Home" />
      </Link>
      
      <div className="leaderboard-title">The <span className="leaderboard-slug">[{slug.toUpperCase()}]</span> Leaderboard</div>
      <div className="leaderboard-list">
        {leaderboardData && leaderboardData.map((entry, index) => (
          <div className="leaderboard-entry" key={entry.playerName}>
            {index + 1}. {entry.playerName}: {formatDuration(entry.durationSeconds)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;