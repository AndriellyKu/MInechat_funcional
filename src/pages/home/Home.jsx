import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/dirtquedirt.png';

function Home() {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeSala, setNomeSala] = useState('');
  const [senhaSala, setSenhaSala] = useState('');
  const [comSenha, setComSenha] = useState(false);

  const fetchSalas = async () => {
    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const idUser = localStorage.getItem('idUser');

    if (!token || !nick || !idUser) {
      setError('Usuário não autenticado');
      console.error('Token, nick ou idUser ausente:', { token, nick, idUser });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://chat-api-ki8f.onrender.com/salas', {
        method: 'GET',
        headers: { token, nick, id: idUser },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Salas carregadas:', data);
        setSalas(data.map(sala => ({ ...sala, isListed: true }))); // Inicializa as salas como visíveis
      } else {
        setError('Erro ao carregar as salas');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const entrarNaSala = async (salaId) => {
    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const idUser = localStorage.getItem('idUser');
  
    if (!token || !nick || !idUser) {
      setError('Usuário não autenticado');
      return;
    }
  
    try {
      const response = await fetch(`https://chat-api-ki8f.onrender.com/salas/entrar?idsala=${salaId}`, {
        method: 'PUT',
        headers: {
          'token': token,
          'nick': nick,
          'id': idUser,
        },
      });
  
      if (response.ok) {
        navigate(`/sala/${salaId}`);
      } else {
        setError('Erro ao entrar na sala');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error(err);
    }
  };

  const criarSala = async () => {
    if (!nomeSala) {
      setError('Nome da sala é obrigatório');
      return;
    }

    if (comSenha && !senhaSala) {
      setError('A senha é obrigatória para salas privadas');
      return;
    }

    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const idUser = localStorage.getItem('idUser'); // Usando idUser

    try {
      const url = 'https://chat-api-ki8f.onrender.com/salas/criar';
      const headers = {
        token,
        nick,
        id: idUser, // Usando idUser
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = comSenha
        ? new URLSearchParams({ nome: nomeSala, senha: senhaSala }).toString()
        : new URLSearchParams({ nome: nomeSala }).toString();

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sala criada com sucesso:', data);
        fetchSalas();
        setModalVisible(false);  // Fechar o modal após a criação da sala
      } else {
        setError('Erro ao criar a sala');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error(err);
    }
  };

  // Função para simular a exclusão da sala (não listada)
  const toggleSalaVisibility = (salaId) => {
    setSalas(prevSalas =>
      prevSalas.map(sala =>
        sala._id === salaId ? { ...sala, isListed: false } : sala
      )
    );
  };

  return (
    <div className='contWord' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container">
        <div className="header">
          <h1>Selecione a Sala</h1>
        </div>

        {loading && <p>Carregando salas...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="worldList">
          {salas.length > 0 ? (
            salas.filter(sala => sala.isListed).map((sala) => (
              <div key={sala._id} className="worldItem">
                <img src="https://cdn.pixabay.com/photo/2016/11/11/14/49/minecraft-1816996_960_720.png" alt={sala.nome} />
                <div className="world-info" onClick={() => entrarNaSala(sala._id)}>
                  <p>{sala.nome}</p>
                  <span>Modo: {sala.tipo}, Criada em: {new Date(sala.data_criacao).toLocaleDateString()}</span>
                </div>
                <button onClick={() => toggleSalaVisibility(sala._id)} className="delete-btn">
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p>Não há salas disponíveis</p>
          )}
        </div>

        <div className="buttons">
          <button onClick={() => setModalVisible(true)}>Criar Sala</button>
          <button onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </div>

      {/* Modal de Criação de Sala */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Criar Nova Sala</h2>
            <input
              type="text"
              value={nomeSala}
              onChange={(e) => setNomeSala(e.target.value)}
              placeholder="Nome da Sala"
            />
            <div className="password-option">
              <label>
                <input
                  type="checkbox"
                  checked={comSenha}
                  onChange={() => setComSenha(!comSenha)}
                />
                Sala com senha
              </label>
              {comSenha && (
                <input
                  type="password"
                  value={senhaSala}
                  onChange={(e) => setSenhaSala(e.target.value)}
                  placeholder="Senha"
                />
              )}
            </div>
            <div className="modal-buttons">
              <button onClick={criarSala}>Criar Sala</button>
              <button onClick={() => setModalVisible(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
