import ExcelJS from "exceljs";
import { GroupedRecord } from "./attendanceUtils";

interface User {
  id: number;
  firstname: string;
  lastname: string;
}

export async function exportAttendanceExcel(
  records: GroupedRecord[],
  users: User[],
  selectedUserId: number,
  year: number,
  month: number
) {
  const user = users.find((u) => u.id === selectedUserId);
  if (!user) {
    alert("User not found.");
    return;
  }

  const userName = `${user.firstname} ${user.lastname}`;
  const mapUrl = `https://www.google.com/maps/place/`;

  // ✅ Load template file
  const response = await fetch("/lsi-kintai-excel-template.xlsx");
  if (!response.ok) {
    alert("Template file not found or failed to load.");
    return;
  }

  const templateData = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(templateData);

  const sheet = workbook.getWorksheet(1);
  if (!sheet) {
    alert("No worksheet found in the Excel template.");
    return;
  }

  // ✅ Fill header info
  sheet.getCell("B2").value = year;
  sheet.getCell("E2").value = month;
  sheet.getCell("D5").value = userName;

  // ✅ Fill attendance data
  let startRow = 8;
  for (const rec of records) {
    const day = rec.day;
    let row = startRow + (day - 1);

    // Bù dòng trống trong form Excel (nếu có)
    if (day > 20) row += 2;
    else if (day > 10) row += 1;

    const data = rec.data;
    if (!data) continue;

    // ✅ Nhiều thời gian checkin / checkout
    const checkinTimes =
      data.checkin?.map((c) => c.time).join("\n") || "";
    const checkoutTimes =
      data.checkout?.map((c) => c.time).join("\n") || "";

    // ✅ Lấy tọa độ đầu tiên (nếu có)
    const inLocation = data.checkin?.map((c) => `${mapUrl}${c.loc[0]},${c.loc[1]}`).join("\n") || "";
    const outLocation = data.checkout?.map((c) => `${mapUrl}${c.loc[0]},${c.loc[1]}`).join("\n") || "";

    // ✅ Ghi vào file Excel
    sheet.getCell(`E${row}`).value = checkinTimes;
    sheet.getCell(`F${row}`).value = checkoutTimes;
    sheet.getCell(`G${row}`).value = data.workingHours || "";

    // ✅ Bật xuống dòng trong ô (wrap text)
    sheet.getCell(`E${row}`).alignment = { wrapText: true };
    sheet.getCell(`F${row}`).alignment = { wrapText: true };

    sheet.getCell(`AC${row}`).value = inLocation;
    sheet.getCell(`AD${row}`).value = outLocation;

    // ✅ Công thức tính giờ tổng (ví dụ)
    sheet.getCell(`AZ${row}`).value = { formula: `=G${row}` };
  }

  // ✅ Xuất file Excel
  const filename = `LSI勤務表_${year}${String(month).padStart(2, "0")}_${userName}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
