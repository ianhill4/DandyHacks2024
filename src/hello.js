// Load HTTP module
const http = require("http");
const { Client } = require('pg');
const express = require('express');

const hostname = "0.0.0.0";
const port = 8000;

const app = express();
app.use(express.json());

// PostgreSQL connection setup
const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',     // Change to the host if your DB is remote
  database: 'leetcode_plugin',   // Replace with your PostgreSQL database name
  password: 'jile', // Replace with your password
  port: 5432,            // Default PostgreSQL port
});

// Connect to PostgreSQL database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Example POST endpoint
app.post('/post-problem', async (req, res) => {
  // Access query parameters and JSON body
  const queryParams = req.query;
  const jsonBody = req.body;
  
  // Validate query parameters and body
  if (!queryParams.username) {
    return res.status(400).json({ error: 'Missing required query parameter: username' });
  }
  
  if (!jsonBody || !jsonBody.problemNum || !jsonBody.runtime || !jsonBody.space ) {
    return res.status(400).json({ error: 'Missing required JSON field' });
  }
  const query = `
    INSERT INTO problems (usr_id, problem_number, runtime, space)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    // Execute the query with parameters
    const result = await client.query(query, [queryParams.username, jsonBody.problemNum, jsonBody.runtime, jsonBody.space]);
    
    // Send the response
    res.status(201);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Prints a log once the server starts listening
server.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

