
export const questionValidator = (valueType, inputValue) => {
    if (!inputValue) return false;
  
    switch (valueType) {
      case "q1":
        if(inputValue && inputValue.length > 0)
            return true;
  
      case "q2":
        if(inputValue  && inputValue.length > 0)
            return true;
        
      case "q3":
        if(inputValue  && inputValue.length > 0)
            return true;
  
      default:
        return true;
    }
  };
  
  export const questionValidationMsgs = (valueType, inputValue) => {
    if (!inputValue) {
      return "This field is required";
    }
  };
  