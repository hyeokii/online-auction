import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../store/useProductStore";
import { io } from "socket.io-client";
import TimeLeft from "./TimeLeft";
const socket = io("http://localhost:3000");

const ProductDetail = () => {
  const { productId } = useParams();
  const { setProducts, updateProduct, fetchDetailProduct } = useProductStore();
  const [product, setProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("products", (initialProducts) => {
      setProducts(initialProducts);
    });

    socket.on("productUpdated", (updatedProduct) => {
      updateProduct(updatedProduct);
      if (updatedProduct.id === productId) {
        setProduct(updatedProduct);
      }
    });

    socket.on("priceUpdateError", (error) => {
      setErrorMessage(error.message);
    });

    return () => {
      socket.off("products");
      socket.off("productUpdated");
      socket.off("priceUpdateError");
    };
  }, [setProducts, updateProduct, productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchDetailProduct(productId);
      setProduct(data);
    };

    fetchProduct();
  }, [productId, fetchDetailProduct]);

  const handlePriceUpdate = () => {
    socket.emit("updatePrice", {
      id: product.id,
      newPrice: parseFloat(newPrice),
    });
    setNewPrice("");
    setErrorMessage("");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="flex justify-center min-h-screen">
      <div className="px-20 py-10 min-w-[1200px]">
        <div className="text-6xl font-bold mb-4 border-b border-b-black p-4">
          {product.item_name}
        </div>

        <div>
          <div className=" pt-20 flex gap-10">
            <div className="flex-1 border border-gray-500 flex justify-center items-center max-w-[600px]">
              <img src={product.image} alt="product_img" />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[36px] font-bold">
                  현재가: {product.current_price.toLocaleString()}원
                </p>
                <p className="text-[24px] font-bold w-[360px] pb-10">
                  {product.description}
                </p>
                <div className="flex gap-4 text-[18px] pb-3">
                  <div className="w-[82px]">남은 시간</div>
                  <div>
                    <TimeLeft deadline={product.deadline} detail={true} />
                    <div>({new Date(product.deadline).toLocaleString()})</div>
                  </div>
                </div>

                <div className="flex gap-4 text-[18px] pb-3">
                  <span className="w-[82px]">시작가</span>
                  <div>{product.start_price.toLocaleString()}원</div>
                </div>
                <div className="flex gap-4 text-[18px] pb-3 ">
                  <span className="w-[82px]">최근 입찰</span>
                  <div>{new Date(product.updated_date).toLocaleString()}</div>
                </div>
              </div>
              <div className="mb-4 pt-10">
                {new Date(product.deadline) <= new Date() ? (
                  <div className="text-red-600 font-bold text-2xl pb-4">
                    경매 마감
                  </div>
                ) : (
                  <></>
                )}
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="가격"
                  className="p-2 border rounded w-full"
                  disabled={new Date(product.deadline) <= new Date()}
                />
                <button
                  onClick={handlePriceUpdate}
                  className="w-full mt-2 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                  disabled={new Date(product.deadline) <= new Date()}
                >
                  입찰하기
                </button>
                {errorMessage && (
                  <div className="mt-2 p-2 bg-red-200 text-red-800 rounded">
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="flex justify-end ">
                <button
                  onClick={() => navigate("/")}
                  className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 "
                >
                  뒤로가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
