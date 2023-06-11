import { memo } from "react";
import { classNames } from "@/shared/utils";
import { ButtonProps, ButtonRenderer } from "../interactions/ButtonRenderer";

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

type PageHeaderProps = {
  button?: ButtonProps | ButtonProps[];
} & PageHeaderInnerProps;

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
