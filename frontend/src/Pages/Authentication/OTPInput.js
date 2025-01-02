import React, { useState, useEffect, useContext } from "react";
import { useRecoveryContext } from "../Authentication/RecoveryContext";  // Corrected import
import axios from "axios"; // Ensure axios is imported

export default function OTPVerification() {
  const { email, otp, setPage } = useRecoveryContext();  // Using the custom hook
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);

  // Resend OTP function
  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => {
        setDisable(true);
        alert("A new OTP has been successfully sent to your email.");
        setTimer(60); // Reset timer after OTP is resent
      })
      .catch(console.log);
  }

  // Verify OTP function
  function verifyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      setPage("reset");
      return;
    }
    alert("The code you have entered is not correct. Try again or re-send the link.");
  }

  // Timer countdown effect
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false); // Enable resend OTP button after timer ends
        }
        return lastTimerCount > 0 ? lastTimerCount - 1 : lastTimerCount;
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [disable]);

  // Handle OTP input change
  const handleOTPChange = (e, index) => {
    const newOTP = [...OTPinput];
    newOTP[index] = e.target.value;
    setOTPinput(newOTP);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {OTPinput.map((digit, index) => (
                    <div key={index} className="w-16 h-16">
                      <input
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        value={digit}
                        onChange={(e) => handleOTPChange(e, index)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't receive the code?</p>
                    <button
                      type="button"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={resendOTP}
                      disabled={disable}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
