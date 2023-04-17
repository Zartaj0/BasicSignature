import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = require("./abi.json")


const verifyMessage = async ({ message, address, signature }) => {
  let contract;
  let signer;

  console.log("CHECK",message,address,signature,"CHECK");

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //console.log(message);

    signer = provider.getSigner();
    const SignAddress = signer.getAddress();
    // console.log(SignAddress);

    contract = new ethers.Contract(contractAddress, abi.abi, signer)
    // console.log(contract.address)

    let messageHash = await ethers.utils.hashMessage(message);
console.log(messageHash);
console.log(signature);
    const signerAddr = await contract.recoverSigner(messageHash,signature);
    console.log(signerAddr);
    console.log(messageHash);
    if (signerAddr !== address) {
      return false;
    }
  } catch
  (err) {
    console.log(err);
    return false;
  }




  return true;

};

export default function VerifyMessage() {
  const [error, setError] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleVerification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSuccessMsg();
    setError();
    const isValid = await verifyMessage({
      setError,
      message: data.get("message"),
      address: data.get("address"),
      signature: data.get("signature")
    });

    if (isValid) {
      setSuccessMsg("Signature is valid!");
    } else {
      setError("Invalid signature");
    }
  };

  return (
    <form className="m-4" onSubmit={handleVerification}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Verify signature
          </h1>
          <div className="">
            <div className="my-3">
              <textarea
                required
                type="text"
                name="message"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Message"
              />
            </div>
            <div className="my-3">
              <textarea
                required
                type="text"
                name="signature"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Signature"
              />
            </div>
            <div className="my-3">
              <input
                required
                type="text"
                name="address"
                className="textarea w-full input input-bordered focus:ring focus:outline-none"
                placeholder="Signer address"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Verify signature
          </button>
        </footer>
        <div className="p-4 mt-4">
          <ErrorMessage message={error} />
          <SuccessMessage message={successMsg} />
        </div>
      </div>
    </form>
  );
}
