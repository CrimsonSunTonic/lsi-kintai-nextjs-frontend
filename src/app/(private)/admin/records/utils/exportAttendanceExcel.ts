import ExcelJS from "exceljs";
import { GroupedRecord } from "../components/AttendanceTable";
import { calcWorkTimes } from "./attendanceUtils";

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

    if (day > 20) row += 2;
    else if (day > 10) row += 1;

    const { actual, normalOt, midnightOt } = calcWorkTimes(
      rec.checkin || "",
      rec.checkout || "",
      rec.weekday
    );

    const inLocation = rec.checkinLoc
      ? `${mapUrl}${rec.checkinLoc[0]},${rec.checkinLoc[1]}`
      : "";
    const outLocation = rec.checkoutLoc
      ? `${mapUrl}${rec.checkoutLoc[0]},${rec.checkoutLoc[1]}`
      : "";

    sheet.getCell(`E${row}`).value = rec.checkin || "";
    sheet.getCell(`F${row}`).value = rec.checkout || "";
    sheet.getCell(`G${row}`).value = actual || "";
    sheet.getCell(`H${row}`).value = normalOt || "";
    sheet.getCell(`I${row}`).value = midnightOt || "";
    sheet.getCell(`AC${row}`).value = inLocation;
    sheet.getCell(`AD${row}`).value = outLocation;

    sheet.getCell(`AZ${row}`).value = { formula: `=G${row}` };
  }

  // ✅ Export Excel & trigger download manually
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
