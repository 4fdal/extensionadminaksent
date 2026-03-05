import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FocusEvent,
} from "react";

// Types
interface DateTimeInputTextProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
}

const DateTimeInputText: React.FC<DateTimeInputTextProps> = ({
  value = null,
  onChange,
  placeholder = "dd/mm/yy hh:mm:ss",
  disabled = false,
  className = "",
  id,
  name,
  label,
  error: externalError,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Format date to "dd/mm/yyyy hh:mm:ss"
  const formatDateTime = (date: Date): string => {
    if (!date || isNaN(date.getTime())) return "";

    const pad = (num: number): string => String(num).padStart(2, "0");

    const day: string = pad(date.getDate());
    const month: string = pad(date.getMonth() + 1);
    const year: string = String(date.getFullYear());
    const hours: string = pad(date.getHours());
    const minutes: string = pad(date.getMinutes());
    const seconds: string = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Parse "dd/mm/yyyy hh:mm:ss" to Date object
  const parseDateTime = (str: string): Date | null => {
    const regex: RegExp =
      /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/;
    const match: RegExpMatchArray | null = str.match(regex);

    if (!match) return null;

    const [, dayStr, monthStr, yearStr, hoursStr, minutesStr, secondsStr] =
      match;

    const day: number = parseInt(dayStr, 10);
    const month: number = parseInt(monthStr, 10) - 1;
    const year: number = parseInt(yearStr, 10);
    const hours: number = parseInt(hoursStr, 10);
    const minutes: number = parseInt(minutesStr, 10);
    const seconds: number = parseInt(secondsStr, 10);

    const date: Date = new Date(year, month, day, hours, minutes, seconds);

    // Validate if the parsed date is valid
    if (
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year ||
      date.getHours() !== hours ||
      date.getMinutes() !== minutes ||
      date.getSeconds() !== seconds
    ) {
      return null;
    }

    return date;
  };

  // Initialize input value from prop
  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setInputValue(formatDateTime(value));
      setIsValid(true);
    } else if (value === null || value === undefined) {
      setInputValue("");
    }
  }, [value]);

  // Auto-format while typing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let val: string = e.target.value;

    // Remove non-numeric characters except space, slash, and colon
    val = val.replace(/[^\d\/\s:]/g, "");

    // Auto-insert formatting characters
    if (val.length === 2 && val.charAt(2) !== "/") {
      val += "/";
    } else if (val.length === 5 && val.charAt(5) !== "/") {
      val += "/";
    } else if (val.length === 10 && !val.includes(" ")) {
      val += " ";
    } else if (val.length === 13 && val.charAt(13) !== ":") {
      val += ":";
    } else if (val.length === 16 && val.split(":").length === 2) {
      val += ":";
    }

    // Limit length to 19 (dd/mm/yyyy hh:mm:ss)
    if (val.length > 19) {
      val = val.slice(0, 19);
    }

    setInputValue(val);

    // Validate complete format
    if (val.length === 19) {
      const parsedDate: Date | null = parseDateTime(val);
      if (parsedDate) {
        setIsValid(true);
        setErrorMessage("");
        onChange?.(parsedDate);
      } else {
        setIsValid(false);
        setErrorMessage("Tanggal atau waktu tidak valid");
        onChange?.(null);
      }
    } else if (val.length === 0) {
      setIsValid(true);
      setErrorMessage("");
      onChange?.(null);
    } else {
      setIsValid(false);
      setErrorMessage("Format tidak lengkap (dd/mm/yyyy hh:mm:ss)");
      onChange?.(null);
    }
  };

  // Handle blur - validate and format
  const handleBlur = (): void => {
    if (inputValue.length > 0 && inputValue.length < 19) {
      setIsValid(false);
      setErrorMessage("Format harus lengkap: dd/mm/yyyy hh:mm:ss");
    }
  };

  // Set current datetime
  const setNow = (): void => {
    const now: Date = new Date();
    const formatted: string = formatDateTime(now);
    setInputValue(formatted);
    setIsValid(true);
    setErrorMessage("");
    onChange?.(now);
    inputRef.current?.focus();
  };

  // Clear input
  const clearInput = (): void => {
    setInputValue("");
    setIsValid(true);
    setErrorMessage("");
    onChange?.(null);
    inputRef.current?.focus();
  };

  const displayError: string = externalError || (!isValid ? errorMessage : "");

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center group">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={19}
          className={`
            w-full px-4 py-2.5 pr-24
            font-mono text-sm tracking-wide
            bg-white dark:bg-gray-800
            border-2 rounded-lg
            transition-all duration-200 ease-in-out
            outline-none
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60
            dark:disabled:bg-gray-900 dark:disabled:text-gray-600
            ${
              displayError
                ? "border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400"
            }
          `}
        />

        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={setNow}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Set ke waktu sekarang"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {inputValue && (
            <button
              type="button"
              onClick={clearInput}
              disabled={disabled}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Hapus"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {displayError && (
        <span className="text-xs text-red-500 dark:text-red-400 ml-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {displayError}
        </span>
      )}

      {!displayError && (
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
          Format: dd/mm/yyyy hh:mm:ss
        </span>
      )}
    </div>
  );
};

export default React.memo(DateTimeInputText);
