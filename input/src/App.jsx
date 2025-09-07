import React, { useState } from "react";

import "./assets/style.css";

import Input from "./components/common/input";
import useInput from "./customHooks/useInput";

function App() {
  const myEmail = useInput("");
  const myPass = useInput("");
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passIsValid, setPassIsValid] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (myPass.value.length < 8) {
      setPassIsValid(false);
    }else{
      setPassIsValid(true)
    }
    const emailPattern = /\S+@\S+\.\S+/;
    const isEmailValid = emailPattern.test(myEmail.value);
    setEmailIsValid(isEmailValid);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            value={myEmail.value}
            onChange={myEmail.onChange}
            className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          {emailIsValid ? null : (
            <p className="text-red-500 text-sm mb-2">
              Please enter a valid email address.
            </p>
          )}

          <Input
            placeholder="Password"
            value={myPass.value}
            onChange={myPass.onChange}
            className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          {passIsValid ? null : (
            <p className="text-red-500 text-sm mb-2">
              Password must be at least 8 characters long.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
