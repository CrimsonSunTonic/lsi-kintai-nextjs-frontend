import Swal from "sweetalert2";

export async function confirmDialog({
  title = "確認",
  text = "",
  icon = "warning",
  confirmButtonText = "削除",
  cancelButtonText = "キャンセル",
  confirmButtonColor = "#d33",
  cancelButtonColor = "#3085d6",
}: {
  title?: string;
  text?: string;
  icon?: "warning" | "info" | "success" | "error" | "question";
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
}

export function notify(
  type: "success" | "error" | "info",
  title: string,
  text?: string
) {
  Swal.fire(title, text || "", type);
}