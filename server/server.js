const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const app = express();
const PORT = process.env.PORT || 5000;

const dataFilePath = path.join(__dirname, 'data', 'results.json');

app.get('/api/results', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/export-csv', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data file' });
    }
    const jsonData = JSON.parse(data);
    const fields = ['rank', 'fullName', 'finishTime', 'countryCode'];
    const parser = new Parser({ fields });
    const csv = parser.parse(jsonData);
    res.attachment('race_results.csv');
    res.status(200).send(csv);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});