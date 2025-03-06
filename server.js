const express = require('express');
const path = require('path');  // Helps with file paths

const app = express();
const port = 4000;

// controllers
const ticketController = require ('./controllers/ticketController.js');

// Serve static files (e.g., HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');



// API endpoint to get tickets
app.get('/api/tickets', (req, res) => {
    console.log('get tickets');
    const tickets = ticketController.getTickets();
    res.json(tickets);
});

// Handle root route and serve index.html
app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    ticketController.getTickets(res, req, page);
    
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
