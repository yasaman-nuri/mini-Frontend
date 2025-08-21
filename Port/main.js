document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    const editIcon = box.querySelector(".edit-icon");
    const portNumber = box.querySelector(".port-number");

    editIcon.addEventListener("click", () => {
      // اگه قبلا input ایجاد شده باشه دوباره ایجاد نشه
      if (box.querySelector(".edit-input")) return;

      // پنهان کردن مقدار قبلی
      portNumber.style.display = "none";

      // ایجاد input
      const input = document.createElement("input");
      input.type = "number";
      input.value = portNumber.textContent.trim();
      input.classList.add("edit-input");

      // ایجاد دکمه ثبت
      const saveButton = document.createElement("button");
      saveButton.textContent = "ثبت";
      saveButton.classList.add("save-button");

      // اضافه کردن input و دکمه به box
      box.appendChild(input);
      box.appendChild(saveButton);

      // رویداد کلیک روی ثبت
      saveButton.addEventListener("click", () => {
        portNumber.textContent = input.value.trim() || portNumber.textContent;
        portNumber.style.display = "inline";

        // پاک کردن input و دکمه
        input.remove();
        saveButton.remove();
      });
    });
  });
});