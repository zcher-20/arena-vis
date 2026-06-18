"use client";

import { createContext, useContext, useState } from "react";

const SelectorContext = createContext<{
  selectorOpen: boolean;
  setSelectorOpen: (open: boolean) => void;
}>({ selectorOpen: false, setSelectorOpen: () => {} });

export function useSelectorOpen() {
  return useContext(SelectorContext);
}

export default function SelectorProvider({ children }: { children: React.ReactNode }) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <SelectorContext.Provider value={{ selectorOpen, setSelectorOpen }}>
      {children}
    </SelectorContext.Provider>
  );
}
