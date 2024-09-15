import { useState } from "react";
import "./App.css";
import { Account, Contract, RpcProvider } from "starknet";
import { ABI } from "./assets/abi";
import { BigNumber } from "bignumber.js";
import { connect, disconnect } from "starknetkit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [balAdd, setBalAdd] = useState(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState(null);
  const [owner, setOwner] = useState("");
  const [mintRec, setMintRec] = useState("");
  const [tranRec, setTranRec] = useState("");
  const [mintAmt, setMintAmt] = useState("");
  const [tranAmt, setTranAmt] = useState("");
  const [formVisible, setFormVisible] = useState("");

  const { VITE_SEPOLIA_URL, VITE_ACCOUNT_ADDRESS, VITE_PRIVATE_KEY } =
    import.meta.env;

  const CONTRACT_ADDRESS =
    "0x04975b30f296e6445f0f59b1324307b8111704e4356c25fd7463eb7699d53eb4";

  const PROVIDER = new RpcProvider({
    nodeUrl: import.meta.env.VITE_SEPOLIA_URL,
  });

  const connectWallet = async () => {
    if (address) {
      disconnect();
      setProvider(null);
      setAccount(null);
      setAddress(null);
      return;
    }

    const { wallet } = await connect({
      provider: PROVIDER,
    });
    console.log(wallet);

    if (wallet && wallet.isConnected) {
      setProvider(wallet.provider);
      setAccount(wallet.account);
      setAddress(wallet.selectedAddress);
    }
  };

  const viewContract = () => {
    return new Contract(ABI, CONTRACT_ADDRESS, provider);
  };

  const stateChangeContract = () => {
    return new Contract(ABI, CONTRACT_ADDRESS, account);
  };

  const getName = async () => {
    if (provider) {
      const contract = viewContract();

      try {
        const tx = await contract.name();
        setName(tx);
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const getSymbol = async () => {
    if (provider) {
      const contract = viewContract();

      try {
        const tx = await contract.symbol();
        console.log(tx);

        setSymbol(tx);
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const getOwner = async () => {
    if (provider) {
      const contract = viewContract();

      try {
        const tx = await contract.owner();
        setOwner(tx);
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const balance_of = async (addr) => {
    if (provider) {
      const contract = viewContract();

      try {
        const tx = await contract.balance_of(addr);
        console.log(tx);

        setBalance(BigNumber(tx).toString());
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const mint = async (r, a) => {
    if (account) {
      try {
        const contract = new Contract(ABI, CONTRACT_ADDRESS, account);

        const res = await contract.mint(r, a);

        const txHash = res?.transaction_hash;

        const txResult = await provider.waitForTransaction(txHash);

        const events = contract.parseEvents(txResult);

        const rec = events[0]["mini::Mini::MintToken"].receiver;
        const amn = events[0]["mini::Mini::MintToken"].amount;

        toast.success(
          `${BigNumber(
            amn
          ).toString()} tokens has been minted to ${rec} successfully`
        );
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  const transfer = async (rc, at) => {
    if (account) {
      try {
        const contract = new Contract(ABI, CONTRACT_ADDRESS, account);

        const res = await contract.transfer(rc, at);

        const txHash = res?.transaction_hash;

        const txResult = await provider.waitForTransaction(txHash);

        const events = contract.parseEvents(txResult);

        const rec = events[0]["mini::Mini::TransferToken"].receiver;
        const amn = events[0]["mini::Mini::TransferToken"].amount;

        toast.success(
          `${BigNumber(
            amn
          ).toString()} tokens has been transferred to ${rec} successfully`
        );
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <button onClick={connectWallet} className="connect-btn">
          {address ? `${address.substring(0, 10)}...` : "Connect Wallet"}
        </button>
      </header>

      <div className="buttons-container">
        <h1 className="title">Mini ERC 20</h1>

        <div className="card">
          <div>
            <button onClick={getName}>Get Name</button>
            <h2 className="outputs">{`${name ? name : " "}`}</h2>
          </div>

          <div className="separator"></div>
          <div>
            <button onClick={getSymbol}>Get Symbol</button>
            <h2 className="outputs">{`${symbol ? symbol : " "}`}</h2>
          </div>

          <div className="separator"></div>
          <div>
            <button onClick={getOwner}>Get Owner</button>
            <h2 className="outputs">{`${owner ? owner : " "}`}</h2>
          </div>

          <div className="separator"></div>

          {/* Balance_of */}
          <div>
            <button onClick={() => setFormVisible("balance_of")}>
              Get Balance
            </button>
            {formVisible === "balance_of" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  balance_of(balAdd);
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

          {/* Mint */}
          <div>
            <button onClick={() => setFormVisible("mint")}>Mint Tokens</button>
            {formVisible === "mint" && (
              <form
                className="function-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  mint(mintRec, mintAmt);
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
                  transfer(tranRec, tranAmt);
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
    </div>
  );
}

export default App;
