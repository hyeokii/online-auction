import { useEffect } from "react";
import io from "socket.io-client";
import "react-datepicker/dist/react-datepicker.css";
import useProductStore from "../store/useProductStore";
import Product from "./Product";

const socket = io("http://localhost:3000");

function App() {
  const { products, setProducts, updateProduct, fetchProducts } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
    socket.on("products", (initialProducts) => {
      setProducts(initialProducts);
    });

    socket.on("productUpdated", (updatedProduct) => {
      updateProduct(updatedProduct);
    });

    return () => {
      socket.off("products");
      socket.off("productUpdated");
    };
  }, [fetchProducts, setProducts, updateProduct]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ul className=" flex gap-8 flex-wrap">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}

export default App;
