import { IonIcon } from "@ionic/react";
import { format } from "date-fns";
import { removeCircle } from "ionicons/icons";
import React, { useState, useRef, useEffect } from "react";

type DateTimeInputProp = {
  value?: string;
  onChange?: (value: string) => void;
};

const DateTimeInput: React.FC<DateTimeInputProp> = ({
  value = null,
  onChange = () => {},
}) => {
  // const [currentValue, setCurrentValue] = useState<Date | null>();
  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [currentTime, setCurrentTime] = useState<string | undefined>();

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  // Format: DD/MM/YYYY HH:MM:SS
  // Position map (index dalam formatted string):
  // 0-1: DD, 2: /, 3-4: MM, 5: /, 6-9: YYYY, 10: spasi,
  // 11-12: HH, 13: :, 14-15: MM, 16: :, 17-18: SS

  useEffect(() => {
    if (value != null && currentDate == undefined && currentTime == undefined) {
      const [date, time] = value.split(" ");
      if (date != currentDate) setCurrentDate(format(date, "yyyy-MM-dd"));
      if (time != currentTime) setCurrentTime(time);
    }
  }, [value]);

  useEffect(() => {
    if (currentDate && currentTime) {
      const currentValue = `${currentDate} ${currentTime}`;
      if (currentValue != value) onChange(currentValue);
    }
  }, [currentDate, currentTime]);

  const handleChangeTime: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    const numbersOnly = inputValue.replace(/\D/g, "");
    const limitedNumbers = numbersOnly.slice(0, 8);
    let formattedValue = "";

    if (limitedNumbers.length > 0) {
      formattedValue += limitedNumbers.slice(0, 2);
    }
    if (limitedNumbers.length > 2) {
      formattedValue += ":" + limitedNumbers.slice(2, 4);
    }
    if (limitedNumbers.length > 4) {
      formattedValue += ":" + limitedNumbers.slice(4, 6);
    }

    setCurrentTime(formattedValue);
  };

  const handleChangeDate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentDate(format(e.target.value, "yyyy-MM-dd"));
    timeInputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-row gap-2">
      <input
        ref={dateInputRef}
        type="date"
        value={currentDate}
        onChange={handleChangeDate}
        placeholder="DD:MM:YYYY"
        maxLength={10}
        className="
          w-full px-3 py-2 
          text-lg font-mono tracking-wide
          border-2 rounded-lg 
          border-gray-300 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
          hover:border-gray-400
          transition-all duration-200
          placeholder:text-gray-400
        "
      />
      <div className="flex flex-row items-center">
        <input
          ref={timeInputRef}
          type="text"
          value={currentTime}
          onChange={handleChangeTime}
          placeholder="HH:MM:SS"
          maxLength={8}
          className="
          w-full px-3 py-2 
          text-lg font-mono tracking-wide
          border-2 rounded-lg 
          border-gray-300 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
          hover:border-gray-400
          transition-all duration-200
          placeholder:text-gray-400
        "
        />
        <span className="absolute right-5 ">
          <button onClick={() => setCurrentTime("")}>
            <IonIcon
              icon={removeCircle}
              className="w-5 h-5 mt-1 p-1 text-gray-400 hover:text-gray-300"
            />
          </button>
        </span>
      </div>
    </div>
  );
};

export default DateTimeInput;
