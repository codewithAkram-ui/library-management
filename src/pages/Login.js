import React, { useState } from "react";
import {
  Input,
  Form,
  FormGroup,
  Label,
  Card,
  CardTitle,
  CardBody,
  Button,
} from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
const Login = ({ isSignup }) => {
  const history = useHistory();
  const [email, setEmail] = useState("kalpish@gmail.com");
  const [pwd, setPwd] = useState("1234567890");
  const uid = window.sessionStorage.getItem("uid");
  const onSubmitHandler = async () => {
    if (isSignup) {
      // Creating new user account
      await createUserWithEmailAndPassword(auth, email, pwd)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          window.sessionStorage.setItem("uid", user.uid);
          history.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } else {
      // Login using existing account
      signInWithEmailAndPassword(auth, email, pwd)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          window.sessionStorage.setItem("uid", user.uid);
          history.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  if (uid) return <Redirect to="/" />;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Card style={{ width: "50%", minWidth: "20rem", margin: "auto" }}>
        <CardBody>
          <CardTitle tag="h5">{isSignup ? "Signup" : "Login"}</CardTitle>
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
          <Button onClick={onSubmitHandler} color="primary">
            {isSignup ? "Signup" : "Login"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
