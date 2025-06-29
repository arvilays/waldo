import apiClient from "../api";
import "../styles/errorPage.css";

function ErrorPage() {
  const handleCleanup = async () => {
    const password = prompt("Enter cleanup password:");
    if (!password) return;

    try {
      const data = await apiClient.request(`/cleanup/${encodeURIComponent(password)}`, {
        method: "DELETE",
      });

      alert(`✅ Cleanup successful: ${data.message}`);
    } catch (err) {
      console.error("Cleanup failed", err);
      alert("❌ Server error or invalid password.");
    }
  };

  return (
    <>
      <div className="error-container">
        <div className="error-title">4🔎4</div>
        <div className="error-description">page not found.</div>
      </div>

      <div className="cleanup" onClick={handleCleanup} title="Developer cleanup">
        🗑️
      </div>
    </>
  );
};

export default ErrorPage;
