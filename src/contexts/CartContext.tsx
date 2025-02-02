import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(i => i.itemId === item.itemId);
            if (existingItem) {
                return currentItems.map(i =>
                    i.itemId === item.itemId ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...currentItems, { ...item, quantity }];
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setItems(currentItems => currentItems.filter(item => item.itemId !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.itemId === itemId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const value = React.useMemo(
        () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, total }),
        [items, addToCart, removeFromCart, updateQuantity, clearCart, total]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};