const inputs = document.querySelectorAll("input");

inputs.forEach((input, index) => {
  // وقتی کاربر چیزی تایپ می‌کنه
  input.addEventListener("input", () => {
    const maxLength = input.getAttribute("maxlength");
    if (input.value.length >= maxLength) {
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  });

  // وقتی کاربر دکمه‌ای رو فشار می‌ده
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value.length === 0) {
      const prevInput = inputs[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  });
});