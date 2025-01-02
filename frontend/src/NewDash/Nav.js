import React from "react";
import Logout from "../Pages/Authentication/Logout";
import UserProfile from "../Pages/Authentication/UserProfile";

const Nav = () => {
  return (
    <>
    <style>
  {`
    @media (max-width: 576px) {
      .hidden-on-mobile, .logout-container {
        display: none;
      }
      .height {
        max-height: 70px;
      }
      .btn-info{
      max-height: 40px
      }
    }
  `}
</style>

      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button type="button" id="sidebarCollapse" className="btn btn-info">
          <i className="fas fa-align-left" />
          <i className="bx bx-menu"></i>
        </button>
        <button
          className="btn btn-dark d-inline-block d-lg-none ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-align-justify" />
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link navbar-brand" href="#">
                AVS Verify
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mt-2" href="#">
                Onboarding Solution
              </a>
            </li>
            <li className="nav-item" style={{marginLeft:'800px'}}>
              <Logout/>
            </li>
          </ul>
        </div>
      </nav> */}
      <nav className="container-fluid navbar navbar-expand-lg navbar-light bg-light height">
        <div className="d-flex">
          <button type="button" id="sidebarCollapse" className="btn btn-info">
            <i className="fas fa-align-left" />
            <i className="bx bx-menu"></i>
        </button>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="navbar-brand" href="#">
                Bank Name
              </a>
            </li>
            <li className="nav-item hidden-on-mobile">
              <a className="nav-link mt-2 text" href="#">
                Onboarding Solution
              </a>
            </li>
            <li className="nav-item hidden-on-mobile" style={{marginLeft:'820px',marginTop:'10px'}}>
              <Logout/>
            </li>
            <li className="nav-item hidden-on-mobile">
              <UserProfile/>
            </li>
          </ul>
        </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
