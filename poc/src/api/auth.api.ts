import { api } from "./axios";
import { getHeaders } from "@/utils/requestHeader";
import { generateKeyPair, exportPublicKey } from "@/utils/crypto";
import { useAuthStore } from "@/store/useAuthStore";

let bffPublicKey: string | null = null;

export const preAuthHandshake = async () => {
  try {
    const keyPair = await generateKeyPair();
    const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);

    console.log("Generated Public Key:", publicKeyBase64);

    const res = await api.post(
      "/v1/api/auth/pre-auth-handshake",
      {
        devicePublicKey: publicKeyBase64,
      },
      { headers: getHeaders() }
    );

    bffPublicKey = res.data?.bffPublicKey;
    console.log("BFF Public Key:", bffPublicKey);

    return res.data;
  } catch (error) {
    console.error("Handshake Error:", error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  const res = await api.post(
    "/v1/api/auth/login",
    { username, password },
    { headers: getHeaders() }
  );

  return res.data;
};

export const validateOtp = async (username: string, otp: number) => {
  const res = await api.post(
    "/v1/api/auth/validate-otp",
    { username, otp },
    { headers: getHeaders() }
  );

  return res.data;
};

export const authenticateBlockedUserOtp = async (
  username: string,
  otp: number
) => {
  const res = await api.post(
    "/v1/api/auth/authenticate-otp",
    {
      otp,
      username,
      isUserBlocked: true,
    },
    { headers: getHeaders() }
  );

  return res.data;
};

export const forgotUserId = async (panNumber: string, emailId: string) => {
  const res = await api.post(
    "/v1/api/auth/forgot-user-id",
    {
      panNumber,
      emailId,
    },
    { headers: getHeaders() }
  );

  return res.data;
};

export const logoutUser = async () => {
  const token = useAuthStore.getState().getAccessToken();

  const res = await api.get("/v1/api/auth/logout", {
    headers: {
      ...getHeaders(),
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
