// Generate RSA key pair
export const generateKeyPair = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
};

// ✅ Convert to PEM format
const toPem = (buffer: ArrayBuffer) => {
  const base64 = btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );

  const formatted = base64.match(/.{1,64}/g)?.join("\n");

  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
};

// ✅ FINAL → PEM → BASE64 (THIS IS WHAT YOUR API NEEDS)
export const exportPublicKey = async (publicKey: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey(
    "spki",
    publicKey
  );

  const pem = toPem(exported);

  // 🔥 Convert full PEM → base64
  return btoa(pem);
};

