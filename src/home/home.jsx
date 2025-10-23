import React from "react";

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



    return (
        <body>
            <main>
                <h2>Welcome, {user.username}</h2>
                    <p>This is a fantasy football helper tool that helps you optimize your lineup based on projected points and your budget.</p>
                
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
                        <h3>Live Updates (Websocket stuff)</h3>
                        <p>Live updates will appear here.</p>
                    </section>
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