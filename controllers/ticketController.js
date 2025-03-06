const db = require("../db/queries");

const TICKETS_PER_PAGE = 10;

async function getTickets(res, req, page){
    try {
        db.checkDatabase();
        const allTickets = await db.getAllTickets();
        const totalTickets = allTickets.length;
        const totalPages = Math.ceil(totalTickets/TICKETS_PER_PAGE);

        const startIndex = (page-1) * TICKETS_PER_PAGE;
        const endIndex = Math.min(startIndex + TICKETS_PER_PAGE, totalTickets);

        const tickets = allTickets.slice(startIndex, endIndex);

        const bands = [...new Set(allTickets.map(ticket => ticket.band))].sort();
        const venues = [...new Set(allTickets.map(ticket => ticket.venue))].sort();
        res.render('index', { tickets: tickets, bands: bands, locations: venues, currentPage: page, totalPages }); 
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).send('Error fetching tickets');
    }
}

module.exports= {
    getTickets
}