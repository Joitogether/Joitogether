// 計算台灣時區的 minTime 和 maxTime
export function taiwanTime() {
  const taiwanTimeOffset = 8 * 60 * 60 * 1000;
  const now = new Date();
  const taiwanNow = new Date(now.getTime() + taiwanTimeOffset);

  // 計算 minTime
  const minDate = new Date(taiwanNow);
  minDate.setHours(minDate.getHours() + 12);
  const minTime = minDate.toISOString();

  // 計算 maxTime
  const maxDate = new Date(taiwanNow);
  maxDate.setDate(maxDate.getDate() + 90);
  const maxTime = maxDate.toISOString();

  return { minTime, maxTime };
}

// 格式化日期為 ISO 時區格式
export function formatToISOWithTimezone(dateString) {
  const date = new Date(dateString); // 將字串轉成 Date 物件
  const isoString = date.toISOString(); // 獲取 UTC 時間的 ISO 字串

  // 計算台灣時區（+08:00）
  const taiwanOffset = 8 * 60; // 台灣時區為 +8 小時，轉換成分鐘
  const timezoneHours = String(Math.floor(taiwanOffset / 60)).padStart(2, "0"); // 時
  const timezoneMinutes = String(taiwanOffset % 60).padStart(2, "0"); // 分

  // 返回轉換後的格式
  return `${isoString.slice(0, 19)}+${timezoneHours}:${timezoneMinutes}`;
}
