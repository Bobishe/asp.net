import '../styles/ProductPage.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Home() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedArticle, setEditedArticle] = useState('');
    const [editedCategory, editEdCategory] = useState('');
    const [editedImage, EditedImage] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        fetch(`http://localhost:5297/catalog/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setEditedName(data.name);
                setEditedDescription(data.description);
                setEditedPrice(data.price);
                setEditedArticle(data.article);
                editEdCategory(data.category);
                EditedImage(data.image);
            })
            .catch((error) => console.log(error));

        // Проверка, авторизован ли пользователь
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [id]);


    useEffect(() => {
        // Проверка авторизации при загрузке компонента и каждую секунду
        const checkAuthentication = () => {
          const token = localStorage.getItem('token');
          if (!!token !== isLoggedIn) {
            window.location.reload();
          }
        };
    
        const intervalId = setInterval(checkAuthentication, 1000);
    
        return () => {
          clearInterval(intervalId);
        };
      }, [isLoggedIn]);
    

    const handleDelete = () => {
        fetch(`http://localhost:5297/catalog/delete/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.ok) {
                    setIsDeleted(true);
                    setIsAlertVisible(true);
                } else {
                    throw new Error('Ошибка удаления товара');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleEditSave = () => {
        const editedProduct = {
            name: editedName,
            description: editedDescription,
            price: editedPrice,
            article: editedArticle,
            category: editedCategory,
            image: editedImage
        };

        fetch(`http://localhost:5297/catalog/save/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedProduct)
        })
            .then((response) => {
                if (response.ok) {
                    window.alert('Изменения сохранены');
                    setIsEditMode(false);
                    setIsAlertVisible(false);
                    setProducts(editedProduct);
                } else {
                    throw new Error('Ошибка сохранения изменений');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        if (isDeleted) {
            window.alert('Товар удален');
            setIsAlertVisible(false);
            navigate('/catalog');
        }
    }, [isDeleted, navigate]);

    return (
        <div>
            <main role="main">
                <div className="contained">
                    <div className='card_item'>
                        <img src={`../${products.image}`} alt="Product" />
                        <div className='card_item--content'>
                            {isEditMode ? (
                                <>
                                    <div className='card_edit'>
                                        <label>
                                            <span className="required">Название</span>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />

                                        </label>

                                        <label>
                                            <span className="required">Цена</span>
                                            <input
                                                type="text"
                                                value={editedPrice}
                                                onCh
                                                ange={(e) => setEditedPrice(e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            <span className="required">Артикул</span>
                                            <input
                                                type="text"
                                                value={editedArticle}
                                                onCh
                                                ange={(e) => setEditedArticle(e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            <span className="required">Категория</span>
                                            <input
                                                type="text"
                                                value={editedCategory}
                                                onCh
                                                ange={(e) => editEdCategory(e.target.value)}
                                            />
                                        </label>


                                        <label>
                                            <span className="required">Картинка (Ссылкой из интернета)</span>
                                            <input
                                                type="text"
                                                value={editedImage}
                                                onCh
                                                ange={(e) => EditedImage(e.target.value)}
                                            />
                                        </label>

                                        <textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1>{products.name}</h1>
                                    <p>{products.description}</p>
                                    <h2>Цена: {products.price}</h2>
                                </>
                            )}

                            {isLoggedIn && !isEditMode && (
                                <button onClick={() => setIsEditMode(true)}>Редактировать</button>
                            )}

                            {isEditMode && (
                                <button onClick={handleEditSave}>Сохранить</button>
                            )}

                            {isLoggedIn && (
                                <button onClick={handleDelete}>Удалить</button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
