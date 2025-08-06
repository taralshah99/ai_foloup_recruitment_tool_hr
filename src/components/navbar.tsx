import Link from "next/link";
import React from "react";
import logo  from '../../public/techify.ico'
import Image from "next/image";

function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 bg-slate-100  z-[10] h-fit  py-4 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center">
        <Image src={logo}   alt="Techify Logo" className="h-10  w-auto" />
        </div>
        <div className="flex items-center">
          {/* Placeholder for the removed UserButton */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
