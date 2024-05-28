import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import deleteIcon from './trash.png';
import ABI from './contracts/TodoList';
import Loading from './Loading'; 

// Create a context for the todo list
const TodoListContext = createContext();

// TodoList component
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);
    }
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      if (isConnected && contract) {
        setLoading(true); // Start loading
        try {
          const todoList = await contract.getTodos();
          const processedTodos = todoList.map(([content, completed]) => ({ content, completed }));
          setTodos(processedTodos);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
        setLoading(false); // Stop loading
      }
    };

    fetchTodos();
  }, [isConnected, contract]);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const todoList = await contract.getTodos();
      const processedTodos = todoList.map(([content, completed]) => ({ content, completed }));
      setTodos(processedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setLoading(false);
  };

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signerInstance = await provider.getSigner();
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const instance = new ethers.Contract(contractAddress, ABI.abi, signerInstance);
      setSigner(signerInstance);
      setContract(instance);
      setAccount(accounts[0]);
      console.log(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectFromMetaMask = () => {
    setAccount('');
    setIsConnected(false);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      setLoading(true);
      console.log("Adding New Task");
      const tx = await contract.addTodo(newTodo);
      console.log(`Added: https://scan.test.btcs.network/tx/${tx.hash}`);
      fetchTodos();
      setLoading(false);
    }
  };

  const markAsCompleted = async (index) => {
    setLoading(true);
    const tx = await contract.markAsCompleted(index);
    console.log(`Marked as completed: https://scan.test.btcs.network/tx/${tx.hash}`);
    fetchTodos();
    setLoading(false);
  };

  const deleteTodo = async (index) => {
    setLoading(true);
    const tx = await contract.deleteTodo(index);
    console.log(`Deleted: https://scan.test.btcs.network/tx/${tx.hash}`);
    fetchTodos();
    setLoading(false);
  };

  return (
    <TodoListContext.Provider value={{ todos, addTodo, markAsCompleted, deleteTodo, newTodo, setNewTodo }}>
      {loading && <Loading />} {/* Display loading animation if loading */}
      <div className="metamask-buttons">
            {isConnected ? (
              <button className="metamask-disconnect" onClick={disconnectFromMetaMask}>
                Disconnect MetaMask
              </button>
            ) : (
              <button className="metamask-connect" onClick={connectToMetaMask}>
                Connect to MetaMask
              </button>
            )}
          </div>        
      <div className="notebook">
          <div className="notebook-cover">
          <h1 className="notebook-title">My Todo List</h1>
        </div>
        <div className="notebook-pages">
          <div className="todo-input">
            <textarea
              className="todo-input-field"
              placeholder="Add a new note..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button className="todo-add-button" onClick={addTodo}>
              Add
            </button>
          </div>
          <ul className="todo-list">
            {todos.map((todo, index) => (
              <li key={index} className="todo-item">
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => markAsCompleted(index)}
                    className="todo-checkbox"
                  />
                  <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.content}</span>
                </div>
                <button className="todo-delete-button" onClick={() => deleteTodo(index)}>
                  <img src={deleteIcon} alt="Delete" className="delete-icon" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TodoListContext.Provider>
  );
};

const App = () => {
  return <TodoList />;
};

export default App;
