// Nav Bar Toggle
let toggleBtn = document.getElementById("toggle-btn");
let body = document.getElementById("body");
let links = document.querySelectorAll(".side-bar-link");
let sideBar = document.getElementById("side-bar");

toggleBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
	toggleBtn.classList.toggle("toggled");

	if (
		sideBar.style.transform === "translateX(-200%)" ||
		sideBar.style.transform === ""
	) {
		sideBar.style.transform = "translateX(0px)";
		body.style.overflowY = "hidden";
	} else {
		sideBar.style.transform = "translateX(-200%)";
		body.style.overflowY = "auto";
	}
}

links.forEach((link) =>
	link.addEventListener("click", () => {
		sideBar.style.transform = "translateX(-200%)";
		body.style.overflowY = "auto";
		toggleBtn.classList.toggle("toggled");
	})
);

// Interception Observer
const sections = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle("show", entry.isIntersecting);
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 0.1,
	}
);

sections.forEach((section) => {
	observer.observe(section);
});

// Request Form
document
	.getElementById("surveyForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const jewelryType = document.getElementById("jewelryType").value;
		const budget = document.getElementById("budget").value;
		const purchasePlace = document.getElementById("purchasePlace").value;

		const factors = Array.from(
			document.querySelectorAll('input[name="factors"]:checked')
		).map((input) => input.value);
		if (factors.length === 0) {
			alert("Por favor, seleccione al menos un factor.");
			return;
		}

		const message = `
Encuesta sobre joyería de plata:

¿Qué tipo de joyería de plata prefieres (anillos, collares, pulseras, etc.)?
${jewelryType}

¿Cuánto estarías dispuesto/a a pagar por una pieza de plata? (Entre 1 y 14 USD)
${budget}

¿Qué factores influyen más en tu decisión de compra? (Selecciona todos los que apliquen)
${factors.join(", ")}

¿Dónde sueles comprar joyería de plata?
${purchasePlace}
	`.trim();

		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/+5352383992?text=${encodedMessage}`;

		window.location.href = whatsappUrl;
	});
