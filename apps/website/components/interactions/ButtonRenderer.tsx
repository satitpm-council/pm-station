import { memo } from "react";
import { classNames } from "@/shared/utils";

export type ButtonProps = {
  className: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
};

const Button = memo<ButtonProps>(function Button(button) {
  return (
    <button
      key={button.text}
      title={button.text}
      className={classNames(
        "pm-station-btn text-sm flex flex-row gap-2 items-center",
        button.className
      )}
      onClick={button.onClick}
      disabled={button.disabled}
    >
      {button.icon && <button.icon className="h-5 w-5 -mt-0.5" />}
      {button.text}
    </button>
  );
});

export const ButtonRenderer = ({ buttons }: { buttons: ButtonProps[] }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
      {buttons.map((button) => (
        <Button key={button.text} {...button} />
      ))}
    </div>
  );
};
