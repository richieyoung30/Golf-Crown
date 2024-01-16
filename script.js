function calculateDaysHeld() {
    const startDate = new Date('October 12, 2023');
    const lastUpdate = localStorage.getItem('lastUpdate');

    if (!lastUpdate) {
        localStorage.setItem('lastUpdate', startDate.toLocaleDateString());
        return 0;
    }

    const currentDate = new Date().toLocaleDateString();
    const daysDifference = Math.floor((new Date(currentDate) - startDate) / (24 * 60 * 60 * 1000));

    return daysDifference;
}

// Update the "Days Held Crown" cell with the calculated value
document.getElementById('daysHeldCell').textContent = `Days Held Crown: ${calculateDaysHeld()}`;


function toggleVisibility(tableId) {
    var table = document.getElementById(tableId);
    if (table.style.display === 'none') {
        table.style.display = 'table';
    } else {
        table.style.display = 'none';
    }
}

async function fetchPlayerData(containerId, dataSource) {
    try {
        const response = await fetch(dataSource);
        const data = await response.json();

        // Update the specified container with the fetched data
        const container = document.getElementById(containerId);
        container.innerHTML = '<h2>Player Data</h2>'; // Add any additional formatting

        // Create and append elements for each player entry
        data.players.forEach((entry) => {
            const entryElement = document.createElement('p');
            entryElement.textContent = `${entry.name} - Score: ${entry.score}, Fairway %: ${entry.fairwayPercentage}, Green %: ${entry.greenPercentage}`;
            container.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

// Function to fetch and display standings data
async function fetchStandings(containerId, dataSource) {
    try {
        const response = await fetch(dataSource);
        const data = await response.json();

        // Update the specified container with the fetched data
        const container = document.getElementById(containerId);
        container.innerHTML = '<h2>Standings</h2>'; // Add any additional formatting

        // Create and append elements for each standings entry
        data.standings.forEach((entry) => {
            const entryElement = document.createElement('p');
            entryElement.textContent = `${entry.position}. ${entry.player} - ${entry.points} points`;
            container.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
}

// Call the fetch functions
fetchPlayerData('container1', 'playerData.json'); // Replace with your actual player data source
fetchPlayerData('container2', 'anotherPlayerData.json'); // Replace with another player data source
fetchStandings('standings-container', 'standings.json'); // Replace with your actual standings data source
async function showStats(statType) {
    // Get the container element
    const statsContainer = document.getElementById('stats-container');

    // Clear existing content
    statsContainer.innerHTML = '';

    try {
        // Fetch stats data from stats.json
        const response = await fetch('stats.json');
        const data = await response.json();

        // Display stats based on the selected button
        switch (statType) {
            case 'score':
                fetchAndDisplayStats(statsContainer, data, 'score');
                break;
            case 'fairway':
                fetchAndDisplayStats(statsContainer, data, 'fairway');
                break;
            case 'green':
                fetchAndDisplayStats(statsContainer, data, 'green');
                break;
            case 'games':
                fetchAndDisplayGamesPlayedStats(statsContainer, data);
                break;
            default:
                break;
        }

        // Update the active button
        const buttons = document.querySelectorAll('.stats-button');
        buttons.forEach(button => button.classList.remove('active'));
        const activeButton = document.querySelector(`.stats-button[data-stat="${statType}"]`);
        activeButton.classList.add('active');
    } catch (error) {
        console.error('Error fetching and displaying stats:', error);
    }
}

// Function to fetch and display stats
function fetchAndDisplayStats(container, data, statType) {
    // Display stats based on the selected button
    container.innerHTML = `<h2>${capitalize(statType)} Stats</h2>`;
    
    data.forEach(entry => {
        entry.players.forEach(player => {
            if (player[statType] !== null && typeof player[statType] !== 'undefined') {
                const statElement = document.createElement('p');
                statElement.textContent = `${entry.course} - ${entry.date} - ${player.name}: ${player[statType]}`;
                container.appendChild(statElement);
            }
        });
    });
}

// Function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Call the showStats function with the default stat type
showStats('score');
async function fetchStats(containerId, dataSource) {
    try {
        const response = await fetch(dataSource);
        const data = await response.json();

        // Update the specified container with the fetched data
        const container = document.getElementById(containerId);
        container.innerHTML = '<h2>Stats</h2>'; // Add any additional formatting

        // Create and append elements for each stats entry
        data.forEach((entry) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('stats-entry'); // Add a class for styling
            entryElement.innerHTML = `
                <p class="course-date">${entry.course} - ${entry.date}</p>
                ${entry.players.map(player => `<p class="player-stats">${player.name}: ${player.score}</p>`).join('')}
            `;
            container.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Call the fetch function
fetchStats('stats-container', 'stats.json'); // Replace with your actual stats data source
function calculateGamesPlayed(stats) {
    const gamesPlayed = {};

    // Loop through each entry in the stats file
    stats.forEach((entry) => {
        // Loop through each player in the entry
        entry.players.forEach((player) => {
            if (player.score !== null) {
                // If the player has a score, increase the games played count
                gamesPlayed[player.name] = (gamesPlayed[player.name] || 0) + 1;
            }
        });
    });

    return gamesPlayed;
}
document.getElementById('gamesPlayedButton').addEventListener('click', function () {
    console.log('Button clicked!');
    const statsContainer = document.getElementById('stats-container');

    // Fetch and parse the stats.json file
    fetch('stats.json')
        .then(response => response.json())
        .then(stats => {
            // Calculate games played
            const gamesPlayed = calculateGamesPlayed(stats);

            // Display games played in the stats container
            statsContainer.innerHTML = '<h2>Games Played Stats</h2>';

            for (const player in gamesPlayed) {
                const entryElement = document.createElement('p');
                entryElement.textContent = `${player}: ${gamesPlayed[player]} games played`;
                statsContainer.appendChild(entryElement);
            }
        })
        .catch(error => console.error('Error fetching or parsing stats.json:', error));
        console.log('Button clicked!');
});
async function fetchAndDisplayTopScores(containerId, dataSource, statType) {
    try {
        // Fetch stats data from stats.json
        const response = await fetch(dataSource);
        const data = await response.json();

        // Get the container element
        const container = document.getElementById(containerId);

        // Clear existing content
        container.innerHTML = '';

        // Display stats based on the selected button
        container.innerHTML = `<h2>Top ${capitalize(statType)} Scores</h2>`;

        // Create an array to store scores for sorting
        const scores = [];

        // Iterate through the data and collect scores
        data.forEach(entry => {
            entry.players.forEach(player => {
                if (player[statType] !== null && typeof player[statType] !== 'undefined') {
                    scores.push({
                        course: entry.course,
                        date: entry.date,
                        player: player.name,
                        score: player[statType]
                    });
                }
            });
        });

        // Sort the scores in ascending order
        scores.sort((a, b) => a.score - b.score);

        // Display the top 3 scores
        for (let i = 0; i < Math.min(3, scores.length); i++) {
            const scoreElement = document.createElement('p');
            scoreElement.textContent = `${scores[i].course} - ${scores[i].date} - ${scores[i].player}: ${scores[i].score}`;
            container.appendChild(scoreElement);
        }
    } catch (error) {
        console.error('Error fetching and displaying top scores:', error);
    }
}

// Function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Call the fetchAndDisplayTopScores function with the default stat type
fetchAndDisplayTopScores('stats-container', 'stats.json', 'score'); 