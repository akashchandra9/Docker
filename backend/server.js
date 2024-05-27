const express = require('express')
var app = express()
const bodyparser=require('body-parser')
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))
const mysql=require('mysql2')
const cors = require('cors');
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));
const connection=mysql.createConnection({
    host:'my-sql', // Use container name as hostname
    user: 'root',
    password:'123',
    database: 'mysql',
    insecureAuth : true
     
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');

    // Execute SQL queries to create table and insert data
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            genre VARCHAR(255) NOT NULL,
            director VARCHAR(255) NOT NULL,
            lead_cast VARCHAR(255) NOT NULL
        )
    `;

    const insertDataQuery1 = `
        INSERT INTO movies (name, genre, director, lead_cast)
        VALUES ("The Martian", "sci-fi", "Ridley Scott", "Matt Damon2")
    `;

    const insertDataQuery2 = `
        INSERT INTO movies (name, genre, director, lead_cast)
        VALUES ("Interstellar", "sci-fi", "Christopher Nolan", "Matthew McConaughey")
    `;

    // Execute queries
    connection.query(createTableQuery, (error, results, fields) => {
        if (error) {
            console.error('Error creating table:', error);
        } else {
            console.log('Table created successfully');
            // Insert data after table creation
            connection.query(insertDataQuery1, (err1, results1) => {
                if (err1) {
                    console.error('Error inserting data:', err1);
                }
            });
            connection.query(insertDataQuery2, (err2, results2) => {
                if (err2) {
                    console.error('Error inserting data:', err2);
                }
            });
        }
    });
});


app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;
    connection.query(createTableSQL, (err, result) => {
        if (err) {
            console.error('Error creating table: ' + err.stack);
            return res.status(500).json({ message: 'Error creating table' });
        }

        console.log('Table created or already exists');

        // Insert user data into the 'users' table
        const insertUserSQL = 'INSERT INTO users2 (name, email, password) VALUES (?, ?, ?)';
        connection.query(insertUserSQL, [username, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting user: ' + err.stack);
                return res.status(500).json({ message: 'Error registering user' });
            }

            console.log('User registered successfully');
            return res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const sql = 'SELECT * FROM users2 WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).json({ message: 'Error querying database' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        return res.status(200).json({ message: 'Login successful', user });
    });
});
app.get('/movies', (req, res) => {
    const sql = `
        SELECT name, genre, director, lead_cast
        FROM movies
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Error querying database' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }

        return res.status(200).json(results);
    });
});


app.listen(5000,()=>{
    console.log("server staretd at port 5000")
})