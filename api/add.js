import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { nomor } = await req.json();
    const file = await fs.readFile('data/database.json', 'utf8');
    const data = JSON.parse(file);

    if (!data.includes(nomor)) {
      data.push(nomor);
      await fs.writeFile('data/database.json', JSON.stringify(data, null, 2));
      res.status(200).json({ success: true });
    } else {
      res.status(409).json({ error: 'Nomor sudah ada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan nomor' });
  }
}
