import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  onClose: () => void;
}

const ProfileDropdown: React.FC<Props> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return createPortal(
    <>
      {/* Background hitam */}
      <div className="fixed inset-0 bg-black-opacity z-40" />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute top-15 right-40 z-50 w-72 bg-white rounded-lg shadow-xl p-5 animate-dropdown text-left"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
          <div>
            <p className="text-sm text-gray-500">
              {user.email || "user@email.com"}
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-3 text-[#000929] font-medium">
          <li>
            <a href="/profil">Profil Saya</a>
          </li>
          <li>
            <a href="/profil/favorit">Barang Yang Disukai</a>
          </li>
          <li>
            <a href="/profil/riwayat-pembelian">Riwayat Pembelian Saya</a>
          </li>
          <li>
            <button
              className="text-left w-full"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Keluar
            </button>
          </li>
        </ul>
      </div>
    </>,
    document.body
  );
};

export default ProfileDropdown;
