import React, { useEffect } from "react";
import Header from "./Header";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Home from "../pages/Home";
import { auth } from "../firebase/firebase";
import Search from "../pages/SearchPage";
import { BorrowHistory } from "../pages/BorrowHistory";

const Layout = () => {
  const uid = window.sessionStorage.getItem("uid");
  const history = useHistory();
  const logoutHandler = () => {
    window.sessionStorage.clear();
    history.push("/");
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid !== uid) logoutHandler();
      } else {
        logoutHandler();
      }
    });
  }, []);

  return (
    <div>
      <Header logoutHandler={logoutHandler} />
      <Switch>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/borrowHistory">
          <BorrowHistory />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
};

export default Layout;
