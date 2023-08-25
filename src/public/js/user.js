console.log("loaded user.js");
const openModalButtons = document.querySelectorAll(".fa-edit");
const form = document.querySelector(".form");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const editRoleButton = document.querySelector(".edit-role-btn");
const roleSelector = document.querySelector("#role");
const saveButton = document.querySelector(".btn.submit");
const logOutBtn = document.querySelector(".profile-logout");
const deleteUserButtons = document.querySelectorAll(".delete-btn");

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
	try {
		await fetch(`/api/users/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ role }),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.ok) {
					closeModal();
					showAlert(data.message, "success");
					setTimeout(() => {
						location.reload();
					}, 1500);
				} else {
					showAlert(data.message, "error");
				}
			});
	} catch (error) {
		console.error(error);
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

logOutBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	const email = logOutBtn.id;
	console.log(email);
	try {
		await fetch("/api/users/logout", {
			method: "POST",
			body: JSON.stringify({ username: email }),
			header: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status === 200) {
				window.location.href = "/login";
			} else {
				const error = new Error(res.error);
				throw error;
			}
		});
	} catch (error) {
		console.error(error);
	}
});

deleteUserButtons.forEach((btn) =>
	btn.addEventListener("click", async (e) => {
		e.preventDefault();
		const id = btn.id;
		try {
			await fetch(`/api/users/${id}`, {
				method: "DELETE",
				header: {
					"Content-Type": "application/json",
				},
			}).then((res) => {
				if (res.ok) {
					showAlert(res.message, "success");
					setTimeout(() => {
						location.reload();
					}, 1500);
				} else {
					const error = new Error(res.error);
					throw error;
				}
			});
		} catch (error) {
			console.error(error);
		}
	})
);
