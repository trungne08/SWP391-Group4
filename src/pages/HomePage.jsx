import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to BabyCare Center</h1>
      <p className="text-lg text-gray-700 mt-4 max-w-xl">
        Chăm sóc mẹ bầu và em bé tốt nhất! Hãy khám phá dịch vụ của chúng tôi.
      </p>
      <div className="mt-6">
        <Link to="/about">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Khám phá ngay
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
