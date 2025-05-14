exports.formatDate = (dateString) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
