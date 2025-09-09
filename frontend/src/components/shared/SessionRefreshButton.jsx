import { useEffect, useState } from "react";
import useLogout from "../../hooks/useLogout";

const SessionRefreshButton = () => {
  const [showButton, setShowButton] = useState(false);
  const { forceLogout } = useLogout();

  // Listen for 401 errors in fetch requests
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);

      // If we get a 401 Unauthorized error, show the refresh button
      if (response.status === 401) {
        setShowButton(true);
        // Clone the response so we can still return it
        return response.clone();
      }

      return response;
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={forceLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md"
      >
        Session Expired - Click to Refresh
      </button>
    </div>
  );
};

export default SessionRefreshButton;
