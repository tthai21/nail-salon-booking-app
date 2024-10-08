import React from "react";

interface CustomRadioProps {
  index: number;
  id: number;
  label: string;
  date: string;
  selected: boolean | undefined;
  onSelect: () => void;
  unavailable: boolean;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  label,
  date,
  selected,
  onSelect,
  unavailable,
}) => {
  const currentDate = new Date();
  const currentDateString = currentDate.getDate().toLocaleString("en-GB");

  React.useEffect(() => {
    if (date == currentDateString) {
      onSelect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center">
      <label>
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          value={id}
          name="day-radio"
          className="hidden"
          disabled={unavailable}
        />
        <div
          className={`rounded-full shadow-md w-[65px] h-[65px] border flex flex-row justify-center items-center cursor-pointer ${
            selected && !unavailable
              ? "bg-black"
              : `${unavailable ? "line-through bg-slate-500" : ""}`
          } ${unavailable ? "line-through" : ""}`}
        >
          <div className="text-lg font-semibold flex justify-center items-center">
            <p
              className={`text-2xl ${!selected ? "text-black" : "text-white"} `}
            >
              {date}
            </p>
          </div>
        </div>
      </label>
      <h3 className="font-bold">{label}</h3>
    </div>
  );
};

export default CustomRadio;
