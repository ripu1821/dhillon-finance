import crypto from "crypto";

const secretKey = Buffer.from(process.env.AES_SECRET_KEY, "utf8"); // 32 chars
const iv = Buffer.from(process.env.AES_SECRET_IV, "utf8"); // 16 chars

// 🔒 Encrypt Function
export const encryptData = (data) => {
  try {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return "";
    }

    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted; // base64 string
  } catch (err) {
    console.error("Backend Encryption failed:", err);
    return "";
  }
};

// 🔓 Decrypt Function
export const decryptData = (encryptedText) => {
  try {
    if (!encryptedText || encryptedText.trim() === "") {
      return "";
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted ? JSON.parse(decrypted) : "";
  } catch (err) {
    console.error("Backend Decryption failed:", err);
    return "";
  }
};

export const decryptRequestBody = (req, res, next) => {
  try {
    if (!req.body?.data) {
      return res
        .status(400)
        .json({ success: false, message: "Missing encrypted data" });
    }

    const decrypted = decryptData(req.body.data);

    if (!decrypted) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid encrypted payload" });
    }

    req.body = decrypted;
    next();
  } catch (err) {
    console.error("Decryption Middleware Error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to decrypt request" });
  }
};
