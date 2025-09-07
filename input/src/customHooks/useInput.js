import { useState } from "react";
const useInput = (initialValue) => {
  const [myInput, setMyinput] = useState(initialValue);
  const handleOnChange = (e) => {
    setMyinput(e.target.value);
  };

  return {
    value: myInput,
    onChange: handleOnChange,
  };
};

export default useInput;
