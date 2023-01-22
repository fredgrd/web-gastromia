const monthNames = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const formatDate = (
  dateString: string,
  format: string = "mmmm-yyyy" // "dd-mmmm-yyyy"
): string => {
  const date = new Date(dateString);
  const formatArr = format.split("-");

  let formattedDate = "";
  formatArr.forEach((fmt, idx) => {
    formattedDate += idx > 0 ? " " : "";

    if (fmt === "mmmm") {
      formattedDate += monthNames[date.getUTCMonth()];
    }

    if (fmt === "yyyy") {
      formattedDate += date.getUTCFullYear();
    }

    if (fmt === "dd") {
      formattedDate += date.getDate();
    }
  });

  return formattedDate;
};

export default formatDate;
