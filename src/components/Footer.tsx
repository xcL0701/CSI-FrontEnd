import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Grid 3 kolom di desktop, kolom vertikal di mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Kolom 1 - Logo & Alamat */}
          <div>
            <img
              src="/assets/images/logos/logont.png"
              alt="Logo"
              className="w-[80px] my-4 justify-self-center"
            />
            <h4 className="font-semibold mb-1">PT Crusher Spares Indonesia</h4>
            <p className="text-gray-400 leading-relaxed">
              Jl. Mawar Raya No.107, RT.001/RW.007, Jatirahayu, Pondok Melati,
              Bekasi, 17414
            </p>
          </div>

          {/* Kolom 2 - Navigasi */}
          <div className="md:flex md:justify-center self-center">
            <nav className="flex flex-col md:flex-row gap-2 md:gap-6 text-gray-300">
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
          <div className="flex flex-col  mb-4 md:items-end self-center justify-self-center">
            <h4 className="font-semibold mb-2">Ikuti Kami</h4>
            <div className="flex gap-4 text-xl text-gray-300">
              <a
                href="https://wa.me/6281947139720"
                className="hover:text-white"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.instagram.com/crusherspares_indonesia/"
                className="hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/CrusherSparesIndo"
                className="hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebook />
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
