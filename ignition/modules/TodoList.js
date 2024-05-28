const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Todolist", (m) => {

  const Todolist = m.contract("TodoList");

  return { Todolist };
});
