import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [voterId, setVoterId] = useState("");

  const handleVerify = () => {
    // after OTP / face recognition
    socket.emit("unlockVoting", { voterId });
  };

  return (
    <div>
      <h2>Voter Verification</h2>
      <input
        type="text"
        placeholder="Enter Voter ID"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
      />
      <button onClick={handleVerify}>Verify & Unlock Voting</button>
    </div>
  );
}
