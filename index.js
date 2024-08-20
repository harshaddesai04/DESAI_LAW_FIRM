const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// MySQL Connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Harshad@11",
    database: "appointments"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

// Function to convert MM/DD/YYYY to YYYY-MM-DD
function formatDate(dateStr) {

   

    const [month, day, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

// Function to convert 12-hour time to 24-hour time
function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:00`; // MySQL expects HH:MM:SS
}

// Route to handle form submission
app.post('/', (req, res) => {
    const { Name, Email, Date, Time, Service } = req.body;
    


    const formattedDate = formatDate(Date); // Convert the date format


    const formattedTime = convertTo24Hour(Time); // Convert the time format

    // SQL query to insert data into the table
    const sql = "INSERT INTO clientsdata (name, email, date, time, service) VALUES (?, ?, ?, ?, ?)";
    
    // Execute the query
    con.query(sql, [Name, Email, formattedDate, formattedTime, Service], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        console.log('Data inserted successfully:', result);
        // res.send('Appointment request has been submitted successfully');
        // Send success response
        res.status(200).json({ message: "Appointment request sent successfully!" });
        
    });
});

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



        
        
    