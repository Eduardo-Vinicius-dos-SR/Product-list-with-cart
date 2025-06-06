const btnAddInitial = `<p><img src="./src/assets/images/icon-add-to-cart.svg" alt="add cart icon" /> Add to Cart</p>`;

function formatDessertList() {
	fetch("./src/json/data.json")
		.then((response) => {
			if (!response.ok) throw new Error("Erro ao carregar o arquivo JSON");

			return response.json();
		})
		.then((desserts) => {
			desserts.forEach((dessert) => {
				const dessertList = document.getElementById("desserts-list");

				const dessertItem = document.createElement("li");
				dessertItem.classList.add("dessert");

				dessertItem.innerHTML = `
		<div class="dessert-template">
			<picture>
				<source media="(min-width: 1440px)" srcset="${dessert.image.desktop}" />
				<source media="(min-width: 768px)" srcset="${dessert.image.tablet}" />
				<img src="${dessert.image.mobile}" alt="${dessert.name}" />
			</picture>
			<button class="btn-add-cart">
				${btnAddInitial}
			</button>
		</div>
		<div class="informations">
			<p class="category">${dessert.category}</p>
			<h2 class="name">${dessert.name}</h2>
			<h2 class="price">${locatePrice(dessert.price)}</h2>
		</div>
	`;

				dessertList.appendChild(dessertItem);

				const btnAddCart = dessertItem.querySelector(".btn-add-cart");
				const btnAddOrdered = `<a href="#" class="decrement">
			<img src="./src/assets/images/icon-decrement-quantity.svg" alt="decrement button">
		</a>
		<p class="count" id="count">1</p>
		<a href="#" class="increment">
			<img src="./src/assets/images/icon-increment-quantity.svg" alt="increment button">
		</a>`;
				btnAddCart.addEventListener("click", () => {
					const dessert = btnAddCart.closest(".dessert");

					if (!dessert.classList.contains("ordered")) {
						btnAddCart.innerHTML = btnAddOrdered;

						dessert.classList.add("ordered");

						const countElement = btnAddCart.querySelector("#count");
						const decrementBtn = btnAddCart.querySelector(".decrement");
						const incrementBtn = btnAddCart.querySelector(".increment");

						decrementBtn.addEventListener("click", (e) => {
							e.preventDefault();
							e.stopPropagation();

							let count = parseInt(countElement.textContent);
							if (count > 1) {
								countElement.textContent = count - 1;
							} else if (count === 1) {
								dessert.classList.remove("ordered");
								btnAddCart.innerHTML = btnAddInitial;
							}
							cartItems();
						});

						incrementBtn.addEventListener("click", (e) => {
							e.preventDefault();
							e.stopPropagation();

							let count = parseInt(countElement.textContent);
							countElement.textContent = count + 1;
							cartItems();
						});
						cartItems();
					}
				});
			});
		});
}

const cart = document.getElementById("cart");
const cartList = cart.querySelector("#cart-list");

function cartItems() {
	cartList.innerHTML = ``;
	const desserts = Array.from(document.querySelectorAll("#desserts-list .dessert"));

	let quantityOrdered = 0;
	let allPrice = 0;

	const dessertsOrdered = desserts.filter((dessert) => dessert.classList.contains("ordered"));

	if (dessertsOrdered.length === 0) {
		document.getElementById("cart-title").textContent = `Your Cart (0)`;
		cart.classList.add("empty");
		return;
	}

	dessertsOrdered.forEach((dessert) => {
		const dessertPrice = dessert.querySelector(".informations .price");

		const countValue = Number(dessert.querySelector("#count").textContent);

		const priceNumber = parseFloat(dessertPrice.textContent.replace("$", ""));
		const allOrderPrice = priceNumber * countValue;

		allPrice += allOrderPrice;

		const dessertLog = `<div class="order">
			<h2>${dessert.querySelector(".name").textContent}</h2>
		<div class="informations">
			<p class="quantity" id="quantity">${countValue}x</p>
			<p class="single-price" id="single-price">@ ${dessert.querySelector(".informations .price").textContent}</p>
			<p class="all-price" id="all-price">${locatePrice(allOrderPrice)}</p>
		</div>
		<a href="#" class="remove-icon"><img src="./src/assets/images/icon-remove-item.svg" alt="remove icon"></a>
			</div>`;
		const dessertOrder = document.createElement("li");
		dessertOrder.innerHTML = dessertLog;

		quantityOrdered += countValue;

		cart.classList.remove("empty");
		cartList.appendChild(dessertOrder);

		dessertOrder.querySelector(".remove-icon").addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

			dessert.classList.remove("ordered");

			const btnAddCart = dessert.querySelector(".btn-add-cart");
			btnAddCart.innerHTML = btnAddInitial;

			cartList.removeChild(dessertOrder);

			cartItems();
		});
	});

	document.getElementById("cart-title").textContent = `Your Cart (${quantityOrdered})`;

	const orderTotal = document.createElement("li");
	orderTotal.classList.add("order-total");

	const orderTotalPrice = document.createElement("div");
	orderTotalPrice.classList.add("total-price");

	orderTotalPrice.innerHTML = `
    <p>Order Total</p>
    <h2>${locatePrice(allPrice)}</h2>`;

	const confirmedTotalPrice = document.createElement("div");
	confirmedTotalPrice.classList.add("total-price");
	confirmedTotalPrice.innerHTML = orderTotalPrice.innerHTML;

	const carbonNeutral = document.createElement("div");
	carbonNeutral.classList.add("carbon-neutral");

	carbonNeutral.innerHTML = `
  <p>
    <img src="./src/assets/images/icon-carbon-neutral.svg" alt="carbon neutral icon">
    This is a&nbsp;<strong>carbon-neutral</strong>&nbsp;delivery
  </p>`;

	const confirmButton = document.createElement("button");
	confirmButton.classList.add("confirm-button");

	confirmButton.textContent = "Confirm Order";

	orderTotal.append(orderTotalPrice, carbonNeutral, confirmButton);
	cartList.appendChild(orderTotal);

	document.querySelector(".confirm-button").addEventListener("click", () => {
		const existingOrder = document.querySelector(".confirmed-order");
		if (existingOrder) {
			existingOrder.remove();
		}

		const dessertsConfirmed = Array.from(cartList.querySelectorAll("li .order"));

		const confirmedOrder = document.createElement("section");
		confirmedOrder.classList.add("confirmed-order");

		const orderList = document.createElement("ul");
		orderList.classList.add("order-list");

		orderList.innerHTML = dessertsConfirmed
			.map((dessertConfirmed) => {
				const dessertName = dessertConfirmed.querySelector("h2").textContent;

				const originalDessert = Array.from(document.querySelectorAll("#desserts-list .dessert")).find(
					(item) => item.querySelector(".name").textContent === dessertName
				);

				const imageSrc = originalDessert.querySelector("picture img").getAttribute("src");
				const imageAlt = originalDessert.querySelector("picture img").getAttribute("alt");

				const quantity = dessertConfirmed.querySelector("#quantity").textContent;
				const singlePrice = dessertConfirmed.querySelector("#single-price").textContent;
				const allPrice = dessertConfirmed.querySelector("#all-price").textContent;

				return `
      <li class="order">
        <img src="${imageSrc}" alt="${imageAlt}" />
        <div class="informations">
          <h2>${dessertName}</h2>
          <div>
            <p class="quantity" id="order-quantity">${quantity}</p>
            <p class="single-price" id="single-order-price">${singlePrice}</p>
          </div>
        </div>
        <p class="all-price" id="all-order-price">${allPrice}</p>
      </li></ul>
    `;
			})
			.join("");

		const confirmationIcon = document.createElement("img");
		confirmationIcon.classList.add("confirmation-icon");
		confirmationIcon.src = "./src/assets/images/icon-order-confirmed.svg";
		confirmationIcon.alt = "Confirmation Icon";

		const title = document.createElement("h1");
		title.textContent = "Order Confirmed";

		const text = document.createElement("p");
		text.classList.add("text");
		text.textContent = "We hope you enjoy your food";

		const startOrderButton = document.createElement("button");
		startOrderButton.classList.add("confirm-button");
		startOrderButton.textContent = "Start New Order";

		confirmedOrder.append(confirmationIcon, title, text, orderList, confirmedTotalPrice, startOrderButton);

		const overlay = document.createElement("div");
		overlay.classList.add("overlay");
		overlay.appendChild(confirmedOrder);

		window.scrollTo({ top: 0, behavior: "smooth" });
		document.body.appendChild(overlay);
		document.body.classList.add("confirmed");

		startOrderButton.addEventListener("click", () => {
			const overlay = document.querySelector(".overlay");
			if (overlay) overlay.remove();

			const orderedDesserts = document.querySelectorAll(".dessert.ordered");
			orderedDesserts.forEach((dessert) => {
				dessert.classList.remove("ordered");
				const btnAddCart = dessert.querySelector(".btn-add-cart");
				btnAddCart.innerHTML = btnAddInitial;
			});

			cartItems();
			document.body.classList.remove("confirmed");
		});
	});
}

function locatePrice(price) {
	return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

formatDessertList();
