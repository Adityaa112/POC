export const getHeaders = () => {
  const timestamp = Date.now().toString();
  const deviceId = "2abe6bee-768f-4714-ab8d-2da64540bda8";

  return {
    "Content-Type": "application/json",
    appName: "NVantage - Middleware Qa",
    buildNumber: "10005",
    packageName: "com.coditas.omnenest.omnenest_mobile_app.middlewareqa",
    appVersion: "1.0.6",
    os: "android",
    deviceId,
    xRequestId: `${deviceId}-${timestamp}`,
    deviceIp: "10.0.2.16",
    timestamp,
    source: "MOB",
    appInstallId: deviceId,
    userAgent:
      "com.coditas.omnenest.omnenest_mobile_app.middlewareqa/1.0.6",
  };
};