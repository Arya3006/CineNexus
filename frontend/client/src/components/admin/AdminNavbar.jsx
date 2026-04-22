import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
      
      <Link to="/admin" className="max-md:flex-1">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-primary">Cine</span>
          <span className="text-white">Nexus</span>
        </h1>
      </Link>

    </div>
  );
};

export default AdminNavbar;