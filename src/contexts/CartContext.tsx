import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/type";

interface CartItems {
  id: number;
  product: Product;
  slug: string;
  name: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItems[];
  fetchCartItems: () => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  removeFromCart: (cartId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItems[]>([]);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      setCart(
        data.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          slug: item.product.slug,
          name: item.product.name,
          product: item.product,
        }))
      );
    } catch (err) {
      console.error("Gagal mengambil data keranjang:", err);
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update-item/${cartId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Api-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      fetchCartItems(); // refresh cart after update
    } catch (err) {
      console.error("Gagal update jumlah barang:", err);
    }
  };

  const removeFromCart = async (cartId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove-item/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Api-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      fetchCartItems(); // refresh cart after delete
    } catch (err) {
      console.error("Gagal menghapus barang dari keranjang:", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCartItems,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return context;
};
