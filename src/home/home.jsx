import React, {useState, useEffect} from "react";
import "./home.css";

export function Home( {user}) {
    const mockRoster = {
        zach: [
            { name: "Josh Allen", position: "QB", projected: 23.4 },
            { name: "Jalen Hurts", position: "QB", projected: 21.7 },
            { name: "Christian McCaffrey", position: "RB", projected: 19.2 },
            { name: "Austin Ekeler", position: "RB", projected: 16.3 },
        ]
    }
    const roster = mockRoster[user?.username] || [];

    const playersByPosition = roster.reduce((acc, player) => {
        if (!acc[player.position]) 
            acc[player.position] = [];
        acc[player.position].push(player);
        return acc;
    }, {});


    const [updates, setUpdates] = useState([]);
    const mockPlayers = roster.map(p => p.name);
    const mockEvents = [
        "scored a TD! +6 pts",
        "ran for 20 yards! +2 pts",
        "caught a pass! +1 pts",
        "threw an interception! -2 pts"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (mockPlayers.length === 0) return;
            const randomPlayer = mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
            const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
            const newUpdate = `${new Date().toLocaleTimeString()} - ${randomPlayer} ${randomEvent}`;
            setUpdates(prev => [newUpdate, ...prev].slice(0, 20));
        }, 3000);

        return () => clearInterval(interval);
    }, [mockPlayers]);



    return (
        <body>
            <main>
                <h2>Welcome, {user.username}</h2>
                    <p>This is a fantasy football helper tool that helps you optimize your lineup based on projected points and your budget.</p>
                    <div className="dashboard-container">
                        <section>
                            <h3>Player Comparison (Position)</h3>
                                {Object.entries(playersByPosition).map(([position, players]) => (
                                    <div key={position} className="position-section">
                                        <h4>{position} Comparison:</h4>
                                        <div className="players-list">
                                        {players.map((p) => (
                                            <div key={p.name} className="player-card">
                                            <strong>{p.name}</strong> — {p.projected} pts
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                ))}
                        </section>
                        <section>
                            <h3>Projected Points Data (Placeholder)</h3>
                            <ul>
                                <li>Player 1: 20 points</li>
                                <li>Player 2: 15 points</li>
                            </ul>
                        </section>
                        <section>
                            <div className="live-updates">
                                <h3>Live Updates</h3>
                                <div className="updates-feed">
                                    {updates.map((update, index) => (
                                    <div key={index} className="update-item">{update}</div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
            </main>

            <footer>
                <hr />
                <span class="text-reset">Made by Zachary Kakazu</span>
                <br />
                <a href="https://github.com/kakazuz/startup.git">Zach's GitHub</a>
            </footer>
        </body>
    );
}