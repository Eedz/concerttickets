const express = require('express');
const path = require('path');  // Helps with file paths
const xlsx = require('xlsx'); // Import xlsx to read Excel files

const app = express();
const port = 4000;

// Serve static files (e.g., HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to check if a value is an Excel numeric date
function isExcelDate(value) {
    return typeof value === 'number';
}

// Helper function to convert an Excel numeric date to a JavaScript Date
function convertExcelDate(excelDate) {
    // Excel's epoch starts at January 1, 1900 (subtract 1 because Excel starts counting at 1)
    const excelEpoch = new Date(1900, 0, 1);
    const jsDate = new Date(excelEpoch.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000);
    return jsDate.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
}


// Function to read and parse Excel file
function readTicketsFromExcel() {
    const workbook = xlsx.readFile(path.join(__dirname, 'tickets.xlsx')); // Read Excel file
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
    const tickets = xlsx.utils.sheet_to_json(worksheet); // Convert sheet to JSON
    // Map over the tickets and ensure all fields are properly handled
    return tickets.map(ticket => ({
        date: isExcelDate(ticket.Date) ? convertExcelDate(ticket.Date) : ticket.Date, // Handle Excel numeric dates
        venue: {
            name: ticket['Venue Name'],
            location: ticket.Location
        },
        band: {
            name: ticket['Band Name'],
            members: ticket['Band Members'] ? ticket['Band Members'].split(', ') : [] // Handle missing band members
        },
        souvenir: ticket.Souvenir || 'No Souvenir', // Provide default if missing
        images: [
            ticket['Image 1'] || '/images/default1.jpg', // Use a default image if missing
            ticket['Image 2'] || '/images/default2.jpg'
        ]
    }));
}

// Mock data
const tickets = [
    {
        date: '2024-09-05',
        venue: { name: 'Madison Square Garden', location: 'New York' },
        band: { name: 'The Rolling Stones', members: ['Mick Jagger', 'Keith Richards'] },
        souvenir: 'T-shirt',
        images: ['/images/concert1.jpg', '/images/concert2.jpg']
    },
    {
        date: '2023-08-20',
        venue: { name: 'Staples Center', location: 'Los Angeles' },
        band: { name: 'Coldplay', members: ['Chris Martin', 'Jonny Buckland'] },
        souvenir: 'Poster',
        images: ['/images/concert3.jpg', '/images/concert4.jpg']
    }
    // More tickets...
];

// API endpoint to get tickets
app.get('/api/tickets', (req, res) => {
    const tickets = readTicketsFromExcel(); // Read data from Excel
    res.json(tickets);
});

// Handle root route and serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
