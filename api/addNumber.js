import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { nomor } = req.body;
  if (!nomor) return res.status(400).send("Nomor wajib");

  const owner = "VexxuzzZ";
  const repo = "ChaosssDB";
  const path = "data/database.json";

  try {
    // Ambil isi file
    const { data: fileData } = await octokit.request(
      `GET /repos/${owner}/${repo}/contents/${path}`
    );

    const contentDecoded = Buffer.from(fileData.content, "base64").toString();
    const json = JSON.parse(contentDecoded);

    // Tambah data
    json.push({ nomor });

    // Encode kembali dan update
    const updatedContent = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
      owner,
      repo,
      path,
      message: `Menambahkan nomor ${nomor}`,
      content: updatedContent,
      sha: fileData.sha,
    });

    return res.status(200).json({ success: true, nomor });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Gagal menyimpan nomor");
  }
};
