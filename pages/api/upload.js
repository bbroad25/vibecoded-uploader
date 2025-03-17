import formidable from "formidable";
import fs from "fs";

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
      subject: "Your Subject Here", // Ensure this line is complete
      text: "The body of the email here"
    };

    // Add logic to send the email (e.g., using a service like SendGrid, Nodemailer, etc.)
    // Example: await sendEmail(msg);

    return res.status(200).json({ message: "File uploaded successfully!" });
  });
}
