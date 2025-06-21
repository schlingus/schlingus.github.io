const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const logEntry = `${new Date().toISOString()} - ${userIP}\n`;

  // Append the IP + timestamp to visitors.log
  fs.appendFile('visitors.log', logEntry, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });

  res.send('There was an error loading the game. Please try again later.');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
