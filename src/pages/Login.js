import React, { useEffect, useState } from "react";
import {
  Input,
  Form,
  FormGroup,
  Label,
  Card,
  CardTitle,
  CardBody,
  Button,
  Row,
  CardFooter,
  Spinner,
  Col,
  Alert,
} from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import logo from "../assets/login-logo.png";
import { auth } from "../firebase/firebase";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
const Login = ({ isSignup }) => {
  const history = useHistory();
  const [email, setEmail] = useState("kalpish@gmail.com");
  const [pwd, setPwd] = useState("1234567890");
  const [repeatPwd, setRepeat] = useState("1234567890");
  const [isLoading, setLoading] = useState(false);
  const [loginError, setError] = useState("");
  const uid = window.sessionStorage.getItem("uid");
  const onSubmitHandler = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        // Creating new user account
        await createUserWithEmailAndPassword(auth, email, pwd)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            window.sessionStorage.setItem("uid", user.uid);
            window.sessionStorage.setItem("email", user.email);
            history.push("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
          });
      } else {
        // Login using existing account
        await signInWithEmailAndPassword(auth, email, pwd)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            window.sessionStorage.setItem("uid", user.uid);
            window.sessionStorage.setItem("email", user.email);
            history.push("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
          });
      }
    } finally {
      setLoading(false);
    }
  };
  const googleAuthHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        console.log(result);
        const user = result.user;
        window.sessionStorage.setItem("uid", user.uid);
        window.sessionStorage.setItem("email", user.email);
        history.push("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(error);
        // The AuthCredential type that was used.

        const credential = GoogleAuthProvider.credentialFromError(error);

        // ...
      });
  };

  useEffect(() => {
    let timer;
    if (loginError !== "") {
      timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [loginError]);

  if (uid) return <Redirect to="/" />;
  return (
    <div
      className="login-bg"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Row className="xs-2" style={{ width: "100%" }}>
        <Col className="md-2">
          <img width="100%" alt="BookShelf" src={logo} />
        </Col>
        <Col className="md-2 align-self-center">
          <Card
            style={{
              width: "50%",
              minWidth: "20rem",
              backgroundColor: "#0d1117",
              margin: "auto",
            }}
          >
            <CardBody>
              <CardTitle style={{ color: "#f03552" }} tag="h1">
                {isSignup ? "Sign Up" : "Login"}
              </CardTitle>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  placeholder="Enter password"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </FormGroup>
              {isSignup && (
                <FormGroup>
                  <Label>Repeat Password</Label>

                  <Input
                    placeholder="Enter password"
                    type="password"
                    value={pwd}
                    onChange={(e) => setRepeat(e.target.value)}
                  />
                </FormGroup>
              )}
              {isLoading ? (
                <Spinner style={{ margin: "1px" }} />
              ) : (
                <Button
                  onClick={onSubmitHandler}
                  // style={{ color: "black", backgroundColor: "white" }}
                  color="danger"
                >
                  {isSignup ? "Sign up" : "Login"}
                </Button>
              )}
            </CardBody>
            <CardFooter>
              {isSignup ? (
                <NavLink
                  to="/login"
                  style={{
                    fontSize: "1rem",
                    textDecoration: "none",
                    color: "#f03552",
                  }}
                >
                  Log in instead
                </NavLink>
              ) : (
                <NavLink
                  to="/signup"
                  style={{
                    fontSize: "1rem",
                    textDecoration: "none",
                    color: "#f03552",
                  }}
                >
                  Sign up instead
                </NavLink>
              )}
            </CardFooter>
            <CardBody>
              <Button
                onClick={googleAuthHandler}
                style={{
                  backgroundColor: "#f03552",
                  border: "0",
                  borderRadius: "4px",
                  color: "#757575",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <img
                  src="https://accounts.google.com/favicon.ico"
                  alt="Google icon"
                  style={{ marginRight: "8px" }}
                />
                <span>Sign in with Google</span>
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {loginError !== "" && <Alert color="danger">{loginError}</Alert>}
    </div>
  );
};

export default Login;
