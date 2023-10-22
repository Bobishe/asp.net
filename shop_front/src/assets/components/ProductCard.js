import React from "react";
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="card">
            <div className="card__top">
                <Link to={`/catalog/${product.id}`} className="card__image">
                    <img src={product.image} alt="img" />
                </Link>
                <div className="card__label">New!</div>
            </div>
            <div className="card__bottom">
                <Link to={`/catalog/${product.id}`} className="card__title">
                    {product.name}
                </Link>
                <div className="card__prices">
                    <div className="card__price">Цена: {product.price}</div>
                </div>
            </div>
            <Link to={`/catalog/${product.id}`} className="card__add">
                Подробнее...
            </Link>
        </div>
    );
};

export default ProductCard;
