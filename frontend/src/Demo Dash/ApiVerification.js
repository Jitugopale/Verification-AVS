import React, { useState } from "react";
import Pan from "../Pages/Verification/PancardVerificationPage"; // Import the Pan component
import Aadhaar from "../Pages/Verification/PancardVerificationPage"; // Import the Aadhaar component

const ApiVerification = () => {
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

export default ApiVerification;
