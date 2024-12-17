
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

export const getToolName = (key, t) => {
  const defaultToolsStrings = {
    engine_oil: t("defaultToolsStrings.engine_oil"),
    hydraulic_fluid: t("defaultToolsStrings.hydraulic_fluid"),
    gearbox_oil: t("defaultToolsStrings.hydraulic_fluid"),
    oil_filter: t("defaultToolsStrings.oil_filter"),
    fuel_filter: t("defaultToolsStrings.fuel_filter"),
    air_filter: t("defaultToolsStrings.air_filter"),
    cabin_air_filter: t("defaultToolsStrings.cabin_air_filter"),
    timing_belt: t("defaultToolsStrings.timing_belt"),
    timing_belt_max_year: t("defaultToolsStrings.timing_belt_max_year"),
    alternator_belt: t("defaultToolsStrings.alternator_belt"),
    front_brake_pads: t("defaultToolsStrings.front_brake_pads"),
    rear_brake_pads: t("defaultToolsStrings.rear_brake_pads"),
    spark_plug: t("defaultToolsStrings.spark_plug"),
    front_suspension: t("defaultToolsStrings.front_suspension"),
    clutch_plate: t("defaultToolsStrings.clutch_plate"),
    mileage: t("defaultToolsStrings.mileage"),
  };

  return defaultToolsStrings[key] || key;  // Return the key if translation is not found
};
