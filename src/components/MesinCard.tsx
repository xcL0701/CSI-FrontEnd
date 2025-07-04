import { Link } from "react-router-dom";

export default function CardMesin({ title, image, slug }: any) {
  return (
    <Link to={`/produk?mesin=${slug}`}>
      <div className="rounded-2xl bg-white p-4 shadow-md w-full h-full flex flex-col items-center justify-between text-center">
        <img
          src={image}
          alt={title}
          className="w-full  max-h-[300px] object-cover"
        />
        <div className="p-4 font-semibold text-lg">{title}</div>
      </div>
    </Link>
  );
}
