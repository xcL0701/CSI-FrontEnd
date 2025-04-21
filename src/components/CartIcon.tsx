interface CartIconProps {
  count: number;
}

export default function CartIcon({ count }: CartIconProps) {
  return (
    <div className="relative">
      <svg
        className="w-8 h-8 text-gray-700"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5H18M7 13L5.4 5M17 17a2 2 0 11-4 0 2 2 0 014 0zM7 17a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
