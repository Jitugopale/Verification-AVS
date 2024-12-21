import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // JavaScript (includes Popper.js)
import "../css/Dashboard.css";
import { useEffect } from "react";
import Pan from "../Pages/Verification/PancardVerificationPage"; // Import the Pan component
import Aadhaar from "../Pages/Verification/PancardVerificationPage"; // Import the Aadhaar component
import Sidebar from "./Sidebar";

import ApiVerification from '../Demo Dash/ApiVerification'
// import Navbar from "./Navbar";
import Content from "./Content";
import Cont from "../NewDash/Cont";
import Slide from "../NewDash/Slide";
import Nav from "../NewDash/Nav";
import { useState } from "react";

const Dashboard = () => {
  const [view, setView] = useState('dashboard');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  

  const handleSubmenuClick = (item) => {
    setSelectedSubmenu(item); // Set the selected submenu item
    setSubmenuHistory((prevHistory) => [...prevHistory, submenu]); // Push current submenu to history
    switch (item) {
      case "PAN":
        setActiveComponent(<Pan />);
        break;
      case "AADHAAR VERIFICATION":
        setActiveComponent(<Aadhaar />);
        break;
      default:
        setActiveComponent(<p>{item} content will be here...</p>);
        break;
    }
  };
;
  };
  useEffect(() => {
    const sidebarCollapse = document.getElementById("sidebarCollapse");
    const sidebar = document.getElementById("sidebar");

    const toggleSidebar = () => {
      sidebar.classList.toggle("active");
    };

    sidebarCollapse.addEventListener("click", toggleSidebar);

    // Cleanup to remove event listener on component unmount
    return () => {
      sidebarCollapse.removeEventListener("click", toggleSidebar);
    };
  }, []);

  const renderMainContent = () => {
    if (view === "dashboard") {
      return (
        // <div className="dashboard-view">
        //   <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 bg-white shadow rounded">
        //     <div>
        //       <h4>Hi, WALMIK DARADE</h4>
        //       <p className="text-muted">Cheers, and happy activities.</p>
        //       <p className="font-weight-bold">
        //         Wallet Balance: <span>Rs. 47445.56</span>
        //       </p>
        //       <button className="btn btn-warning btn-sm mt-2">Add Credit</button>
        //     </div>
        //     <div>
        //       <SlidingCardCarousel />
        //     </div>
        //   </div>

        //   <div className="mt-4">
        //     <h5>Average API Hit</h5>
        //     <div className="bg-light rounded p-4 shadow">
        //       <p>Chart placeholder</p>
        //     </div>
        //   </div>
        //   <div className="mt-4">
        //     <h5>Most Utilized API's</h5>
        //     <div className="bg-light rounded p-4 shadow">
        //       <p>Chart placeholder</p>
        //     </div>
        //   </div>
        // </div>
        <>
          <Nav />

          <div className="wrapper">
            {/* Sidebar  */}
            <Slide />
            {/* Page Content  */}
            <Cont />
          </div>
          <div className="wrapper">{/* Sidebar  */}</div>
        </>
      );
    } else if (view === "apiVerification") {
      return <ApiVerification />;
    }
    return <p>Unknown view!</p>;
  };

  return (
    <div className="bg-white p-4 rounded shadow d-flex" style={{ height: "100%", flexDirection: "row" }}>
      
      {/* Submenu */}
      {submenu.length > 0 && activeComponent === null && (
        <div className="submenu ms-3">
           

            {submenu.map((item) => (
              <li key={item} className="mb-2">
                <button
                  onClick={() => handleSubmenuClick(item)}
                >
                  {item}
                </button>
              </li>
            ))}
        </div>
      )}

      
    </div>
  );
};

export default Dashboard;
