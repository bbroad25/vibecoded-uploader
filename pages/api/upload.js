export async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload error" });

    const { wallet } = fields;
    const file = files.file[0];
    const filePath = file.filepath;
    const fileData = fs.readFileSync(filePath);
    
    const msg = {
      to: "bbroad25@gmail.com",
      from: "no-reply@yourdomain.com",
      subje
