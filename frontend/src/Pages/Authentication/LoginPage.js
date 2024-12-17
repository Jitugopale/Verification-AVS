import React from "react";
import {Link} from "react-router-dom"

const LoginPage = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card shadow p-3 w-50">
            <h1 className="card-title">Login</h1>
            <form className="mt-3">
              <div className="form-group mt-2">
                <label htmlFor="exampleInputEmail1 d-flex justify-content-center ">Email address</label>
                <input
                  type="email"
                  className="form-control mt-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group mt-2">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control mt-2"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
            <div className="mt-2">
                <p className="card-text">Not registered? <Link to="/register">Go to Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
