import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Grid 3 kolom */}
        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Kolom 1 - Logo & Alamat */}
          <div className="flex flex-col">
            <img
              src="/assets/images/logos/logont.png"
              alt="Logo"
              className="w-[80px] mb-4 text-center"
            />
            <div className="text-left">
              <h4 className="text-white font-semibold text-base mb-2">
                PT Crusher Spares Indonesia
              </h4>
              <p className="text-sm text-gray-400 max-w-[250px]">
                Jl. Mawar Raya No.107,
                <br />
                RT.001/RW.007,
                <br />
                Jatirahayu, Pondok Melati, Bekasi,
                <br />
                17414
              </p>
            </div>
          </div>

          {/* Kolom 2 - Navigasi */}
          <div className="flex justify-center items-start mt-6 self-center">
            <nav className="flex gap-15 text-sm text-gray-300">
              <a href="/" className="hover:underline">
                Beranda
              </a>
              <a href="/produk" className="hover:underline">
                Produk
              </a>
              <a href="/tentang" className="hover:underline">
                Tentang
              </a>
            </nav>
          </div>

          {/* Kolom 3 - Sosial Media */}
          <div className="flex flex-col items-end text-right mt-6 self-center">
            <h4 className="text-white font-semibold text-base mb-2">
              Ikuti Kami
            </h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a
                href="https://wa.me/6281947139720"
                className="hover:underline flex items-center gap-2"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href="https://www.instagram.com/crusherspares_indonesia/"
                className="hover:underline flex items-center gap-2"
              >
                <FaInstagram /> Instagram
              </a>
              <a
                href="https://www.facebook.com/CrusherSparesIndo"
                className="hover:underline flex items-center gap-2"
              >
                <FaFacebook /> Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center mt-8">
          &copy; {new Date().getFullYear()} PT Mesin Crusher. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
