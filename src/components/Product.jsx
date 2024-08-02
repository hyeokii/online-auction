import { useNavigate } from "react-router-dom";
import TimeLeft from "./TimeLeft";
const Product = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/Product/${product.id}`);
  };

  return (
    <div onClick={handleClick} className=" bg-white w-[400px]">
      <div className="rounded border border-gray-300 w-full h-[300px] mb-4 flex justify-center items-center">
        <img src={product.image} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl">{product.item_name}</h2>
        <p className="text-3xl font-bold">{product.start_price}원</p>
        <div className="flex items-center">
          <div className="bg-no-repeat bg-center w-[30px] h-[30px] bg-[url('https://www.kobay.co.kr/kobay/images/common/icon_time.svg')]" />
          <TimeLeft deadline={product.deadline} detail={false} />
        </div>
      </div>
    </div>
  );
};

export default Product;
