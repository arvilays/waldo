import { useState, useEffect, useRef } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import "../styles/play.css";

function Play() {
  const [gameSessionId, setGameSessionId] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [assignedFindables, setAssignedFindables] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();

  const apiClient = useOutletContext();

  const imageRef = useRef(null);

  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = windowRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(true);
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

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleImageLoad = (event) => {
    const imageElement = event.target;

    if (imageElement.naturalHeight > imageElement.naturalWidth) {
      imageElement.classList.add("vertical");
      imageElement.classList.remove("horizontal");
    } else {
      imageElement.classList.add("horizontal");
      imageElement.classList.remove("vertical");
    }
  };

  const handleImageClick = (event) => {
    const img = imageRef.current;

    if (!img) {
      console.warn("Image ref not available.");
      return;
    }

    const rect = img.getBoundingClientRect();

    const xInDisplayPixels = event.clientX - rect.left;
    const yInDisplayPixels = event.clientY - rect.top;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    const originalImageX = Math.round(xInDisplayPixels * scaleX);
    const originalImageY = Math.round(yInDisplayPixels * scaleY);

    console.log(`Clicked at (Original Image Pixels): X=${originalImageX}, Y=${originalImageY}`);
  };

  useEffect(() => {
    const startGameSession = async () => {
      try {
        const gameSessionData = await apiClient.request(`/game/start/${slug}`, { method: "POST" });
        setGameSessionId(gameSessionData.gameSessionId);
        setMapData(gameSessionData.map);
        setAssignedFindables(gameSessionData.assignedFindables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    startGameSession();
  }, [slug, apiClient]);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="play-container">
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
          assignedFindables.map((findable) => (
            <div key={findable.id} className="findable">
              <img
                className="findable-thumbnail"
                src={findable.imageUrl}
                alt={findable.name}
                title={findable.name}
                draggable="false"
                onMouseDown={handleImageMouseDown} 
              />
              <div className="findable-name">{findable.name}</div>
            </div>
          ))
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
    </div>
  );
}

export default Play;