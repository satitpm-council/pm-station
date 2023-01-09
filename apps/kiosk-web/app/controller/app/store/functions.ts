import { controllerStore } from "./store";

export const toggleShowBottomSheet = () => {
  controllerStore.setState((s) => ({
    ...s,
    showBottomSheet: !s.showBottomSheet,
  }));
};
