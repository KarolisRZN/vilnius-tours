exports.formatDate = (dateString) => {
  // If already in YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Otherwise, fallback to Date parsing
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
