// Assuming you fetch ticket data from an API endpoint
document.addEventListener('DOMContentLoaded', async () => {
    const tickets = await fetchTickets();
    const bands = new Set();
    const locations = new Set();
    const souvenirs = new Set();

    // Populate tickets in chronological order
    const ticketList = document.getElementById('ticket-list');
    tickets.sort((a, b) => new Date(a.date) - new Date(b.date));
    tickets.forEach(ticket => {
        ticketList.appendChild(createTicketElement(ticket));

        // Collect bands, locations, and souvenirs for the sidebar filters
        bands.add(ticket.band.name);
        locations.add(ticket.venue.location);
        souvenirs.add(ticket.souvenir);
    });

    populateFilter('bands-list', [...bands]);
    populateFilter('locations-list', [...locations]);
    populateFilter('souvenirs-list', [...souvenirs]);

    // Search functionality
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredTickets = tickets.filter(ticket =>
            ticket.band.name.toLowerCase().includes(query) ||
            ticket.venue.name.toLowerCase().includes(query) ||
            ticket.souvenir.toLowerCase().includes(query)
        );
        ticketList.innerHTML = ''; // Clear the current list
        filteredTickets.forEach(ticket => ticketList.appendChild(createTicketElement(ticket)));
    });
});

function createTicketElement(ticket) {
    const ticketDiv = document.createElement('div');
    ticketDiv.classList.add('ticket');

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('ticket-details');
    detailsDiv.innerHTML = `
        <h2>${ticket.band.name}</h2>
        <h3>${ticket.venue.name} - ${ticket.venue.location}</h3>
        <p>Date: ${new Date(ticket.date).toLocaleDateString()}</p>
        <p>Souvenir: ${ticket.souvenir}</p>
        <p>Band Members: ${ticket.band.members.join(', ')}</p>
    `;

    const imagesDiv = document.createElement('div');
    imagesDiv.classList.add('ticket-images');
    ticket.images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        imagesDiv.appendChild(img);
    });

    ticketDiv.appendChild(detailsDiv);
    ticketDiv.appendChild(imagesDiv);
    
    return ticketDiv;
}

function populateFilter(elementId, items) {
    const listElement = document.getElementById(elementId);
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        listElement.appendChild(listItem);
    });
}

async function fetchTickets() {
    // Replace with your actual API endpoint to get the tickets from the database
    return await fetch('/api/tickets').then(response => response.json());
}
