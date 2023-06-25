import { Switch } from "react-router-dom/cjs/react-router-dom";
import "./App.css";
import Login from "./pages/Login";

import { Route } from "react-router-dom/cjs/react-router-dom.min";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./layout";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Login isSignup />
        </Route>
        <PrivateRoute path="/">
          <Layout />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
