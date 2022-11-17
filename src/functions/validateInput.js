  
  const validateInput = function(input, regex) {
    this.forceUpdate();//musimy wymusić, inaczej nie zawsze zweryfikuje
    if (regex.test(input.value)) {
      input.classList.add("is-valid")
      input.classList.remove("is-invalid")
      return true;
    }
    else {
      input.classList.add("is-invalid")
      input.classList.remove("is-valid")
      return false;
    }
  }

  export default validateInput;