import sleepingCatImage from "../assets/sleeping-cat.png";
import sadCatImage from "../assets/sad-cat.png";
import loadingCatImage from "../assets/loading-cat.png";
import "../styles/status.css";

function Loading({ title, description, type = "wake" }) {
  let loadingImage; 
  if (type === "wake") {
    loadingImage = sleepingCatImage;
  } else if (type === "error") {
    loadingImage = sadCatImage;
  } else if (type === "loading") {
    loadingImage = loadingCatImage;
  }
  
  return (
    <div className="loading-container">
      <img className="loading-image" src={loadingImage} alt="sleeping cat" />
      <div className="loading-title">{title}</div>
      <div className="loading-description">{description}</div>
    </div>
  );
}

export default Loading;