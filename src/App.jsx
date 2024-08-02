// import Users from "./components/Users";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />}></Route>
        <Route path="Product/:productId" element={<ProductDetail />}></Route>
      </Routes>
      {/* <Users /> */}
    </Router>
  );
}

export default App;
