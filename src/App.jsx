import { Outlet } from "react-router-dom";
import apiClient from "./api";

function App() {
  return (
    <>
      <Outlet context={ apiClient }/>
    </>
  )
};

export default App;