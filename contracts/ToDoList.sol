// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Todo {
        string content;
        bool completed;
    }

    // Mapping from user address to list of todos
    mapping(address => Todo[]) private userTodos;

    // Function to add a new to-do item for the sender
    function addTodo(string memory _content) public {
        userTodos[msg.sender].push(Todo({
            content: _content,
            completed: false
        }));
    }

    // Function to mark a to-do item as completed for the sender
    function markAsCompleted(uint256 _index) public {
        require(_index < userTodos[msg.sender].length, "Index out of bounds");
        userTodos[msg.sender][_index].completed = true;
    }

    // Function to delete a to-do item for the sender
    function deleteTodo(uint256 _index) public {
        require(_index < userTodos[msg.sender].length, "Index out of bounds");
        Todo[] storage todos = userTodos[msg.sender];
        for (uint256 i = _index; i < todos.length - 1; i++) {
            todos[i] = todos[i + 1];
        }
        todos.pop();
    }

    // Function to get the total number of to-do items for the sender
    function getTodoCount() public view returns (uint256) {
        return userTodos[msg.sender].length;
    }

    // Function to get the content and completion status of a to-do item at a specific index for the sender
    function getTodoAtIndex(uint256 _index) public view returns (string memory content, bool completed) {
        require(_index < userTodos[msg.sender].length, "Index out of bounds");
        Todo storage todo = userTodos[msg.sender][_index];
        return (todo.content, todo.completed);
    }

    // Function to get all todos for the sender
    function getTodos() public view returns (Todo[] memory) {
        return userTodos[msg.sender];
    }
}
