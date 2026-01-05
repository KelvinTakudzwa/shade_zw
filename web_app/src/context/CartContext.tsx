import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Product {
    id: number;
    name: string;
    price: string;
    tag?: string;
    image_url: string;
}

interface CartContextType {
    items: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setItems(prev => [...prev, product]);
    };

    const removeFromCart = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, totalItems: items.length }}>
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
