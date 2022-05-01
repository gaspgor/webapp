import { FC } from "react";

type FormInputPropTypes = {
  title: string,
  value: string,
  onChange: (value: string) => void,
}

const FormInput: FC<FormInputPropTypes> = ({
  title,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-y-[10px] w-full">
    <p className="capitalize text-[17px] w-full">{title}</p>
    <input
      className="px-[10px] py-[5px] text-[15px] w-full bg-gray-100 border-[1px] border-gray-300 rounded"
      onChange={(e) => onChange(e.target.value)}
      type="text"
      value={value}
    />
  </div>
);

export default FormInput;
