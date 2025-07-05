const form = document.querySelector("#updateAccount")
    form.addEventListener("change", function () {
      const updateBtn = form.querySelector("input[type='submit']");
      updateBtn.removeAttribute("disabled")
    })

const passForm = document.querySelector("#updatePassword")
    passForm.addEventListener("change", function () {
      const updateBtn = passForm.querySelector("input[type='submit']");
      updateBtn.removeAttribute("disabled")
    })