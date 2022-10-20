import { memo } from "react";
import { classNames } from "~/utils/client";

export function HeaderLarge() {
  return (
    <div className="px-2 py-3 flex gap-4 items-center">
      <img
        draggable={false}
        src="/logo.png"
        alt="Logo"
        width="70"
        height="70"
      />
      <h1 className="text-3xl font-bold">PM Station</h1>
    </div>
  );
}

export function Header() {
  return (
    <div className="px-2 py-3 flex gap-3 items-center">
      <img
        draggable={false}
        src="/logo.png"
        alt="Logo"
        width="40"
        height="40"
      />
      <h1 className="text-xl font-bold">PM Station</h1>
    </div>
  );
}

export type PageHeaderInnerProps = {
  className?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
};

const PageHeaderInner = memo<PageHeaderInnerProps>(function PageHeaderInner({
  title,
  children,
  className,
}) {
  return (
    <div className={classNames("flex flex-col gap-3", className)}>
      <h1 className={`text-3xl xl:text-4xl font-bold`}>{title}</h1>
      {children && <span className="text-gray-300 text-sm">{children}</span>}
    </div>
  );
});

type ButtonProps = {
  className: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
};

type PageHeaderProps = {
  button?: ButtonProps | ButtonProps[];
} & PageHeaderInnerProps;

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
const ButtonRenderer = ({ buttons }: { buttons: ButtonProps[] }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
      {buttons.map((button) => (
        <Button key={button.text} {...button} />
      ))}
    </div>
  );
};

export const PageHeader = ({ button, ...props }: PageHeaderProps) => {
  return (
    <header className={button ? "flex flex-col sm:flex-row gap-4" : undefined}>
      <PageHeaderInner className={button ? "sm:flex-grow" : ""} {...props} />
      {button && (
        <ButtonRenderer buttons={Array.isArray(button) ? button : [button]} />
      )}
    </header>
  );
};
