console.log("loaded user.js");
const openModalButtons = document.querySelectorAll(".fa-edit");
const form = document.querySelector(".form");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const editRoleButton = document.querySelector(".edit-role-btn");
const roleSelector = document.querySelector("#role");
const saveButton = document.querySelector(".btn.submit");

let globalRole = null;

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
	saveButton.classList.add("disabled");
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
		globalRole = e.target.parentNode.innerText.replace(/\s/g, "");
		roleSelector.value = globalRole;
		// get user id from 4*parentNode
		let id = e.target.parentNode.parentNode.parentNode.parentNode.id;
		form.id = id;
		openModal();
	})
);

overlay.addEventListener("click", closeModal);
editRoleButton.addEventListener("click", closeModal);

const handleEdit = async (e) => {
	e.preventDefault();
	e.stopPropagation();
	const myFormData = new FormData(e.target);
	const role = myFormData.get("role");
	const id = form.id;
	const resp = await fetch(`/api/users/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ role }),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await resp.json();
	if (data.ok) {
		closeModal();
		showAlert(data.message, "success");
		setTimeout(() => {
			location.reload();
		}, 1500);
	} else {
		showAlert(data.message, "error");
	}
};

form.addEventListener("submit", handleEdit);

// onchange event of roleSelector if selected is not globalRole
// toggle "disabled" class of saveButton
roleSelector.addEventListener("change", (e) => {
	if (e.target.value !== globalRole) {
		saveButton.classList.remove("disabled");
	} else {
		saveButton.classList.add("disabled");
	}
});
