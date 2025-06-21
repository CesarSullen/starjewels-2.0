document.addEventListener("DOMContentLoaded", () => {
	const renderProductList = (products, filterDiscount = false) => {
		const productContainer = document.getElementById("product-list-container");
		if (!productContainer) return;

		const filteredProducts = filterDiscount
			? products.filter((product) => product.discountPrice)
			: products;

		productContainer.innerHTML = filteredProducts
			.map(
				(product) => `
            <a href="./product-detail.html?id=${
							product.id
						}" class="product-card card${
					product.discountPrice ? " has-discount" : ""
				}" style="background-image: url('${product.image}')">
              <div class="preview-images-container">
                ${product.images
									.slice(0, 2)
									.map(
										(img) => `
                  <img src="${img.src}" alt="${img.alt}" class="preview-image">
                `
									)
									.join("")}
              </div>
              <div class="product-footer">
                <div class="product-footer-info">
                  <h3 class="product-name">${product.name}</h3>
                  <div class="price-container">
                    <p class="product-price${
											product.discountPrice ? " original-price" : ""
										}">
                      $${product.price.toFixed(2)}
                    </p>
                    ${
											product.discountPrice
												? `<p class="product-price discount-price">$${product.discountPrice.toFixed(
														2
												  )}</p>`
												: ""
										}
                  </div>
                </div>
              </div>
            </a>
          `
			)
			.join("");
	};

	// Function to load and render the product detail on product-detail.html
	const renderProductDetail = (products) => {
		const productContainer = document.querySelector(
			".product-detail-container"
		);
		const sectionTitle = document.querySelector(".section-title");
		if (!productContainer || !sectionTitle) return;

		const urlParams = new URLSearchParams(window.location.search);
		const productId = parseInt(urlParams.get("id"));
		const product = products.find((p) => p.id === productId);

		if (!product) {
			sectionTitle.textContent = "Producto no encontrado";
			productContainer.innerHTML = `<p>El producto no existe.</p>`;
			return;
		}

		sectionTitle.textContent = product.name;

		productContainer.innerHTML = `
          <div class="product-detail-carousel${
						product.discountPrice ? " has-discount" : ""
					}">
            ${product.images
							.map(
								(img, index) => `
              <img src="${img.src}" alt="${
									img.alt
								}" class="product-detail-image ${index === 0 ? "active" : ""}">
            `
							)
							.join("")}
            <button class="carousel-btn prev">❮</button>
            <button class="carousel-btn next">❯</button>
          </div>
          <div class="product-detail-info">
            <p class="product-detail-price">
              ${
								product.discountPrice
									? `<span class="original-price">$${product.price.toFixed(
											2
									  )}</span>
                         <span class="discount-price">$${product.discountPrice.toFixed(
														2
													)}</span>`
									: `$${product.price.toFixed(2)}`
							}
            </p>
            <div class="product-detail-texts">
              ${product.details
								.map((detail) => `<p class="product-detail-text">${detail}</p>`)
								.join("")}
            </div>
            <a href="../docs/how-to.pdf">
              <button class="btn ghost-btn">¿Cómo cuidar tus joyas?</button>
            </a>
            <a href="../docs/warranty.html">
              <button class="btn ghost-btn">garantía</button>
            </a>
            <a href="${product.src}">
              <button class="btn ghost-btn">Comprar</button>
            </a>
          </div>
        `;

		// Add carousel functionality
		const images = productContainer.querySelectorAll(".product-detail-image");
		const prevButton = productContainer.querySelector(".prev");
		const nextButton = productContainer.querySelector(".next");
		let currentIndex = 0;

		if (nextButton && images.length > 0) {
			nextButton.addEventListener("click", () => {
				images[currentIndex].classList.remove("active");
				currentIndex = (currentIndex + 1) % images.length;
				images[currentIndex].classList.add("active");
			});
		}

		if (prevButton && images.length > 0) {
			prevButton.addEventListener("click", () => {
				images[currentIndex].classList.remove("active");
				currentIndex = (currentIndex - 1 + images.length) % images.length;
				images[currentIndex].classList.add("active");
			});
		}
	};

	// Fetch products from JSON and render based on the current page
	fetch("../data/products.json")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to load products");
			}
			return response.json();
		})
		.then((products) => {
			if (document.getElementById("product-list-container")) {
				if (window.location.pathname.includes("limited-offers.html")) {
					renderProductList(products, true);
				} else {
					renderProductList(products);
				}
			} else if (document.querySelector(".product-detail-container")) {
				renderProductDetail(products);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			const productContainer =
				document.getElementById("product-list-container") ||
				document.querySelector(".product-detail-container");
			const sectionTitle = document.querySelector(".section-title");
			if (productContainer && sectionTitle) {
				sectionTitle.textContent = "Error";
				productContainer.innerHTML = `<p>Failed to load products. Please try again.</p>`;
			}
		});
});
