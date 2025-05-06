import { Helmet } from "react-helmet";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

export default function Tentang() {
  return (
    <>
      <Helmet>
        <title>Tentang - CSI Online</title>
      </Helmet>
      <div className="w-full min-h-screen py-12 px-4">
        <div className="max-w-[1130px] mx-auto flex flex-col gap-10">
          {/* Judul */}
          <h2 className="text-3xl font-bold text-center">
            PT Crusher Spares Indonesia
          </h2>

          {/* Video */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/assets/video/Preview.mp4" type="video/mp4" />
              Browser Anda tidak mendukung video HTML5.
            </video>
          </div>

          {/* Tentang Perusahaan */}
          <div className="flex flex-col lg:flex-row items-start gap-10">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Tentang</h3>
              <p className="text-gray-700 text-left">
                Crusher Spares didirikan pada tahun 1985 oleh Steven Sim dan
                rekan untuk memberikan jasa di bidang industri tambang dan
                galian. Pada tahun 2017, Crusher Spares membuka cabang di
                Indonesia sebagai bagian dari ekspansi global perusahaan.
                Berfokus pada import dari China dengan standar kualitas dan
                reputasi manufaktur yang tinggi untuk memenuhi kebutuhan suku
                cadang yang lebih tahan lama.
                <br />
                <br />
                Dengan fasilitas warehouse dan kantor pusat yang berlokasi di
                Wingfield, Adelaide, Australia Selatan untuk mendukung technical
                support, penjualan dan pemasaran. Crusher Spares di
                masing-masing negara memiliki fasilitas warehouse dan kantor
                untuk mendukung ketersediaan barang dan jasa untuk memenuhi
                permintaan konsumen.
              </p>
            </div>
            <img
              src="/assets/images/photos/gudang.jpg"
              alt="Gudang"
              className="rounded-md max-h-[300px] object-cover outline-1"
            />
          </div>

          {/* Card Info */}
          <div className="flex flex-col lg:flex-row bg-white rounded-xl p-6 gap-8 shadow-md">
            <div className="flex-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.7211443493486!2d106.91389607572924!3d-6.294039511924277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d55035f1899%3A0xfa064269c3ffb61a!2sPT%20Crusher%20Spares%20Indonesia!5e0!3m2!1sen!2sid!4v1744273746256!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg w-full"
              ></iframe>
            </div>

            <div className="flex-1 flex flex-col gap-4 text-sm text-gray-800 text-left self-center">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <p>
                  Jl. Mawar Raya No.107, RT.001/RW.007, Jatirahayu, Kec. Pd.
                  Melati <br />
                  Kota Bekasi, Jawa Barat, Indonesia
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p>
                  Hari Kerja <br /> 9.00 AM – 5.00 PM
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <p>+62 21-8499-2330</p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <p>pt.crushersparesindonesia@gmail.com</p>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-4 pt-10">
                <a
                  href="https://www.facebook.com/CrusherSparesIndo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 text-3xl"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/crusherspares_indonesia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 text-3xl"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/6281947139720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-500 text-3xl"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
