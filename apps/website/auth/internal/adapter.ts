import type { Adapter } from "next-auth/adapters";

type InjectedFunction<F extends (...args: any) => any> =
  | {
      override?: undefined;
      before?: (...args: Parameters<F>) => void | Promise<void>;
      after?: (...args: Parameters<F>) => void | Promise<void>;
    }
  | {
      override: (...args: Parameters<F>) => ReturnType<F>;
    };

type AdapterStep = {
  [K in keyof Adapter]: Adapter[K] extends (...args: any) => any
    ? InjectedFunction<Adapter[K]>
    : never;
};

export const extendAdapter = (
  adapter: Adapter,
  steps: Partial<AdapterStep>
): Adapter => {
  const result = { ...adapter };
  for (const _ in steps) {
    const key = _ as keyof Adapter;
    const step = steps[key] as InjectedFunction<any>;
    if (step.override) {
      result[key] = step.override;
    } else if (step.before || step.after) {
      const original = result[key] as (...args: any[]) => any | Promise<any>;
      result[key] = async (...args: any[]) => {
        if (step.before) {
          await step.before(...args);
        }
        const result = await original(...args);
        if (step.after) {
          await step.after(...args);
        }
        return result as any;
      };
    }
  }

  return result as Adapter;
};
