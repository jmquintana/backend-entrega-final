console.log("loaded user.js");
const openModalBtn = document.querySelector(".fa-edit");
const form = document.querySelector(".form");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const openModal = async () => {
	form.classList.remove("hidden");
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	form.classList.remove("transparent");
	modal.classList.remove("transparent");
	overlay.classList.remove("transparent");
	form.classList.remove("animate__fadeOutUp");
	modal.classList.remove("animate__fadeOut");
	overlay.classList.remove("animate__fadeOut");
	form.classList.add("animate__fadeInDown");
	modal.classList.add("animate__fadeIn");
	overlay.classList.add("animate__fadeIn");
};

const closeModal = () => {
	form.classList.add("transparent");
	modal.classList.add("transparent");
	overlay.classList.add("transparent");
	form.classList.add("animate__fadeOutUp");
	modal.classList.add("animate__fadeOut");
	overlay.classList.add("animate__fadeOut");
	form.classList.remove("animate__fadeInDown");
	modal.classList.remove("animate__fadeIn");
	overlay.classList.remove("animate__fadeIn");
};

openModalBtn?.addEventListener("click", openModal);
