import { useState, useReducer } from "react";

const initalInputState = {
    value: "",
    isTouched: false
}

const inputStateReducer = (prevState, action) => {
    if (action.type === "INPUT") {
        return { value: action.value, isTouched: prevState.isTouched }
    }
    if (action.type === "BLUR") {
        return { isTouched: true, value: prevState.value }
    }
    if (action.type === "RESET") {
        return { isTouched: false, value: "" }
    }

    return initalInputState
}

const useInput = (validateValueFn) => {

    const [inputState, dispatch] = useReducer(inputStateReducer, initalInputState)

    // const [enteredValue, setEnteredValue] = useState("")
    // const [isTouched, setIsTouched] = useState(false)

    const valueIsvalid = validateValueFn(inputState.value);
    const hasError = !valueIsvalid && inputState.isTouched

    const valueChangeHandler = (event) => {
        dispatch({ type: 'INPUT', value: event.target.value })
    }

    const InputBlurHandler = (event) => {
        dispatch({ type: 'BLUR' })
    }

    const reset = () => {
        dispatch({ type: "RESET" })
    }

    return {
        value: inputState.value,
        isValid: valueIsvalid,
        hasError,
        valueChangeHandler,
        InputBlurHandler,
        reset
    }
}

export default useInput;