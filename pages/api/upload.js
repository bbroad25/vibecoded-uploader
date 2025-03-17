import formidable from "formidable";

export async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload error" });

    const { wallet } = fields;
    const file = files.file[0];
    const filePath = file.filepath;

    // Use fs only on the server side
    if (typeof window === "undefined") {
      const fs = require("fs");  // Dynamically require fs only on the server
      const fileData = fs.readFileSync(filePath);

      const msg = {
        to: "bbroad25@gmail.com",
        from: "no-reply@yourdomain.com",
        subject: "Your Subject Here",
        text: "The body of the email here"
      };

      // Add your email-sending logic here (e.g., using SendGrid)
      // Example: await sendEmail(msg);
    }

    return res.status(200).json({ message: "File uploaded successfully!" });
  });
}
