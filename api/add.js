import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const filePath = path.join(process.cwd(), 'data', 'database.json');

  try {
    const body = await req.body;
    const { nomor } = typeof body === 'string' ? JSON.parse(body) : body;

    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    if (data.find(item => item.nomor === nomor)) {
      return res.status(400).json({ message: 'Nomor sudah ada' });
    }

    data.push({ nomor });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: 'Nomor berhasil ditambahkan' });
  } catch (err) {
    console.error('Tambah error:', err);
    return res.status(500).json({ message: 'Gagal menambahkan nomor' });
  }
}
