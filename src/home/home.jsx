import React from "react";

export function Home() {
    return (
        <main>
            <h2>Welcome!</h2>
                <p>This is a fantasy football helper tool that helps you optimize your lineup based on projected points and your budget.</p>
            
                <section>
                    <h3>Database Data (Placeholder)</h3>
                    <ul>
                        <li>Team A: QB - Player</li>
                        <li>Team B: QB - Player</li>
                    </ul>
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
    );
}