import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const Button: FC<IButton> = ({ variant, className, size = "md", children, ...rest }) => {
  const variants: Record<string, unknown> = {
    primary: "bg-blue-500 hover:bg-blue-400",
    secondary: "border border-gray-5 text-white",
    tertiary: "",
    destructive: "bg-red-500",
  };

  const sizes: Record<string, unknown> = {
    lg: "rounded-lg text-base px-6 py-3",
    md: "rounded-lg text-sm px-6 py-3",
    sm: "rounded-md text-sm px-6 py-3",
  };

  return (
    <button className={`${className} ${sizes[size]}  ${variants[variant]}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
