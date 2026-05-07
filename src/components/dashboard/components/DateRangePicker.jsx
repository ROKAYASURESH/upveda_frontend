import React from 'react';
import MultiDatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/red.css';

const DateRangePicker = ({ selectedDates, setSelectedDates, ...props }) => {

    const handleDateChange = (dates) => {
        setSelectedDates(dates);
    };

    return (
        <div>
            <MultiDatePicker
                value={selectedDates}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                clearButton="Clear"
                range
                style={{ width: "195px", height: "38px" }}
            />
        </div>
    );
};

export default DateRangePicker;
