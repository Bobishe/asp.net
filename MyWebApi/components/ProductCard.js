import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="wrapper">
      <div className="product-img">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <div className="product-text">
          <h1>{product.name}</h1>
          <h2>{product.category}</h2>
          <p>{product.description}</p>
        </div>
        <div className="product-price-btn">
          <p>
            <span>{product.price}</span>$
          </p>
          <button type="button">buy now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
