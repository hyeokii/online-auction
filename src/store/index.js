import { create } from "zustand";

// 상태와 액션 정의
const useStore = create((set) => ({
  users: [],
  products: [],

  // 사용자 관련 액션
  fetchUsers: async () => {
    const response = await fetch("http://localhost:3001/users");
    const data = await response.json();
    set({ users: data });
  },
  addUser: async (user) => {
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const newUser = await response.json();
    set((state) => ({ users: [...state.users, newUser] }));
  },
  removeUser: async (userId) => {
    await fetch(`http://localhost:3001/users/${userId}`, {
      method: "DELETE",
    });
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    }));
  },

  // 상품 관련 액션

  addProduct: async (product) => {
    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const newProduct = await response.json();
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  removeProduct: async (productId) => {
    await fetch(`http://localhost:3001/products/${productId}`, {
      method: "DELETE",
    });
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },
}));

export default useStore;
