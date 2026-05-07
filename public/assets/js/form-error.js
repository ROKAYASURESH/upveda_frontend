document.querySelectorAll(".invalid-feedback").forEach((element) => {
  let prevSibling = element.previousElementSibling;

  if (prevSibling) {
    prevSibling.classList.add("is-invalid");
  }
});
