import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password
        };

        fetch('http://localhost:5297/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {

                localStorage.setItem('token', result.token);

                setIsAuthenticated(true);

                navigate('/admin'); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className='login-form'>
            <div>
                <label className="label-email">
                    <input type="email" id="email" name="email" className="text" placeholder="Email" tabindex="1" required onChange={(e) => setEmail(e.target.value)} />
                    <span className="required">Email</span>
                </label>
            </div>

            <div>
                <label className="label-password">
                    <input type="password" id="password" value={password} className="text" name="password" placeholder="Password" tabindex="2" required onChange={(e) => setPassword(e.target.value)} />
                    <span className="required">Password</span>
                </label>
            </div>
            <input type="submit" value="Войти" />
        </form>
    );
};

export default LoginForm;
