import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

let products = [];

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:3001/products");
    products = response.data;
  } catch (error) {
    console.error("Error fetching products from JSON Server:", error);
  }
};

fetchProducts();

setInterval(fetchProducts, 60000);

io.on("connection", (socket) => {
  socket.emit("products", products);

  socket.on("updatePrice", async (data) => {
    const product = products.find((p) => p.id === data.id);
    if (product && product.current_price < data.newPrice) {
      try {
        const response = await axios.put(
          `http://localhost:3001/products/${data.id}`,
          {
            ...product,
            current_price: data.newPrice,
            updated_date: new Date().toISOString(),
          }
        );
        const updatedProduct = response.data;
        products = products.map((p) => (p.id === data.id ? updatedProduct : p));
        io.emit("productUpdated", updatedProduct);
      } catch (error) {
        console.error("Error updating product price in JSON Server:", error);
        socket.emit("priceUpdateError", {
          message: "가격 업데이트 중 오류가 발생했습니다.",
        });
      }
    } else {
      socket.emit("priceUpdateError", {
        message: "현재가보다 낮은 가격은 입력할 수 없습니다.",
      });
    }
  });

  // socket.on("updateDeadline", (data) => {
  //   const product = products.find((p) => p.id === data.id);
  //   if (product) {
  //     product.deadline = new Date(data.newDeadline);
  //     io.emit("productUpdated", product);
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
