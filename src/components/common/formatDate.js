const formatDate = (isoString, use24Hour = false) => {
  if (!isoString) return;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return;

  const formattedDate = date.toISOString().split("T")[0];
  const hours = use24Hour ? date.getHours() : date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = !use24Hour && date.getHours() >= 12 ? " PM" : " AM";

  return `${formattedDate} ${hours}:${minutes}:${seconds}${use24Hour ? "" : ampm}`;
};

export { formatDate };
