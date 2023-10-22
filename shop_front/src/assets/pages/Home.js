import '../styles/global.css';
import ProductCard from "../components/ProductCard";
import React, { useEffect, useState } from 'react';

function Home() {
    const [products, setProducts] = useState([]);
    const [showHeader, setShowHeader] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5297/")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isMobile]);

    const handleScroll = () => {
        if (isMobile) {
            return;
        }

        const scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollHeight > window.innerHeight) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }

        const scroll = window.pageYOffset || document.documentElement.scrollTop;
        const zoomImg = document.querySelectorAll(".zoom-me img");
        const mainText = document.querySelector(".main_text");

        for (let i = 0; i < zoomImg.length; i++) {
            zoomImg[i].style.width = (100 + scroll / 5) + "%";
            zoomImg[i].style.top = -(scroll / 10) + "%";
            zoomImg[i].style.webkitFilter = "blur(" + (scroll / 200) + "px)";
            zoomImg[i].style.filter = "blur(" + (scroll / 200) + "px)";
        }

        mainText.style.fontSize = (70 + scroll / 40) + "px";
        mainText.style.top = (20 + scroll / 14) + "%";
    };

    return (
        <div className='main_top'>
            <header className={`zoom-me ${isMobile ? 'disabled' : ''}`}>
                <img className="fon_img" src="img/fon1.png" alt="Фоновое изображение" />
                <h1 className="main_text">Магазин лучшей мебели</h1>
            </header>
            <main role="main">
                <div className="contained">
                    <section>
                        <h1>Наши новинки!</h1>
                        <div className="cards">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                    <section>
                        <h1>Немного о нас</h1>
                        <p>Sint nisi eiusmod pariatur elit eiusmod mollit. Ex elit pariatur laboris voluptate mollit laboris nostrud ut amet velit excepteur ad eiusmod.
                            Occaecat aliqua consectetur velit duis aliqua pariatur. Irure consectetur voluptate aliquip commodo consectetur sit eu dolore
                            cupidatat duis consectetur in reprehenderit labore. Veniam enim sit culpa mollit irure laborum occaecat ea.</p>
                        <p>Cupidatat excepteur fugiat enim culpa in ut nostrud in cupidatat. Sint exercitation ex dolor eu. Esse est reprehenderit reprehenderit reprehenderit
                            Lorem non magna nulla aliqua occaecat commodo magna. Nulla officia cupidatat in nostrud do labore ea anim pariatur anim nostrud. Ea sint et est magna magna
                            sunt amet ad cupidatat.
                            Quis excepteur id cupidatat veniam laboris in ipsum quis cupidatat qui consequat occaecat. Enim sint culpa nostrud mollit consectetur ut enim anim. In id sint
                            consequat enim tempor non incididunt amet labore sunt.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Home;
