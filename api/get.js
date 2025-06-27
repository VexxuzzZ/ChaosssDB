import fs from 'fs/promises';

export default async function handler(req, res) {
  try {
    const data = await fs.readFile('data/database.json', 'utf8');
    const nomorList = JSON.parse(data);
    res.status(200).json(nomorList);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membaca file database.json' });
  }
}
