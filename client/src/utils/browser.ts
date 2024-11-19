export const getBrowser = (): string => {
    const { userAgent } = navigator;
  
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Chrome")) return "Chrome";
    return "Other";
};  