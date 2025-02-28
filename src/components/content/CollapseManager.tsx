import React from "react";

const CollapseContext = React.createContext<
  | [
      Record<string, boolean>,
      React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    ]
  | undefined
>(undefined);

const localStorageKey = "D2SeasonPassWayBack-CollapseMenu";

const readLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey) ?? "{}") as Record<
      string,
      boolean
    >;
  } catch {
    return {};
  }
};

export const CollapseManager = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const state = React.useState<Record<string, boolean>>(readLocalStorage);

  return (
    <CollapseContext.Provider value={state}>
      {children}
    </CollapseContext.Provider>
  );
};

const updateLocalStorage = (state: Record<string, boolean>) => {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
};

export const useCollapse = (
  id: string
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const state = React.useContext(CollapseContext);
  if (!state) {
    throw new Error("useIsCollapsed must be used within a CollapseManager");
  }
  const [currState, setState] = state;

  const isCollapsed = currState[id] ?? false;
  const setIsCollapsed = (value: React.SetStateAction<boolean>) => {
    const newValue = typeof value === "function" ? value(isCollapsed) : value;

    setState((prev) => {
      const newState = {
        ...prev,
        [id]: newValue
      };
      updateLocalStorage(newState);
      return newState;
    });
  };

  return [isCollapsed, setIsCollapsed];
};
