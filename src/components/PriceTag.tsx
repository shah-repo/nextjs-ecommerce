import { formatCurrency } from "@/lib/db/format";
import React from "react";

interface PriceTagProps {
  price: Number;
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, className }) => {
  return (
    <span className={`badge badge-md ${className}`}>
      {formatCurrency(price)}
    </span>
  );
};

export default PriceTag;
