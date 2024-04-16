document.addEventListener('DOMContentLoaded', function () {
	const dogCardsContainer = document.getElementById('dog-cards-container');
	const prevLink = document.querySelector('.pagination a.page-link:first-of-type');
	const nextLink = document.querySelector('.pagination a.page-link:last-of-type');
	let currentPage = 1;
	let breeds = [];
	let pageSize = 12; // Adjust this number based on how many items you want per page

	// Function to fetch all dog breeds from the API
	async function fetchBreeds() {
		const response = await fetch('https://dog.ceo/api/breeds/list/all');
		const data = await response.json();
		return data.message;
	}

	// Function to fetch the first image of a given breed or sub-breed
	async function fetchFirstImage(breed) {
		const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
		const data = await response.json();
		return data.message[0]; // Returning the first image
	}

	// Display the breeds on the current page
	async function displayBreeds(page) {
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const pageBreeds = breeds.slice(startIndex, endIndex);

		dogCardsContainer.innerHTML = ''; // Clear the container
		for (let breed of pageBreeds) {
			const imageUrl = await fetchFirstImage(breed);
			const card = document.createElement('div');
			card.className = 'catalog-item';
			card.id = `${breed}`
			card.innerHTML = `<h2>${breed}</h2><img src="${imageUrl}" alt="Image of ${breed}">`;
			dogCardsContainer.appendChild(card);
		}
		updatePagination();
	}

	// Update pagination links
	function updatePagination() {
		prevLink.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
		nextLink.style.visibility = currentPage * pageSize >= breeds.length ? 'hidden' : 'visible';
		prevLink.textContent = `Prev (Page ${currentPage - 1})`;
		nextLink.textContent = `Next (Page ${currentPage + 1})`;
	}

	// Pagination control
	prevLink.addEventListener('click', function (event) {
		event.preventDefault();
		if (currentPage > 1) {
			currentPage--;
			displayBreeds(currentPage);
		}
	});

	nextLink.addEventListener('click', function (event) {
		event.preventDefault();
		if (currentPage * pageSize < breeds.length) {
			currentPage++;
			displayBreeds(currentPage);
		}
	});

	// Initialize the catalog
	fetchBreeds().then(breedsData => {
		for (let breed in breedsData) {
			breeds.push(breed); // Store only the main breed, not sub-breeds
		}
		displayBreeds(currentPage);
	});
});
