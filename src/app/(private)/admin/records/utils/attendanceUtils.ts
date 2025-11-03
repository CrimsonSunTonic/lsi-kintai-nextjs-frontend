export interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface GroupedRecord {
  day: number;
  weekday: string;
  checkin?: string;
  checkout?: string;
  checkinLoc?: [number, number];
  checkoutLoc?: [number, number];
}

export function parseTime(str: string) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

export function roundToHalfHour(minutes: number) {
  return Math.floor(minutes / 30) * 0.5;
}

export function calcWorkTimes(checkin: string, checkout: string, weekday: string) {
  if (!checkin || !checkout) return { actual: "", normalOt: "", midnightOt: "" };

  let start = parseTime(checkin);
  let end = parseTime(checkout);
  if (end < start) end += 24 * 60;

  // Break times
  const breaks = [
    [8 * 60, 9 * 60],
    [12 * 60, 13 * 60],
    [19 * 60, 20 * 60],
    [2 * 60, 3 * 60],
  ];
  let workMinutes = end - start;
  breaks.forEach(([bStart, bEnd]) => {
    const overlap = Math.max(0, Math.min(end, bEnd) - Math.max(start, bStart));
    workMinutes -= overlap;
  });

  const actual = roundToHalfHour(workMinutes);

  // Normal overtime
  let normalOt = "";
  if (!["土", "日"].includes(weekday) && actual >= 9) {
    const roundedNormalOt = roundToHalfHour((actual - 8) * 60);
    normalOt = roundedNormalOt < 1 ? "" : String(roundedNormalOt);
  }

  // Midnight overtime
  let midnightOtMinutes = 0;
  const midnightRanges = [
    [22 * 60 + 30, 24 * 60],
    [0, 4 * 60],
  ];
  midnightRanges.forEach(([mStart, mEnd]) => {
    const overlap = Math.max(0, Math.min(end, mEnd) - Math.max(start, mStart));
    breaks.forEach(([bStart, bEnd]) => {
      if (bEnd <= mStart || bStart >= mEnd) return;
      const bOverlap = Math.max(0, Math.min(mEnd, bEnd) - Math.max(mStart, bStart));
      midnightOtMinutes -= bOverlap;
    });
    midnightOtMinutes += overlap;
  });

  const midnightOt = midnightOtMinutes > 0 ? roundToHalfHour(midnightOtMinutes) : "";

  return { actual, normalOt, midnightOt };
}
