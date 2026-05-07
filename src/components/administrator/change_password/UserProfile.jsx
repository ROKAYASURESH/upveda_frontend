import React, { useEffect, useState } from "react";
import { getUserProfile } from "./endpoints";  

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      
      <p>Username: {user.username }</p>
      <p>First Name: {user.first_name }</p>
      <p>Last Name: {user.last_name }</p>
      <p>Email: {user.email }</p>
    </div>
  );
};

export default UserProfile;
