
import { Link } from "react-router-dom";
const Header = () => {

  return (
    <header className="bg-blue-600 text-white fixed top-0 w-full shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link to="/">My Website</Link>
        </h1>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </nav>

  
    </header>
  );
};

export default Header;
