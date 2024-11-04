import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartState {
    items: any[];
    addToCart: (item: any, quantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

export const useBearStore = create<CartState>()(
    devtools(
        persist(
            (set) => ({
                items: [],

                addToCart: (item, quantity) =>
                    set((state) => {
                        const existingItem = state.items.find((i) => i.id === item.id);

                        if (existingItem) {
                            return {
                                items: state.items.map((i) =>
                                    i.id === item.id ? { ...i, quantity: quantity + existingItem.quantity } : i,
                                ),
                            };
                        }
                        return { items: [...state.items, { ...item, quantity }] };
                    }),
                removeFromCart: (id) =>
                    set((state) => ({
                        items: state.items.filter((item) => item.id !== id),
                    })),
                clearCart: () => set({ items: [] }),
            }),
            { name: 'bearStore' },
        ),
    ),
);
