import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useInput from "../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

const isEmail = (value) => value.includes("@");
const isNotEmpty = (value) => value.trim() !== "";

const Login = () => {
  const alert = useAlert();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    InputBlurHandler: emailBLurHandler,
    reset: restEmail,
  } = useInput(isEmail);

  const {
    value: passowrdValue,
    isValid: passowrdIsValid,
    hasError: passowrdHasError,
    valueChangeHandler: passowrdChangeHandler,
    InputBlurHandler: passowrdBLurHandler,
    reset: restPassowrd,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (emailIsValid && passowrdIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      await login(emailValue, passowrdValue).then(() => {
        navigate("/dashboard");
        alert.show("signed in succesufly!", {
          type: "success",
        });
      });
    } catch (err) {
      // setError(err.message);
      // console.log(err.code);
      if (err.code === "auth/user-not-found") {
        alert.show("user not found", {
          type: "error",
        });
      }
      if (err.code === "auth/wrong-password") {
        alert.show("The password entered is wrong", {
          type: "error",
        });
      }
      if (err.code === "auth/network-request-failed") {
        alert.show("please check your internet connection", {
          type: "error",
        });
      }
      // console.log(err.code);
    }
  };

  return (
    <div className="card" style={{ width: "30rem" }}>
      <div className="card-body">
        <h2 className="text-center mb-4 text-danger">Login</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control invalid"
              id="exampleInputEmail1"
              value={emailValue}
              onChange={emailChangeHandler}
              onBlur={emailBLurHandler}
              autoComplete="off"
            />
            {emailHasError && (
              <div id="emailHelp" className="form-text fw-bold text-danger">
                Please enter Valid Email(must inclue @)
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              autoComplete="off"
              value={passowrdValue}
              onChange={passowrdChangeHandler}
              onBlur={passowrdBLurHandler}
            />
            {passowrdHasError && (
              <div id="passwordHelp" className="form-text fw-bold text-danger">
                Password Cannot be empty
              </div>
            )}
          </div>
          {/* {error && (
            <div id="emailHelp" className="form-text fw-bold text-danger mb-1">
              {error}
            </div>
          )} */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formIsValid}
          >
            Login
          </button>
          <p className="text-primary text-center">
            <Link className="text-primary text-center" to="/signup">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
