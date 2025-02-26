"use client";

import { createContext, useCallback, useContext, useState } from "react";

const colorPalette = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-teal-500",
  "from-green-500 to-yellow-500",
  "from-red-500 to-orange-500",
  "from-indigo-500 to-purple-500",
];

const ColorContext = createContext<
  ((index: number) => (typeof colorPalette)[number]) | null
>(null);

export const useColor = (index: number) => {
  const ctx = useContext(ColorContext);
  if (!ctx) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return ctx(index);
};

export const ColorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [seed] = useState(() =>
    Math.floor(Math.random() * colorPalette.length)
  );

  const getColor = useCallback(
    (idx: number) => colorPalette[(idx + seed) % colorPalette.length],
    [seed]
  );

  return (
    <ColorContext.Provider value={getColor}>{children}</ColorContext.Provider>
  );
};
