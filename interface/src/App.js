import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import deleteIcon from './trash.png';
import ABI from './contracts/TodoList'

// Create a context for the todo list
const TodoListContext = createContext();

// TodoList component
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const fetchTodos = async () => {
    try {
      const todoList = await contract.methods.getTodos().call({from: accounts, gasLimit: 50000});
      const processedTodos = todoList.map(([content, completed]) => ({ content, completed }));
      setTodos(processedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      // const currentChainId = await window.ethereum.request({
      //   method: 'eth_chainId',
      // });
      // if (currentChainId !== '0x13882') { // '0xaa36a7' is the chain ID for Sepolia Testnet
      //   alert("Connect to Sepolia Testnet");
      //   return;
      // }
      const instance = new web3.eth.Contract(ABI.abi, contractAddress);
      setContract(instance);
      console.log(account);
      setAccounts(account);
      setIsConnected(true);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectFromMetaMask = () => {
    setAccounts([]);
    setIsConnected(false);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      console.log("Adding New Task");
      await contract.methods.addTodo(newTodo).send({from: accounts, gasLimit: 50000});
    }
  };

  const markAsCompleted = async (index) => {
    await contract.methods.markAsCompleted(index).send({from: accounts, gasLimit: 50000});
    fetchTodos(); 
    const updatedTodos = [...todos];
    setTodos(updatedTodos);
  };

  const deleteTodo = async (index) => {
    await contract.methods.deleteTodo(index).send({from: accounts, gasLimit: 50000});
    const updatedTodos = [...todos];
    setTodos(updatedTodos);
  };

  return (
    <TodoListContext.Provider value={{ todos, addTodo, markAsCompleted, deleteTodo, newTodo, setNewTodo }}>
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