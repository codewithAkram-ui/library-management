import React from "react";
import { Route, Redirect } from "react-router-dom";
const PrivateRoute = (props) => {
  const uid = window.sessionStorage.getItem("uid");
  if (!uid) return <Redirect to="/login" />;
  return <Route>{props.children}</Route>;
};

export default PrivateRoute;
