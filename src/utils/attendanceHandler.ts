import { sendAttendance, Attendance } from "@/api/attendance/attendanceClient";

export interface AttendanceResult {
  record: Attendance | null;
  message: string;
  success: boolean;
}

export const handleAttendanceAction = async (
  status: "checkin" | "checkout" | "lunchin" | "lunchout"
): Promise<AttendanceResult> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        record: null,
        message: "お使いのブラウザは位置情報をサポートしていません。",
        success: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await sendAttendance(status, latitude, longitude);
          if (res) {
            const timeOnly = res.date.split("T")[1].slice(0, 5);
            resolve({
              record: res,
              message: `✅ ${status === "checkin" ? "出勤" : "退勤"} が記録されました。\n記録時刻: ${timeOnly}`,
              success: true,
            });
          } else {
            resolve({
              record: null,
              message: "❌ 勤怠の記録に失敗しました。もう一度お試しください。",
              success: false,
            });
          }
        } catch (error) {
          resolve({
            record: null,
            message: "❌ サーバー通信中にエラーが発生しました。",
            success: false,
          });
        }
      },
      () => {
        resolve({
          record: null,
          message: "位置情報の取得に失敗しました。もう一度お試しください。",
          success: false,
        });
      }
    );
  });
};
