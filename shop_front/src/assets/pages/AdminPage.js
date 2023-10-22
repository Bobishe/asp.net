import '../styles/global.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [article, setArticle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Проверка авторизации при загрузке компонента и каждую секунду
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.reload();
      }
    };

    const intervalId = setInterval(checkAuthentication, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: name,
      article: article,
      category: category,
      description: description,
      price: price,
      image: image
    };

    fetch('http://localhost:5297/admin/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        setSuccessMessage(result.message);
        setImagePath(data.image);
        setName('');
        setArticle('');
        setCategory('');
        setDescription('');
        setPrice('');
        setImage('');
        setImagePreview('');
        window.alert('Товар добавлен'); 
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="contained">
      <h1 style={{ marginTop: '150px' }}>Добавить товар</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span className="required">Название</span>
          <input style={{ width: '100%' }} type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          <span className="required">Артикул</span>
          <input style={{ width: '100%' }} type="number" value={article} onChange={(e) => setArticle(e.target.value)} />
        </label>
        <label>
          <span className="required">Категория</span>
          <input style={{ width: '100%' }} type="number" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label>
          <span className="required">Описание</span>
          <input style={{ width: '100%' }} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          <span className="required">Стоимость</span>
          <input style={{ width: '100%' }} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          <span className="required">Изображение (Ссылкой на картинку в интернете)</span>
          <input style={{ width: '100%' }} type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <input type="submit" value="Сохранить" />
      </form>
    </div>
  );
};

export default AdminPage;
