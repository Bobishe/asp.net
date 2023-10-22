import '../styles/global.css';
import ProductCard from "../components/ProductCard";
import React, { useEffect, useState } from 'react';

function Home() {
    const [products, setProducts] = useState([]);


    useEffect(() => {
        fetch("http://localhost:5297/catalog")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.log(error));
    }, []);


    return (

        <div>
            <main role="main">
                <div className="contained">
                    <section>
                        <h1>
                            Каталог
                        </h1>
                        <div class="cards">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                    </section>



                </div>
            </main>
        </div>
    );
}

export default Home;