function convertDateFormat(inputDate) {
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
  
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    return formattedDate;
  }

function isDateBeforeCurrent(inputDate) {
    const currentDate = new Date();
    const providedDate = new Date(inputDate);
  
    return providedDate < currentDate;
}

export const dateFunctions = {
  convertDateFormat,
  isDateBeforeCurrent
}
