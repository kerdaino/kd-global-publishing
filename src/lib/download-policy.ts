export const DOWNLOAD_TOKEN_EXPIRY_DAYS = 30;
export const DOWNLOAD_TOKEN_MAX_DOWNLOADS = 5;

export function downloadPolicyText() {
  return `Download links expire after ${DOWNLOAD_TOKEN_EXPIRY_DAYS} days and allow ${DOWNLOAD_TOKEN_MAX_DOWNLOADS} downloads.`;
}
