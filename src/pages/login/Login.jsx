import React, { useState } from 'react';
import './Login.css';
import MinechatLogo from "../../assets/Minechat.png";
import backgroundImage from '../../assets/wp65169849.jpg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!nick) {
      setError('Por favor, preencha o campo nome de usuário.');
      return;
    }

    try {
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        navigate('/home');
        return;
      }

      const response = await fetch('https://chat-api-ki8f.onrender.com/usuario/entrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ nick }).toString(),
      });

      if (response.ok) {
        const data = await response.json();

        if (data && data.token && data.idUser) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('nick', nick);
          localStorage.setItem('idUser', data.idUser); // Armazenar como idUser

          navigate('/home');
        } else {
          setError('Erro ao obter dados do login. Verifique a resposta da API.');
        }
      } else {
        setError('Erro no login! Verifique suas credenciais.');
      }
    } catch (error) {
      setError('Erro ao conectar-se ao servidor.');
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <section
      className='centro'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="signin">
        <div className="content">
          <img src={MinechatLogo} alt="Logo do Chat" className="logo" />
          <form className="form" onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}

            <div className="inputBox">
              <input
                type="text"
                required
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <i>Nome de Usuário</i>
            </div>

            <div className="links">
              <a href="#">Esqueceu a Senha?</a>
              <a href="#">Cadastre-se</a>
            </div>

            <div className="inputBox">
              <input type="submit" value="Entrar" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
