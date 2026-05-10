import { IonIcon } from "@ionic/react";
import { format } from "date-fns";
import { closeCircle } from "ionicons/icons";
import React, { useState, useRef, useEffect } from "react";

type DateTimeInputProp = {
  value?: string;
  onChange?: (value: string) => void;
};

const DateTimeInput: React.FC<DateTimeInputProp> = ({
  value = "",
  onChange = () => {},
}) => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value) {
      const [date, time] = value.split(" ");
      if (date && date !== currentDate) setCurrentDate(date);
      if (time && time !== currentTime) setCurrentTime(time);
    }
  }, [value]);



  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numbersOnly = inputValue.replace(/\D/g, "").slice(0, 6);
    let formatted = "";
    if (numbersOnly.length > 0) formatted += numbersOnly.slice(0, 2);
    if (numbersOnly.length > 2) formatted += ":" + numbersOnly.slice(2, 4);
    if (numbersOnly.length > 4) formatted += ":" + numbersOnly.slice(4, 6);
    setCurrentTime(formatted);
    if (currentDate) onChange(`${currentDate} ${formatted}`);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
    timeInputRef.current?.focus();
    if (currentTime) onChange(`${e.target.value} ${currentTime}`);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          ref={dateInputRef}
          type="date"
          value={currentDate}
          onChange={handleChangeDate}
          className="w-full bg-white/50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>
      <div className="flex-1 relative">
        <input
          ref={timeInputRef}
          type="text"
          value={currentTime}
          onChange={handleChangeTime}
          placeholder="HH:MM:SS"
          className="w-full bg-white/50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-400"
        />
        {currentTime && (
          <button 
            onClick={() => {
              setCurrentTime("");
              if (currentDate) onChange(`${currentDate} `);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <IonIcon icon={closeCircle} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateTimeInput;

