import React from "react";
import "./LoadingOverlay.css";
import MoonLoader from "react-spinners/MoonLoader";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <MoonLoader
        color="black"
        loading={isLoading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingOverlay;
