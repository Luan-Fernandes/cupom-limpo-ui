import { ComponentProps } from "react";

interface InputRootProps extends ComponentProps<"div"> {}

export function InputRoot(props: InputRootProps) {
  return (
    <div className="flex relative items-center justify-center" {...props} />
  );
}

interface InputControlProps extends ComponentProps<"div"> {}
export function InputControl(props: InputControlProps) {
  return <div className="flex" {...props}></div>;
}

interface InputPrefixProps extends ComponentProps<"input"> {
  placeholder: string;
}
export function InputPrefix({ placeholder, ...props }: InputPrefixProps) {
  return (
    <input
      placeholder={placeholder}
      type="text"
      className="w-[551px] h-[50px] text-black bg-zinc-200 outline-none
      rounded-1 placeholder:text-center text-left"
      {...props}
    />
  );
}
