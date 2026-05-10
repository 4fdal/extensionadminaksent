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
    if (value && !currentDate && !currentTime) {
      const [date, time] = value.split(" ");
      if (date) setCurrentDate(date);
      if (time) setCurrentTime(time);
    }
  }, [value]);

  useEffect(() => {
    if (currentDate && currentTime) {
      const newValue = `${currentDate} ${currentTime}`;
      if (newValue !== value) onChange(newValue);
    }
  }, [currentDate, currentTime]);

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numbersOnly = inputValue.replace(/\D/g, "").slice(0, 6);
    let formatted = "";
    if (numbersOnly.length > 0) formatted += numbersOnly.slice(0, 2);
    if (numbersOnly.length > 2) formatted += ":" + numbersOnly.slice(2, 4);
    if (numbersOnly.length > 4) formatted += ":" + numbersOnly.slice(4, 6);
    setCurrentTime(formatted);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
    timeInputRef.current?.focus();
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          ref={dateInputRef}
          type="date"
          value={currentDate}
          onChange={handleChangeDate}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>
      <div className="flex-1 relative">
        <input
          ref={timeInputRef}
          type="text"
          value={currentTime}
          onChange={handleChangeTime}
          placeholder="HH:MM:SS"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-600"
        />
        {currentTime && (
          <button 
            onClick={() => setCurrentTime("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <IonIcon icon={closeCircle} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateTimeInput;

