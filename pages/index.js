import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Modal } from "@web3modal/react";
import formidable from "formidable";
import fs from "fs";
import sgMail from "@sendgrid/mail";

const TOKEN_ADDRESS = "0x1f2af89CcF233E5aDF7095Cee6c3361836f2BeaF";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return alert("No wallet provider found");
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, [
      "function balanceOf(address owner) view returns (uint256)"
    ], signer);
    
    const balance = await tokenContract.balanceOf(address);
    setHasToken(balance.gt(0));
  };

  const handleFileUpload = async (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submitLogo = async () => {
    if (!selectedFile || !hasToken) return alert("Invalid upload");
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("wallet", account);
    
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    alert("Logo submitted!");
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected: {account}</p>}
      {hasToken && (
        <div>
          <input type="file" onChange={handleFileUpload} />
          <button onClick={submitLogo}>Upload Logo</button>
        </div>
      )}
    </div>
  );
}

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
      subject: "New Vibecoded Logo Upload",
      text: `Wallet: ${wallet} uploaded a logo`,
      attachments: [{
        content: fileData.toString("base64"),
        filename: file.originalFilename,
        type: file.mimetype,
        disposition: "attachment"
      }]
    };
    
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent!" });
  });
}
