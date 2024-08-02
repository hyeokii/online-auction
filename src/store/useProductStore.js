// src/store/useProductStore.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    const response = await fetch("http://localhost:3001/products");
    const data = await response.json();
    set({ users: data });
  },

  fetchDetailProduct: async (id) => {
    const response = await fetch(`http://localhost:3001/products/${id}`);
    return await response.json();
  },

  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    })),

  updateProductPrice: async (id, newPrice) => {
    const response = await fetch(`http://localhost:3001/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_price: newPrice }),
    });
    const updatedProduct = await response.json();
    set((state) => ({
      products: state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    }));
    return updatedProduct;
  },
}));

export default useProductStore;
