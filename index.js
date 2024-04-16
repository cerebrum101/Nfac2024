document.addEventListener('DOMContentLoaded', function () {
	const dogCardsContainer = document.getElementById('dog-cards-container');
	const prevLink = document.querySelector('.pagination a.page-link:first-of-type');
	const nextLink = document.querySelector('.pagination a.page-link:last-of-type');
	const searchInput = document.getElementById('breed-search');
	let currentPage = 1;
	let breeds = [];
	let filteredBreeds = [];
	let pageSize = 12; // number of cards per page


	// Fetches the complete list of breeds
	async function fetchBreeds() {
		const response = await fetch('https://dog.ceo/api/breeds/list/all');
		const data = await response.json();
		return data.message;
	}

	async function fetchFirstImage(breed) {
		const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
		const data = await response.json();
		return data.message[0];
	}

	async function displayBreeds(page) {
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const pageBreeds = filteredBreeds.slice(startIndex, endIndex);

		dogCardsContainer.innerHTML = '';
		for (let breed of pageBreeds) {
			const imageUrl = await fetchFirstImage(breed);
			const card = document.createElement('div');
			card.className = 'catalog-item';
			card.id = `${breed}`;
			card.innerHTML = `<h2>${breed}</h2><img src="${imageUrl}" alt="Image of ${breed}">`;  

			card.addEventListener('click', function () {
				const searchQuery = `buy ${breed}`;
				const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)} dog`; // google search of a breed
				window.location.href = googleUrl;
			});

			dogCardsContainer.appendChild(card);
		}
		updatePagination(); 
	}

	// Updates the pagination visibility and labels

	function updatePagination() {
		prevLink.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
		nextLink.style.visibility = currentPage * pageSize >= filteredBreeds.length ? 'hidden' : 'visible';
		prevLink.textContent = `Prev (Page ${currentPage - 1})`;
		nextLink.textContent = `Next (Page ${currentPage + 1})`;
	}

	// Pagination handlers

	prevLink.addEventListener('click', function (event) {
		event.preventDefault();
		if (currentPage > 1) {
			currentPage--;
			displayBreeds(currentPage);
		}
	});

	nextLink.addEventListener('click', function (event) {
		event.preventDefault();
		if (currentPage * pageSize < filteredBreeds.length) {
			currentPage++;
			displayBreeds(currentPage);
		}
	});

	// Search filters for input box 

	searchInput.addEventListener('input', function () {
		const query = searchInput.value.toLowerCase();
		filteredBreeds = breeds.filter(breed => breed.toLowerCase().includes(query));
		currentPage = 1; // resets to first page
		displayBreeds(currentPage);
	});

	// Initial fetch 

	fetchBreeds().then(breedsData => {
		for (let breed in breedsData) {
			breeds.push(breed);
		}
		filteredBreeds = breeds;
		displayBreeds(currentPage);
	});
});
