import React from "react";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <div className="container mt-5 text-center">
      {user || admin ? (
        <h1>
          Welcome, {user?.Cus_Name || admin?.Emp_Name}{" "}
          {user?.Cus_Lname || admin?.Emp_Lname}
        </h1>
      ) : (
        <h1>Welcome to MyApp!</h1>
      )}
      <p className="lead">
        {user || admin
          ? "You are now logged in."
          : "Feel free to explore the site or log in to access more features."}
      </p>
    </div>
  );
};

export default Home;
