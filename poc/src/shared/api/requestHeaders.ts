import { appConfig } from "@/config/appConfig";

export const getHeaders = () => {
  const timestamp = Date.now().toString();
  const xRequestId = `${appConfig.deviceId}-${timestamp}`;

  return {
    "Content-Type": "application/json",
    appName: appConfig.appName,
    buildNumber: appConfig.buildNumber,
    packageName: appConfig.packageName,
    appVersion: appConfig.appVersion,
    os: appConfig.os,
    deviceId: appConfig.deviceId,
    xRequestId,
    deviceIp: appConfig.deviceIp,
    timestamp,
    source: appConfig.source,
    appInstallId: appConfig.deviceId,
    userAgent: appConfig.userAgent,
  };
};
