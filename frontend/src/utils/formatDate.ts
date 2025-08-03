// utils/formatDate.ts
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Timezone for Malaysia
const malaysiaTimeZone = "Asia/Kuala_Lumpur";

export function formatToMalaysiaTime(
  dateString: string,
  dateFormat = "dd MMM yyyy, hh:mm a"
): string {
  const utcDate = new Date(dateString);
  const zonedDate = toZonedTime(utcDate, malaysiaTimeZone);
  return format(zonedDate, dateFormat);
}
