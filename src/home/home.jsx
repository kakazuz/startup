import React, {useState, useEffect} from "react";
import "./home.css";

export function Home( {user}) {
    const [roster, setRoster] = useState([]);
    const [selectedPlayerName, setSelectedPlayerName] = useState(""); // for viewing
    const [selectedPlayerToAdd, setSelectedPlayerToAdd] = useState(""); // for adding
    const [updates, setUpdates] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Computed — the actual selected player object
    const selectedPlayer = roster.find(p => p.name === selectedPlayerName) || null;

    const popularPlayers = [
        { name: "Josh Allen", position: "QB", team: "BUF", projected: 25.1 },
        { name: "Jalen Hurts", position: "QB", team: "PHI", projected: 24.3 },
        { name: "Patrick Mahomes", position: "QB", team: "KC", projected: 23.8 },
        { name: "Lamar Jackson", position: "QB", team: "BAL", projected: 23.5 },
        { name: "Christian McCaffrey", position: "RB", team: "SF", projected: 21.8 },
        { name: "Bijan Robinson", position: "RB", team: "ATL", projected: 19.4 },
        { name: "Tyreek Hill", position: "WR", team: "MIA", projected: 20.1 },
        { name: "CeeDee Lamb", position: "WR", team: "DAL", projected: 19.7 },
        { name: "Ja'Marr Chase", position: "WR", team: "CIN", projected: 19.2 },
        { name: "Amon-Ra St. Brown", position: "WR", team: "DET", projected: 18.9 },
        { name: "Travis Kelce", position: "TE", team: "KC", projected: 16.8 },
        { name: "Sam LaPorta", position: "TE", team: "DET", projected: 15.5 },
        { name: "Justin Tucker", position: "K", team: "BAL", projected: 10.5 },
        { name: "49ers DST", position: "DEF", team: "SF", projected: 9.8 },
        { name: "Ravens DST", position: "DEF", team: "BAL", projected: 9.5 },
        ];
  

  // Load roster
  useEffect(() => {
    fetchRoster();
  }, [user]);

  async function fetchRoster() {
    try {
      const response = await fetch("/api/roster");
      if (response.ok) {
        const data = await response.json();
        setRoster(data.players || []);
      } else {
        setRoster([]);
      }
    } catch (err) {
      console.error("Failed to load roster:", err);
        setRoster([]);
    }
  }

  useEffect(() => {
    if (roster.length > 0 && !selectedPlayerName) {
      setSelectedPlayerName(roster[0].name);
    }
    if (roster.length === 0) {
      setSelectedPlayerName("");
      setUpdates([]);
    }
  }, [roster]);

  async function saveRoster() {
    if (roster.length === 0) return;
    setSaving(true);
    try {
      const response = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: roster }),
      });
      if (response.ok) {
        setMessage("✅ Roster saved!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("⚠️ Save failed");
    } finally {
    setSaving(false);
    }

    // caal the nofifier.js file after here
  }


  function addPlayerFromMenu() {
    if (!selectedPlayerToAdd) return;
    const player = JSON.parse(selectedPlayerToAdd);
    setRoster(prev => [...prev, player]);
    setSelectedPlayerToAdd(""); // reset dropdown
    setMessage("✅ Player added! Click 'Save Roster' to keep it.");
    }



  function removePlayer(index) {
    const removedPlayerName = roster[index].name;
    setRoster(prev => prev.filter((_, i) => i !== index));
    
    if (selectedPlayerName === removedPlayerName) {
      setSelectedPlayerName(roster[0]?.name || "");
    }
  }


    const playersByPosition = roster.reduce((acc, player) => {
        if (!acc[player.position]) 
            acc[player.position] = [];
        acc[player.position].push(player);
        return acc;
    }, {});


    useEffect(() => {
    if (roster.length === 0) {
        setUpdates([]);
        return;
    }    

    const events = [
      "threw a touchdown! +6 pts",
      "threw an interception -2 pts",
      "completed a pass +1 pt",
      "rushed for 10+ yards +1 pt",
      "caught a TD! +6 pts",
      "fumbled -2 pts",
      "scored a rushing TD! +6 pts",
      "kicked a 50+ yard FG +5 pts",
      "sacked the QB! +2 pts (DEF)",
    ];

    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newUpdate = `${time} — ${selectedPlayer.name} ${randomEvent}`;
      setUpdates(prev => [newUpdate, ...prev].slice(0, 20));
    }, 6000);

    return () => clearInterval(interval);
  }, [roster]);

    // const mockPlayers = roster.map(p => p.name);
    // const mockEvents = [
    //     "scored a TD! +6 pts",
    //     "ran for 20 yards! +2 pts",
    //     "caught a pass! +1 pts",
    //     "threw an interception! -2 pts"
    // ];

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (mockPlayers.length === 0) return;
    //         const randomPlayer = mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
    //         const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    //         const newUpdate = `${new Date().toLocaleTimeString()} - ${randomPlayer} ${randomEvent}`;
    //         setUpdates(prev => [newUpdate, ...prev].slice(0, 20));
    //     }, 3000);

    //     return () => clearInterval(interval);
    // }, [mockPlayers]);



    return (
        <body>
            <main>
                <h2>Welcome</h2>
                    <p>This is a fantasy football helper tool that helps you optimize your lineup based on projected points and your budget.</p>
                    <div className="dashboard-container">
                        <section>
                            <h3>Player Comparison (Position)</h3>
                                {Object.keys(playersByPosition).length === 0 ? (
                                    <p className="text-muted">No players in roster yet. Add some below!</p>
                                    ) : (
                                    Object.entries(playersByPosition).map(([pos, players]) => (
                                        <div key={pos} className="position-section mb-3">
                                        <h5 className="text-primary">{pos}</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {players.map((p, i) => (
                                                <div
                                                key={i}
                                                className={`player-card p-2 border rounded ${selectedPlayer?.name === p.name ? 'border-primary bg-light' : ''}`}
                                                style={{ cursor: "pointer", minWidth: "180px" }}
                                                onClick={() => setSelectedPlayer(p.name)}
                                                >
                                                <strong>{p.name}</strong><br />
                                                <strong>{p.projected} proj pts</strong><br />
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                        ))
                                    )}
                        </section>
                        <section className="mb-5">
                            <h3>Live Updates</h3>
                                <div className="card p-3 shadow-sm" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {updates.length === 0 ? (
                                    <p className="text-muted text-center">
                                        {`Waiting for players to make a play...`}
                                    </p>
                                    ) : (
                                    <div className="updates-feed">
                                        {updates.map((update, i) => (
                                        <div key={i} className="update-item border-bottom pb-2 mb-2">
                                            {update}
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                        </section>
                        <section className="mt-5">
                            <h3>Add Player to Your Roster</h3>
                                <div className="card p-4 shadow">
                                    <div className="row g-3 align-items-end">
                                    <div className="col-md-8">
                                        <label className="form-label fw-bold">Select a Player</label>
                                        <select
                                        className="form-select form-select-lg"
                                        value={selectedPlayerToAdd || ""}
                                        onChange={(e) => setSelectedPlayerToAdd(e.target.value)}
                                        >
                                        <option value="">-- Choose a player to add --</option>
                                        {popularPlayers.map((player, i) => (
                                            <option key={i} value={JSON.stringify(player)}>
                                            {player.name} ({player.position}) - {player.team} → {player.projected} projected pts
                                            </option>
                                        ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                        className="btn btn-success btn-lg w-100"
                                        onClick={addPlayerFromMenu}
                                        disabled={!selectedPlayerToAdd}
                                        >
                                        ➕ Add
                                        </button>
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                        className="btn btn-primary btn-lg w-100"
                                        onClick={saveRoster}
                                        disabled={saving || roster.length === 0}
                                        >
                                        {saving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                    </div>
                                    {roster.length > 0 && (
                                    <div className="mt-4">
                                        <strong>Current Roster ({roster.length} players):</strong>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                        {roster.map((p, i) => (
                                            <span key={i} className="badge bg-secondary fs-6 p-2">
                                            {p.name} ({p.position})
                                            <button
                                                className="btn btn-sm btn-close btn-close-white ms-2"
                                                onClick={() => removePlayer(i)}
                                            />
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                    )}
                                </div>
                        </section>
                    </div>
            </main>

            <footer>
                <hr />
                <span className="text-reset">Made by Zachary Kakazu</span>
                <br />
                <a href="https://github.com/kakazuz/startup.git">Zach's GitHub</a>
            </footer>
        </body>
    );
}