console.log("loaded user.js");
const openModalButtons = document.querySelectorAll(".fa-edit");
const form = document.querySelector(".form");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const editRoleButton = document.querySelector(".edit-role-btn");
const roleSelector = document.querySelector("#role");

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

openModalButtons.forEach((btn) =>
	btn.addEventListener("click", async (e) => {
		let role = e.target.parentNode.innerText.replace(/\s/g, "");
		roleSelector.value = role;
		// get user id from 4*parentNode
		let id = e.target.parentNode.parentNode.parentNode.parentNode.id;
		form.id = id;
		openModal();
	})
);

overlay.addEventListener("click", closeModal);
editRoleButton.addEventListener("click", closeModal);

// fetch patch "api/user/:id" the role
// if success, close modal
// if error, show alert

const handleEdit = async (e) => {
	e.preventDefault();
	e.stopPropagation();
	const myFormData = new FormData(e.target);
	const role = myFormData.get("role");
	const id = form.id;
	const resp = await fetch(`/api/user/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ role }),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await resp.json();
	if (data.ok) {
		showAlert(data.message, "success");
		closeModal();
	} else {
		showAlert(data.message, "error");
	}
};

form.addEventListener("submit", handleEdit);
