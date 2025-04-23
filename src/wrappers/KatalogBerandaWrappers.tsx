import { useEffect, useState } from "react";
import CardMesin from "../components/MesinCard";
import axios from "axios";
import { Machine } from "../types/type";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CatalogCategory() {
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/machine`, {
        headers: {
          "X-API-KEY": "iuy7tk8o6hjg5dews",
        },
      })
      .then((res) => {
        setMachines(res.data);
      });
  }, []);

  return (
    <section
      id="CatalogCategory"
      className="flex flex-col gap-[30px] mt-[100px]"
    >
      <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
        <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
          Kategori Mesin
        </h2>
        <a
          href="/produk"
          className="rounded-full py-3 px-5 bg-white font-bold shadow border"
        >
          Lihat Semua
        </a>
      </div>

      <div className="swiper w-full">
        <Swiper
          direction="horizontal"
          spaceBetween={20}
          slidesPerView="auto"
          slidesOffsetAfter={30}
          slidesOffsetBefore={30}
        >
          {machines.map((mesin) => (
            <SwiperSlide
              key={mesin.id}
              className="!w-[300px] first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]"
            >
              <CardMesin
                title={mesin.name}
                image={`${import.meta.env.VITE_API_URL}/storage/${
                  mesin.photo
                }`}
                slug={mesin.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
