const textContent = document.querySelector(".text_content");
const createNew = document.querySelector(".create_new");
const redirect = document.querySelector(".redirect");
const modal = document.querySelector(".create_modal");

textContent.defaultValue = textContent.dataset.update;

createNew.addEventListener("click", () => {
	window.location.replace("/generate");
});

redirect.addEventListener("click", () => {
	window.location.replace("/all-information");
});
