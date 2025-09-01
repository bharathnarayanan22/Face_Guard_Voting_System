import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [locked, setLocked] = useState(true);
  const [voter, setVoter] = useState(null);

  useEffect(() => {
    socket.on("unlockVoting", (data) => {
      setLocked(false);
      setVoter(data.voterId);
    });

    socket.on("lockVoting", () => {
      setLocked(true);
      setVoter(null);
    });

    return () => {
      socket.off("unlockVoting");
      socket.off("lockVoting");
    };
  }, []);

  const castVote = () => {
    socket.emit("lockVoting", { voterId: voter });
  };

  return (
    <div>
      {locked ? (
        <h2>Voting Locked. Waiting for verification...</h2>
      ) : (
        <div>
          <h2>Voting Unlocked for Voter {voter}</h2>
          <button onClick={castVote}>Cast Vote & Lock Again</button>
        </div>
      )}
    </div>
  );
}
