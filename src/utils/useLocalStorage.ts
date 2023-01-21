import { useState } from "react";

const getStorageValue = (key: string): any => {
  const saved = localStorage.getItem(key);

  if (saved) {
    const value = JSON.parse(saved);
    return value;
  } else {
    return null;
  }
};

const useLocalStorage = (key: string): [any, (value: any) => void] => {
  const [value, _] = useState<any>(() => {
    return getStorageValue(key);
  });

  const setValue = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValue];
};

export default useLocalStorage;
