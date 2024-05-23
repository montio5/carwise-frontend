export const handleDateChange = (selectedDate, setLastDateChanged, setShowDatePicker) => {
    setLastDateChanged(selectedDate);
    setShowDatePicker(false);
  };
  
  export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };