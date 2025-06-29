import { useState, useEffect, useRef } from "react";
import { Link, useParams, useOutletContext, useNavigate } from "react-router-dom";
import { formatDuration } from "../helpers";
import Status from "../components/Status";
import "../styles/play.css";

function Play() {
  const [gameSessionId, setGameSessionId] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [assignedFindables, setAssignedFindables] = useState(null);
  const [foundFindables, setFoundFindables] = useState([]);
  const [gameTime, setGameTime] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [magnifier, setMagnifier] = useState(null); // { x, y, imageX, imageY }
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const { slug } = useParams();
  const apiClient = useOutletContext();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const windowRef = useRef(null);

  // Start Game Session
  useEffect(() => {
    const startGameSession = async () => {
      try {
        const res = await apiClient.request(`/game/start/${slug}`, {
          method: "POST",
        });
        setGameSessionId(res.gameSessionId);
        setMapData(res.map);
        setAssignedFindables(res.assignedFindables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    startGameSession();
  }, [slug, apiClient]);

  // Drag functionality for the findables window
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    const rect = windowRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };

  // Adjust scaling on image depending on orientation (vertical, horizontal)
  const handleImageLoad = (e) => {
    const img = e.target;
    img.style.opacity = "1";
    img.classList.toggle("vertical", img.naturalHeight > img.naturalWidth);
    img.classList.toggle("horizontal", img.naturalWidth >= img.naturalHeight);
  };

  // Image Click and Confirmation
  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    setMagnifier({
      x: e.clientX,
      y: e.clientY,
      imageX: Math.round((e.clientX - rect.left) * scaleX),
      imageY: Math.round((e.clientY - rect.top) * scaleY),
    });
  };

  const handleCheck = async () => {
    try {
      const res = await apiClient.request(
        `/game/findable-check/${gameSessionId}/${magnifier.imageX}/${magnifier.imageY}`,
        { method: "POST" }
      );
      setMagnifier(null);

      if (res.status === "found") {
        setFoundFindables((prev) => [...prev, res.findableId]);
        setMessage(`🎯 ${res.findableName} found!`);
        if (res.allFound) {
          setMessage("✅ All targets found! Game complete!");
          setGameTime(res.gameSession.durationSeconds);
          setGameFinished(true);
        }
      } else {
        setMessage(res.status === "already_found" ? "🟡 Already found this!" : "❌ No targets here.");
      }
    } catch (err) {
      console.error("Check failed", err);
      setMessage("⚠️ Error during check.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleOutsideClick = (e) => {
    if (magnifier && !e.target.closest(".magnifier-ui") && !e.target.closest(".bubble")) {
      setMagnifier(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !windowRef.current) return;

    const windowEl = windowRef.current;
    const windowRect = windowEl.getBoundingClientRect();

    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const maxX = window.innerWidth - windowRect.width;
    const maxY = window.innerHeight - windowRect.height;

    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleImageMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleLeaderboardSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.request(`/leaderboard/${gameSessionId}/${encodeURIComponent(playerName)}`, {
        method: "POST"
      });
      navigate(`/leaderboard/${mapData.slug}`);
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  if (loading) {
    return (
      <Status
        title="loading map..."
        description="(check back in a couple minutes!)"
        type="loading"
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
    <div className="play-container" onClick={handleOutsideClick}>
      <div
        className="play-findables"
        ref={windowRef}
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 1000,
        }}
      >
        {assignedFindables && assignedFindables.length > 0 ? (
          assignedFindables.map((findable) => {
            const isFound = foundFindables.includes(findable.id);
            return (
              <div key={findable.id} className={`findable ${isFound ? "found" : ""}`}>
                <img
                  className="findable-thumbnail"
                  src={findable.imageUrl}
                  alt={findable.name}
                  title={findable.name}
                  draggable="false"
                  onMouseDown={handleImageMouseDown}
                  style={{ opacity: isFound ? 0.4 : 1 }}
                />
                <div className="findable-name">
                  {findable.name}
                </div>
              </div>
            );
          })
        ) : (
          <div>No findables assigned for this game yet.</div>
        )}
      </div>

      <div className="play-area">
        <img
          ref={imageRef}
          className="play-image"
          src={mapData.imageUrl}
          alt={mapData.name}
          onLoad={handleImageLoad}
          onClick={handleImageClick}
          draggable="false"
        />
      </div>

      {magnifier && (
        <div
          className="magnifier-ui"
          style={{ top: magnifier.y, left: magnifier.x }}
        >
          <div className="magnifier">+</div>
          <div className="bubble-container">
            <div className="bubble check" onClick={handleCheck}>✔</div>
            <div className="bubble cancel" onClick={() => setMagnifier(null)}>✖</div>
          </div>
        </div>
      )}

      {message && <div className="status-message">{message}</div>}

      {gameFinished && (
        <div className="end-screen">
          <div className="end-title">game finished</div>
          {gameTime && <div className="end-time">Time: {formatDuration(gameTime)}</div>}
          <form onSubmit={handleLeaderboardSubmit}>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Name" 
              required 
            />
            <button type="submit">Submit to Leaderboard</button>
          </form>
          <div className="end-links">
            <Link to={`/leaderboard/${slug}`}>Leaderboard</Link>
            <Link to="/">Main Menu</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;
