export const readableCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/**
 * Formats a date/time string into a human-readable format
 * @param dateString - ISO date string or Date object
 * @param options - Optional formatting options
 * @returns Formatted date string
 *
 * Examples:
 * - "Jan 15, 2024 at 2:30 PM"
 * - "Today at 3:45 PM"
 * - "Yesterday at 10:00 AM"
 */
export const formatDateTime = (
  dateString: string | Date,
  options?: {
    showRelative?: boolean; // Show "Today", "Yesterday" etc.
    includeSeconds?: boolean;
    shortFormat?: boolean; // Shorter format like "Jan 15, 2:30 PM"
  },
): string => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  // Time formatting
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    ...(options?.includeSeconds && { second: "2-digit" }),
    hour12: true,
  };
  const timeString = date.toLocaleString("en-US", timeOptions);

  // Show relative dates if enabled
  if (options?.showRelative !== false) {
    if (targetDate.getTime() === today.getTime()) {
      return `Today at ${timeString}`;
    }
    if (targetDate.getTime() === yesterday.getTime()) {
      return `Yesterday at ${timeString}`;
    }
  }

  // Full date formatting
  if (options?.shortFormat) {
    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const dateStr = date.toLocaleString("en-US", dateFormatOptions);
    return `${dateStr}, ${timeString}`;
  }

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const dateStr = date.toLocaleString("en-US", dateFormatOptions);
  return `${dateStr} at ${timeString}`;
};
