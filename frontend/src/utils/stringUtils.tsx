export const formatDateTime = (dateTime: string) => {
  return dateTime.substring(0, dateTime.lastIndexOf(":")).split("T").join(" ");
};
