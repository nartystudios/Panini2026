const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ purchases: [] }));
}

// Get all purchases
app.get('/api/purchases', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Add new purchase
app.post('/api/purchases', (req, res) => {
  try {
    const { packs } = req.body;
    if (!packs || packs < 1) {
      return res.status(400).json({ error: 'Invalid number of packs' });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    const purchase = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      packs: parseInt(packs),
      stickers: parseInt(packs) * 7,
      cost: parseFloat(packs) * 1.5
    };
    
    data.purchases.push(purchase);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save purchase' });
  }
});

// Delete purchase
app.delete('/api/purchases/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.purchases = data.purchases.filter(p => p.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});