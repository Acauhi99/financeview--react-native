import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

export const useScreenFocus = (callback, dependencies = []) => {
  const savedCallback = useRef(callback);

  useFocusEffect(
    useCallback(() => {
      savedCallback.current = callback;
      savedCallback.current();

      return () => {};
    }, dependencies)
  );
};
