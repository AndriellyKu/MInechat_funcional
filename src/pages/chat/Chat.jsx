import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importando o useParams
import './Chat.css';

function Chat() {
  const { salaId } = useParams(); // Pegando o salaId da URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Requisição para carregar as mensagens com base no salaId
  useEffect(() => {
    fetchMessages();
  }, [salaId]); // Quando o salaId mudar, recarrega as mensagens

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const userId = localStorage.getItem('idUser');

    if (!token || !nick || !userId) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      const response = await fetch(`https://chat-api-ki8f.onrender.com/salas/mensagens?idSala=${salaId}`, {
        method: 'GET',
        headers: {
          'token': token,
          'nick': nick,
          'id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        console.log('Dados da sala:', data); // Log para checar os dados da sala
      } else {
        console.error('Erro ao carregar mensagens');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage) return;

    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const userId = localStorage.getItem('idUser');

    try {
      const response = await fetch(`https://chat-api-ki8f.onrender.com/salas/mensagens?idSala=${salaId}`, {
        method: 'POST',
        headers: {
          'token': token,
          'nick': nick,
          'id': userId,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ message: newMessage }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.mensagemSalva]);
        setNewMessage('');
      } else {
        console.error('Erro ao enviar mensagem');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  };

  const leaveRoom = async () => {
    const token = localStorage.getItem('token');
    const nick = localStorage.getItem('nick');
    const userId = localStorage.getItem('idUser');

    try {
      const response = await fetch('https://chat-api-ki8f.onrender.com/salas/sair', {
        method: 'PATCH',
        headers: {
          'token': token,
          'nick': nick,
          'id': userId,
        },
      });

      if (response.ok) {
        console.log('Saiu da sala');
      } else {
        console.error('Erro ao sair da sala');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  };

  return (
    <div className="new-container">
      <div className="new-chat-wrapper">
        <div className="new-chat-card">
          <div className="new-chat-header">
            <div className="new-chat-info">
              <h4>Chat Room</h4>
              <p>{messages.length} mensagens</p>
            </div>
            <button 
              className="new-menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              &#8942;
            </button>
            {isMenuOpen && (
              <div className="new-action-menu">
                <ul>
                  <li onClick={leaveRoom}>Sair da sala</li>
                </ul>
              </div>
            )}
          </div>

          <div className="new-chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.usuario === localStorage.getItem('nick')
                    ? 'new-message new-message-sent'
                    : 'new-message new-message-received'
                }
              >
                <div className="new-message-content">
                  {msg.content}
                  <span className="new-message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}, Hoje
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="new-chat-footer">
            <textarea
              className="new-message-input"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button className="new-send-button" onClick={sendMessage}>
              &#9658;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
