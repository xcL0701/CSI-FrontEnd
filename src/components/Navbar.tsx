import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { user, token } = useAuth();
  const { cart } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <nav className="bg-white z-50 border-b border-gray-200">
      <div className="flex items-center justify-between w-full max-w-[1130px] py-4 px-4 mx-auto">
        {/* Logo */}
        <a href="/">
          <img
            src="/assets/images/logos/logont.png"
            alt="logo"
            className="h-8"
          />
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10">
          <li>
            <a href="/">Beranda</a>
          </li>
          <li>
            <a href="/produk">Produk</a>
          </li>
          <li>
            <a href="/tentang">Tentang</a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {token && user ? (
            <>
              {/* Keranjang */}
              <a
                href="/keranjang"
                className="relative flex items-center gap-2 rounded-full border border-[#000929] py-2 px-4 h-10"
              >
                <MdOutlineShoppingCart className="size-6" />
                <span className="font-semibold">Keranjang</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>

              {/* Profil */}
              <div className="relative">
                <div
                  onClick={() => setShowProfileMenu(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#000929]">
                    <img
                      src="/assets/images/photos/photo-1.png"
                      alt="User"
                      className="w-full"
                    />
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>

                {showProfileMenu && (
                  <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
                )}
              </div>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="border border-[#000929] py-2 px-4 rounded-md font-semibold"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="border border-[#000929] py-2 px-4 rounded-md font-semibold"
              >
                Daftar
              </a>
            </>
          )}
        </div>

        {/* Hamburger - Mobile */}
        <div className="md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-gray-200">
          <ul className="flex flex-col gap-3 font-medium text-[#000929]">
            <li>
              <a href="/">Beranda</a>
            </li>
            <li>
              <a href="/produk">Produk</a>
            </li>
            <li>
              <a href="/tentang">Tentang</a>
            </li>
          </ul>

          {token && user ? (
            <div className="mt-6">
              {/* Info User */}
              <div className="flex items-center gap-3 mb-3 self-center justify-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#000929]">
                  <img
                    src="/assets/images/photos/photo-1.png"
                    alt="User"
                    className="w-full"
                  />
                </div>
                <span className="font-semibold">{user.name}</span>
              </div>

              {/* Menu Profil */}
              <ul className="ml-4 flex flex-col gap-3 text-[#000929] font-medium">
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
                    className="text-left text-red-500 hover:underline"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Keluar
                  </button>
                </li>
              </ul>

              {/* Keranjang */}
              <div className="mt-4 place-self-center">
                <a
                  href="/keranjang"
                  className="flex items-center gap-2 border border-[#000929] py-2 px-4 rounded-full w-fit"
                >
                  <MdOutlineShoppingCart className="size-6" />
                  <span>Keranjang</span>
                  {cartCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/login"
                className="border border-[#000929] py-2 px-4 rounded-md text-center font-semibold"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="border border-[#000929] py-2 px-4 rounded-md text-center font-semibold"
              >
                Daftar
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
