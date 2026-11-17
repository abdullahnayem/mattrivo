"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { DEFAULT_SIZE, getProduct, type SizeId } from "@/data/products";

export type CartLine = { productId: string; size: SizeId; qty: number };
export type Toast = { id: number; title: string; body?: string; action?: { label: string; onClick: () => void } };
export type Panel = null | "cart" | "wishlist" | "search" | "menu" | "account" | "compare" | "checkout";

type State = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  panel: Panel;
  quickView: { productId: string; size?: SizeId } | null;
  toasts: Toast[];
  hydrated: boolean;
};

type Action =
  | { type: "hydrate"; payload: Partial<Pick<State, "cart" | "wishlist" | "compare">> }
  | { type: "add"; productId: string; size: SizeId; qty: number }
  | { type: "setQty"; productId: string; size: SizeId; qty: number }
  | { type: "remove"; productId: string; size: SizeId }
  | { type: "toggleWish"; productId: string }
  | { type: "toggleCompare"; productId: string }
  | { type: "clearCompare" }
  | { type: "panel"; panel: Panel }
  | { type: "quickView"; value: State["quickView"] }
  | { type: "toast"; toast: Toast }
  | { type: "dismissToast"; id: number };

export const MAX_COMPARE = 3;
const STORAGE_KEY = "mattrivo:store:v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, hydrated: true };
    case "add": {
      const existing = state.cart.find((l) => l.productId === action.productId && l.size === action.size);
      const cart = existing
        ? state.cart.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + action.qty) } : l))
        : [...state.cart, { productId: action.productId, size: action.size, qty: action.qty }];
      return { ...state, cart };
    }
    case "setQty":
      return {
        ...state,
        cart: state.cart
          .map((l) =>
            l.productId === action.productId && l.size === action.size ? { ...l, qty: Math.max(0, Math.min(10, action.qty)) } : l,
          )
          .filter((l) => l.qty > 0),
      };
    case "remove":
      return { ...state, cart: state.cart.filter((l) => !(l.productId === action.productId && l.size === action.size)) };
    case "toggleWish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.productId)
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    case "toggleCompare": {
      if (state.compare.includes(action.productId))
        return { ...state, compare: state.compare.filter((id) => id !== action.productId) };
      if (state.compare.length >= MAX_COMPARE) return state;
      return { ...state, compare: [...state.compare, action.productId] };
    }
    case "clearCompare":
      return { ...state, compare: [] };
    case "panel":
      return { ...state, panel: action.panel };
    case "quickView":
      return { ...state, quickView: action.value };
    case "toast":
      return { ...state, toasts: [...state.toasts.slice(-2), action.toast] };
    case "dismissToast":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
  }
}

type StoreValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
  notify: (toast: Omit<Toast, "id">) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: [],
    wishlist: [],
    compare: [],
    panel: null,
    quickView: null,
    toasts: [],
    hydrated: false,
  });
  const toastId = useRef(0);

  useEffect(() => {
    let payload: Partial<State> = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        payload = {
          cart: Array.isArray(parsed.cart) ? parsed.cart.filter((l: CartLine) => getProduct(l.productId)) : [],
          wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist.filter((id: string) => getProduct(id)) : [],
          compare: Array.isArray(parsed.compare) ? parsed.compare.filter((id: string) => getProduct(id)) : [],
        };
      }
    } catch {
      /* storage unavailable: start empty */
    }
    dispatch({ type: "hydrate", payload });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart: state.cart, wishlist: state.wishlist, compare: state.compare }),
      );
    } catch {
      /* ignore */
    }
  }, [state.cart, state.wishlist, state.compare, state.hydrated]);

  // Lock page scroll while a full panel is open.
  useEffect(() => {
    const locked = state.panel !== null && state.panel !== "search" ? true : state.quickView !== null;
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [state.panel, state.quickView]);

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    dispatch({ type: "toast", toast: { ...toast, id } });
    window.setTimeout(() => dispatch({ type: "dismissToast", id }), 4200);
  }, []);

  const value = useMemo(() => ({ state, dispatch, notify }), [state, notify]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function useUI() {
  const { state, dispatch, notify } = useStore();
  return {
    panel: state.panel,
    open: (panel: Panel) => dispatch({ type: "panel", panel }),
    close: () => dispatch({ type: "panel", panel: null }),
    quickView: state.quickView,
    openQuickView: (productId: string, size?: SizeId) => dispatch({ type: "quickView", value: { productId, size } }),
    closeQuickView: () => dispatch({ type: "quickView", value: null }),
    toasts: state.toasts,
    dismissToast: (id: number) => dispatch({ type: "dismissToast", id }),
    notify,
  };
}

export { DEFAULT_SIZE };
