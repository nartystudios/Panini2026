const express = require('express');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Supabase client ----------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Middleware ---------------------------------------------------------
app.use(express.json());               // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets

// ---- API Routes ---------------------------------------------------------

// GET /api/purchases - List all purchases
app.get('/api/purchases', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('date', { ascending: false })
      .execute();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Supabase GET error:', err);
    res.status(500).json({ error: 'Erro ao buscar compras' });
  }
});

// POST /api/purchases - Add a new purchase (requires correct password)
app.post('/api/purchases', async (req, res) => {
  const { packs, password } = req.body;
  const SECRET_PASSWORD = '*+++*'; // <-- troque pela sua senha real

  if (password !== SECRET_PASSWORD) {
    return res.status(403).json({ error: 'Password incorreta' });
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        date: new Date().toISOString().split('T')[0],
        packs,
        stickers: packs * 7,
        cost: packs * 1.5,
      })
      .single(); // return the inserted row

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Supabase POST error:', err);
    res.status(500).json({ error: 'Erro ao inserir compra' });
  }
});

// DELETE /api/purchases/:id - Remove a purchase (requires correct password)
app.delete('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const SECRET_PASSWORD = '*+++*'; // <-- troque pela sua senha real

  if (password !== SECRET_PASSWORD) {
    return res.status(403).json({ error: 'Password incorreta' });
  }

  try {
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    res.json({ message: 'Compra eliminada' });
  } catch (err) {
    console.error('Supabase DELETE error:', err);
    res.status(500).json({ error: 'Erro ao eliminar compra' });
  }
});

// ---- Start server -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});