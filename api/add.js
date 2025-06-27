import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { nomor } = req.body;
  if (!nomor) {
    return res.status(400).json({ error: 'Nomor tidak boleh kosong' });
  }

  const filePath = path.join(process.cwd(), 'data', 'database.json');

  try {
    const file = await readFile(filePath, 'utf-8');
    const data = JSON.parse(file);

    // Cek duplikat
    if (data.find(entry => entry.nomor === nomor)) {
      return res.status(409).json({ error: 'Nomor sudah ada' });
    }

    data.push({ nomor });

    await writeFile(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ success: true, nomor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Gagal menambahkan nomor' });
  }
}
