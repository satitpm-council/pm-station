import type { MouseEventHandler } from "react";
import { forwardRef } from "react";

import { ColorRing } from "react-loader-spinner";

type SubmitButtonProps = {
  children: string;
  className?: string;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function SubmitButton(
    { children, loading, onClick, className, disabled },
    ref
  ) {
    return (
      <button
        ref={ref}
        title={children}
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={loading || disabled}
        className={`${className ? className : ""}
  text-sm pm-station-btn bg-green-500 hover:bg-green-600 pm-station-focus-ring focus:ring-green-500 disabled:bg-green-300`}
      >
        {loading && (
          <ColorRing
            visible={true}
            height="30"
            width="30"
            ariaLabel="loading"
            wrapperStyle={{}}
            wrapperClass="inline -my-1 mr-1"
            colors={Array(5).fill("white") as any}
          />
        )}
        {children}
      </button>
    );
  }
);
