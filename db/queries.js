const pool = require("./pool");


async function checkDatabase() {
    const result = await pool.query("SELECT current_database();");
    console.log("Connected to database:", result.rows[0].current_database);
}

async function getAllTickets(){
    try {
        const result = await pool.query(`SELECT "ID", band, TO_CHAR(eventdate, 'YYYY-MM-DD') as eventdate, venue FROM tickets ORDER BY eventdate DESC`);
        return result.rows;
    }catch(err){
        console.error('Error fetching tickets', err);
        throw err;
    }
}

async function insertTicket(band, date, venue){
    await pool.query("INSERT INTO tickets (band, eventdate, venue) VALUES ($1,$2,$3)", [band, date, venue]);
}

module.exports= {
    checkDatabase,
    getAllTickets,
    insertTicket
}
