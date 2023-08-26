console.log("loaded register.js");

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	const obj = {};
	formData.forEach((value, key) => (obj[key] = value));
	console.log(obj);

	try {
		await fetch("/api/users/register", {
			method: "POST",
			body: JSON.stringify(obj),
			header: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.ok) {
					showAlert(data.message, "success");
					setTimeout(() => {
						location.href = "/login";
					}, 1500);
				} else {
					showAlert(data.message, "error");
				}
			});
	} catch (error) {
		console.error(error);
	}
});
