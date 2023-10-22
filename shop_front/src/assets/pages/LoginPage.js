import React from 'react';
import '../styles/login.css';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className='container'>
      <div className='login_form'>
      <h2>Войти</h2>
      <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;