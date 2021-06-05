import { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  console.log(web3);
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getManager() {
      const manager = await lottery.methods.manager().call();
      setManager(manager);
    }
    async function getPlayersAndBalance() {
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
    }
    getManager();
    getPlayersAndBalance();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success!");
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("A winner has been picked");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4> Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={"Enter value in ether"}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick Winner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
