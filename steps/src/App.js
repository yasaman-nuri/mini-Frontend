import { useReducer } from "react";
import "./App.css";

function reducer(state, action) {
  switch (action.type) {
    case "next": {
      return { ...state, step: state.step + 1 }; //step: Math.min(state.step + 1, state.totalSteps - 1)
    }
    case "prev": {
      return { ...state, step: state.step - 1 }; //step: Math.max(state.step - 1, 0)
    }
    default:
      return state;
  }
}
function App() {
  const totalSteps = 4;
  const [state, dispatch] = useReducer(reducer, {
    step: 0,
  });
  return (
    <div className="container">
      <div className="pages">
        {/* [...Array(4)] // [undefined, undefined, undefined, undefined] */}
        {/* [0, 1, 2, 3].map((index) => <div>{index + 1}</div>) */}
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            style={{
              borderColor: state.step >= index ? "rgb(70, 92, 216)" : "gray",
              color: state.step >= index ? "rgb(70, 92, 216)" : "gray",
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className="btns">
        <button
          data-testid="prevBtn"
          className="prevBtn"
          onClick={() => dispatch({ type: "prev" })}
          disabled={state.step === 0}
          style={{
            backgroundColor: state.step === 0 ? "gray" : "rgb(70, 92, 216)",
            cursor: state.step === 0 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>
        <button
          data-testid="nextBtn"
          onClick={() => dispatch({ type: "next" })}
          disabled={state.step === totalSteps - 1}
          style={{
            backgroundColor:
              state.step === totalSteps - 1 ? "gray" : "rgb(70, 92, 216)",
            cursor: state.step === totalSteps - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
