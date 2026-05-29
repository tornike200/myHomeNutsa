import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-white border-b border-[#DBDBDB]">
      <div className="max-w-[1920px] px-[162px] py-[38px]">
        <Link to="/">
          <svg width="150" height="24" viewBox="0 0 150 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="20" fontFamily="FiraGO, sans-serif" fontWeight="700" fontSize="22" fill="#F93B1D" letterSpacing="1">
              REDBERRY
            </text>
          </svg>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;