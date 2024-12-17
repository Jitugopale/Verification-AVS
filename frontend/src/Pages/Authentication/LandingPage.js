import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card shadow p-3">
            <h1 className="card-title">Welcome to AVSVerify</h1>
            <p className="card-text">
              Securely verify various documents online with ease and reliability
            </p>
            <div className="row d-flex justify-content-center gap-3">
              <div className="col-2">
                <Link to="/register">
                  <button type="button" className="btn btn-primary">
                    Register
                  </button>
                </Link>
              </div>
              <div className="col-2">
                <Link to="/login">
                  <button type="button" className="btn btn-success">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
