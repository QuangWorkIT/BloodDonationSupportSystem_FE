import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  hasError?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Parse the input value (MM/dd/yyyy format)
  useEffect(() => {
    if (value) {
      const [month, day, year] = value.split("/");
      if (month && day && year) {
        setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
        setCurrentDate(new Date(Number(year), Number(month) - 1, Number(day)));
      }
    }
  }, [value]);

  // Calculate popup position when opening
  const updatePopupPosition = () => {
    const popupWidth = 350; // estimate popup width
    const popupHeight = 320; // estimate popup height
    const top = (window.innerHeight - popupHeight) / 2;
    const left = (window.innerWidth - popupWidth) / 2;
    setPopupPosition({
      top,
      left,
    });
  };

  // Toggle calendar visibility
  const toggleCalendar = () => {
    if (!isOpen) {
      updatePopupPosition();
    }
    setIsOpen(!isOpen);
  };

  // Close datepicker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date as MM/DD/YYYY
  const formatDate = (date: Date) => {
    if (!date) return "";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(formatDate(newDate)); // pass formatted string
    setIsOpen(false);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // New: Handler for year selection from dropdown
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newYear);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday =
        new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`w-8 h-8 text-sm rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : isToday
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700"
          }`}
          type="button"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    "January","February","March","April","May","June","July","August","September","October","November","December",
  ];

  // Generate year options - from 1900 to current year + 10
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 1900; y <= currentYear + 10; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="relative" ref={datePickerRef}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={value || ""}
          onClick={toggleCalendar}
          readOnly
          placeholder="MM/DD/YYYY"
          className={`w-full border ${
            hasError ? "border-red-500" : "border-gray-300"
          } rounded px-3 py-2 text-sm pr-10 cursor-pointer ${className}`}
          aria-label="Date input field"
        />
        <Calendar
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={toggleCalendar}
          aria-label="Toggle calendar"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCalendar(); }}
        />
      </div>

      {/* Calendar popup */}
      {isOpen && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] p-4 min-w-[300px]"
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Calendar date picker"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Previous month"
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Month and Year */}
            <div className="flex items-center space-x-2 select-none">
              <span className="font-medium text-gray-900" aria-live="polite" aria-atomic="true">
                {monthNames[currentDate.getMonth()]}
              </span>

              {/* Year dropdown */}
              <select
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
                aria-label="Select year"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Next month"
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500 select-none"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

