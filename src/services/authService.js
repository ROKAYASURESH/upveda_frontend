export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("access_token");
  console.log("called");
  console.log(accessToken);
  return !!accessToken;
};
