// app.js
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connection with database
const connection = mysql.createConnection({
    host: 'localhost',      // Assuming your MySQL server is running locally
    user: 'root',
    password: '',           // Empty password for the 'root' user
    database: 'real_estate'
});

// Define a route to render the EJS view
app.get('/', (req, res) => {
    // console.log(connection);
    connection.query('SELECT * FROM properties', (error, properties, fields) => {
        if (error) throw error;
        connection.query('SELECT * FROM agents LIMIT 3', (error, agents, fields) => {
            if (error) throw error;
            connection.query('SELECT * FROM testimonials LIMIT 2', (error, testimonials, fields) => {
                if (error) throw error;
                console.log(properties, agents, testimonials)
                res.render('index', { properties, agents, testimonials });
            })
        })
    });
});
app.get('/about', (req, res) => {
    res.render('about', { message: 'Hello, Express and EJS!' });
});
app.get('/property-grid', (req, res) => {
    connection.query('SELECT * FROM properties', (error, properties, fields) => {
        if (error) throw error;
        res.render('property-grid', { properties });
    });
});
app.get('/contact', (req, res) => {
    res.render('index', { message: 'Hello, Express and EJS!' });
});
app.get('/property-single', (req, res) => {
    res.render('property-single', { message: 'Hello, Express and EJS!' });
});
// app.get('/agent-single', (req, res) => {
//     res.render('agent-single', { message: 'Hello, Express and EJS!' });
// });
app.get('/agents-grid', (req, res) => {
    res.render('agents-grid', { message: 'Hello, Express and EJS!' });
});
// app.get('/property/:propertyID', (req, res) => {
//     const propertyID = parseInt(req.params.propertyID, 10);

//     connection.query('SELECT * FROM properties', (error, properties, fields) => {
//         if (error) throw error;
//         // Find the property with the specified ID
//         const property = properties.find(prop => prop.PropertyID === propertyID);
//         if (property) {
//             // Render a template with property details
//             res.render('property-single', { property });
//         } else {
//             // Handle case where property is not found
//             res.status(404).send('Property not found');
//         }
//     });
// });

app.get('/property/:propertyID', (req, res) => {
    const propertyID = parseInt(req.params.propertyID, 10);

    const query = `
        SELECT Properties.*, Agents.*
        FROM Properties
        JOIN Agents ON Properties.AgentID = Agents.AgentID
        WHERE Properties.PropertyID = ?;
    `;

    connection.query(query, [propertyID], (error, results, fields) => {
        if (error) throw error;

        const property = results[0];
        const agent = results[1];
        if (property) {
            console.log(results)
            // Render the property details page, passing both property and agent details
            res.render('property-single', { property });
        } else {
            res.status(404).send('Property not found');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
