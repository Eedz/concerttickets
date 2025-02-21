const express = require('express');
const path = require('path');  // Helps with file paths

const app = express();
const port = 4000;

// controllers
const ticketController = require ('./controllers/ticketReaderExcel.js');

// Serve static files (e.g., HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');



// API endpoint to get tickets
app.get('/api/tickets', (req, res) => {
    console.log('get tickets');
    const tickets = ticketController.getTickets(); // Read data from Excel
    res.json(tickets);
});

// Handle root route and serve index.html
app.get('/', (req, res) => {
    const tickets = ticketController.getTickets(); // Read data from Excel
    const bands = [...new Set(tickets.map(ticket => ticket.band.name))].sort();
    const venues = [...new Set(tickets.map(ticket => ticket.venue.name))].sort();
    res.render('index.ejs', { tickets: tickets, bands: bands, locations: venues });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
