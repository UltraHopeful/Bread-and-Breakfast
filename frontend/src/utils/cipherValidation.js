
export const cipherValidator = (valueType, inputValue) => {
    if (!inputValue) return false;
  
    switch (valueType) {
      case "convertedCipher":
        if(inputValue && inputValue.length > 0)
            return true;

      default:
        return true;
    }
  };
  
  export const cipherValidationMsgs = (valueType, inputValue) => {
    if (!inputValue) {
      return "This field is required";
    }
  };
  