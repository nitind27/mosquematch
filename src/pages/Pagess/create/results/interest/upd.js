import React, { useState } from 'react';

function Cons() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateStatus = async () => {
    setIsLoading(true);

    try {
      // Retrieve email from localStorage
      const email = localStorage.getItem('email');

      // Check if email is available
      if (!email) {
        throw new Error('Email not found in localStorage');
      }

      // Mock API request - replace with your actual logic
      const response = await fetch("/api/interest/setCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, user_status: 1 }), // Fixed value for user_status
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

     
      console.log(response);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating user status:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateStatus} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update User Status'}
      </button>
      {success && <p>User status updated successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Cons;
