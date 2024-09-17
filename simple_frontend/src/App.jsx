import { useState } from "react";
import "./App.css";
import { ABI } from "./assets/abi";
import { connectWallet } from "./wallet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getName,
  getSymbol,
  getOwner,
  mintTokens,
  balance_of,
  transfer,
} from "./contract";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [balAdd, setBalAdd] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [owner, setOwner] = useState("");
  const [mintRec, setMintRec] = useState("");
  const [mintAmt, setMintAmt] = useState("");
  const [tranAmt, setTranAmt] = useState("");
  const [tranRec, setTranRec] = useState("");
  const [formVisible, setFormVisible] = useState("");

  return (
    <div className="app-container">
      <header className="header">
        <button
          onClick={() =>
            connectWallet(address, setProvider, setAccount, setAddress)
          }
          className="connect-btn"
        >
          {address
            ? `${address.substring(0, 7)}......${address.substring(60)}`
            : "Connect Wallet"}
        </button>
      </header>

      <div className="buttons-container">
        <h1 className="title">Mini ERC 20</h1>

        <div className="card">
          <div>
            <button onClick={() => getName(provider, ABI, setName, toast)}>
              Get Name
            </button>
            <h2 className="outputs">{`${name ? name : " "}`}</h2>
          </div>
          <div className="separator"></div>
          <div>
            <button onClick={() => getSymbol(provider, ABI, setSymbol, toast)}>
              Get Symbol
            </button>
            <h2 className="outputs">{`${symbol ? symbol : " "}`}</h2>
          </div>
          <div className="separator"></div>
          <div>
            <button onClick={() => getOwner(provider, ABI, setOwner, toast)}>
              Get Owner
            </button>
            <h2 className="outputs">{`${owner ? owner : " "}`}</h2>
          </div>
          <div className="separator"></div>
          <div>
            <button onClick={() => setFormVisible("balance_of")}>
              Get Balance
            </button>

            {formVisible === "balance_of" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  balance_of(provider, ABI, balAdd, setBalance, toast);
                }}
              >
                <input
                  type="text"
                  placeholder="Enter address"
                  value={balAdd}
                  onChange={(e) => setBalAdd(e.target.value)}
                />
                <button type="submit">Submit</button>

                <h2 className="outputs">{`${balance ? balance : " "}`}</h2>
              </form>
            )}
          </div>
          <div className="separator"></div>
          <div>
            <button onClick={() => setFormVisible("mint")}>Mint Tokens</button>

            {formVisible === "mint" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  mintTokens(account, ABI, provider, mintRec, mintAmt, toast);
                }}
              >
                <input
                  type="text"
                  placeholder="Recipient"
                  value={mintRec}
                  onChange={(e) => setMintRec(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={mintAmt}
                  onChange={(e) => setMintAmt(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
          <div className="separator"></div>
          {/* Transfer */}
          <div>
            <button onClick={() => setFormVisible("transfer")}>
              Transfer Tokens
            </button>
            {formVisible === "transfer" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  transfer(account, ABI, provider, tranRec, tranAmt, toast);
                }}
              >
                <input
                  type="text"
                  placeholder="Recipient"
                  value={tranRec}
                  onChange={(e) => setTranRec(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={tranAmt}
                  onChange={(e) => setTranAmt(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
}

export default App;
