// Initialize AOS
AOS.init();

// Hamburger Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Logo Typing Animation
const logo = document.querySelector('.animate-logo');
const text = logo.textContent;
logo.textContent = '';
let i = 0;
function typeWriter() {
    if (i < text.length) {
        logo.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 150);
    }
}
typeWriter();

// Stats Section Logic
const battingBtn = document.getElementById('batting-btn');
const bowlingBtn = document.getElementById('bowling-btn');
const teamBtn = document.getElementById('team-btn');
const statsContainer = document.getElementById('stats-container');
const teamFilter = document.getElementById('team-filter');
const searchBar = document.getElementById('search-bar');
const filtersDiv = document.getElementById('filters');

let battingData = [];
let bowlingData = [];
let teamData = [];

async function loadData() {
    const battingResponse = await fetch('batters_stats.json');
    const bowlingResponse = await fetch('bowlers_stats.json');
    const teamResponse = await fetch('teams_stats.json');
    battingData = (await battingResponse.json()).batting_leaders;
    bowlingData = (await bowlingResponse.json()).bowling_leaders;
    teamData = (await teamResponse.json()).team_stats;
}

function displayBattingStats() {
    filtersDiv.classList.remove('hidden');
    statsContainer.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Batting Leaders</h2>
        <div class="table-container mb-8">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Innings</th>
                        <th>Runs</th>
                        <th>Highest Score</th>
                        <th>Average</th>
                        <th>Balls Faced</th>
                        <th>Strike Rate</th>
                        <th>100s</th>
                        <th>50s</th>
                        <th>4s</th>
                        <th>6s</th>
                    </tr>
                </thead>
                <tbody id="batting-table-body"></tbody>
            </table>
        </div>

        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Top 10 Best Batting Average</h2>
        <div class="table-container mb-8">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Average</th>
                        <th>Runs</th>
                    </tr>
                </thead>
                <tbody id="batting-avg-table-body"></tbody>
            </table>
        </div>

        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Top 10 Most Sixes & Fours</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Sixes <i class="fas fa-arrow-up ml-1"></i></th>
                        <th>Fours <i class="fas fa-arrow-right ml-1"></i></th>
                    </tr>
                </thead>
                <tbody id="batting-sixes-fours-table-body"></tbody>
            </table>
        </div>
    `;
    filterAndDisplayBatting();
}

function displayBowlingStats() {
    filtersDiv.classList.remove('hidden');
    statsContainer.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Bowling Leaders</h2>
        <div class="table-container mb-8">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Innings</th>
                        <th>Wickets</th>
                        <th>Best Figures</th>
                        <th>Overs</th>
                        <th>Runs Conceded</th>
                        <th>Average</th>
                        <th>Economy</th>
                        <th>Strike Rate</th>
                        <th>4W</th>
                        <th>5W</th>
                    </tr>
                </thead>
                <tbody id="bowling-table-body"></tbody>
            </table>
        </div>

        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Top 10 Most Wickets</h2>
        <div class="table-container mb-8">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Wickets</th>
                        <th>Economy</th>
                        <th>Best Figures</th>
                    </tr>
                </thead>
                <tbody id="bowling-wickets-table-body"></tbody>
            </table>
        </div>

        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Top 10 Best Economy Rate</h2>
        <div class="table-container mb-8">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Matches</th>
                        <th>Economy</th>
                        <th>Wickets</th>
                    </tr>
                </thead>
                <tbody id="bowling-economy-table-body"></tbody>
            </table>
        </div>

        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Top 10 Best Bowling Figures</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Best Figures</th>
                    </tr>
                </thead>
                <tbody id="bowling-figures-table-body"></tbody>
            </table>
        </div>
    `;
    filterAndDisplayBowling();
}

function displayTeamStats() {
    filtersDiv.classList.add('hidden');
    statsContainer.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 neon-glow" data-aos="fade-up">Team Stats</h2>
        <div class="flex flex-wrap justify-center gap-6 mb-8" id="team-logos" data-aos="fade-up"></div>
        <div id="team-stats-details"></div>
    `;
    renderTeamLogos();
}

function renderTeamLogos() {
    const teamLogosDiv = document.getElementById('team-logos');
    const teams = [
        { name: 'Sunrisers Hyderabad', logo: 'teams/srh.png' },
        { name: 'Chennai Super Kings', logo: 'teams/csk.png' },
        { name: 'Royal Challengers Bengaluru', logo: 'teams/rcb.png' },
        { name: 'Kolkata Knight Riders', logo: 'teams/kkr.png' },
        { name: 'Mumbai Indians', logo: 'teams/mi.png' },
        { name: 'Punjab Kings', logo: 'teams/pbks.png' },
        { name: 'Gujarat Titans', logo: 'teams/gt.png' },
        { name: 'Lucknow Super Giants', logo: 'teams/lsg.png' },
        { name: 'Rajasthan Royals', logo: 'teams/rr.png' },
        { name: 'Delhi Capitals', logo: 'teams/dc.png' },
    ];
    teamLogosDiv.innerHTML = teams.map(team => `
        <button class="team-logo-btn" data-team="${team.name}">
            <img src="${team.logo}" alt="${team.name} Logo" class="w-16 h-16 object-contain">
        </button>
    `).join('');
    
    document.querySelectorAll('.team-logo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const teamName = btn.dataset.team;
            displayTeamDetails(teamName);
        });
    });
}

function displayTeamDetails(teamName) {
    const team = teamData.find(t => t.team === teamName);
    if (!team) return;

    const detailsDiv = document.getElementById('team-stats-details');
    detailsDiv.innerHTML = `
        <h3 class="text-xl font-bold mb-4 neon-glow" data-aos="fade-up">${team.team}</h3>
        
        <!-- Team Overview -->
        <div class="mb-8" data-aos="fade-up">
            <h4 class="text-lg font-semibold mb-2">Team Overview</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg">
                <p><strong>Matches Played:</strong> ${team.matches_played}</p>
                <p><strong>Total Runs:</strong> ${team.batting_performance.total_runs}</p>
                <p><strong>Highest Score:</strong> ${team.batting_performance.highest_score}</p>
                <p><strong>Lowest Score:</strong> ${team.batting_performance.lowest_score}</p>
                <p><strong>Batting Average:</strong> ${team.batting_performance.average_score.toFixed(2)}</p>
                <p><strong>Strike Rate:</strong> ${team.batting_performance.strike_rate.toFixed(2)}</p>
                <p><strong>Total Fours:</strong> ${team.batting_performance.fours}</p>
                <p><strong>Total Sixes:</strong> ${team.batting_performance.sixes}</p>
                <p><strong>Total Wickets Taken:</strong> ${team.bowling_performance.total_wickets}</p>
                <p><strong>Best Bowling Figures:</strong> ${team.bowling_performance.best_bowling_figures}</p>
                <p><strong>Bowling Economy:</strong> ${team.bowling_performance.economy_rate.toFixed(2)}</p>
                <p><strong>Bowling Average:</strong> ${team.bowling_performance.average.toFixed(2)}</p>
                <p><strong>Bowling Strike Rate:</strong> ${team.bowling_performance.strike_rate.toFixed(2)}</p>
            </div>
        </div>

        <!-- Top Batting Performers (Only for Desktop) -->
        <h4 class="text-lg font-semibold mb-2 team-stats-table-heading" data-aos="fade-up">Top 5 Batting Performers</h4>
        <div class="table-container team-stats-table-container mb-8" data-aos="fade-up">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Matches</th>
                        <th>Runs</th>
                        <th>Avg</th>
                        <th>SR</th>
                        <th>4s</th>
                        <th>6s</th>
                    </tr>
                </thead>
                <tbody>
                    ${team.batting_performance.players
                        .sort((a, b) => b.runs - a.runs)
                        .slice(0, 5)
                        .map(player => `
                            <tr>
                                <td>${player.name}</td>
                                <td>${player.matches}</td>
                                <td>${player.runs}</td>
                                <td>${player.average ? player.average.toFixed(2) : '-'}</td>
                                <td>${player.strike_rate ? player.strike_rate.toFixed(2) : '-'}</td>
                                <td>${player.fours}</td>
                                <td>${player.sixes}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Top Bowling Performers (Only for Desktop) -->
        <h4 class="text-lg font-semibold mb-2 team-stats-table-heading" data-aos="fade-up">Top 5 Bowling Performers</h4>
        <div class="table-container team-stats-table-container mb-8" data-aos="fade-up">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Matches</th>
                        <th>Wickets</th>
                        <th>Economy</th>
                        <th>Best Figures</th>
                    </tr>
                </thead>
                <tbody>
                    ${team.bowling_performance.players
                        .sort((a, b) => b.wickets - a.wickets)
                        .slice(0, 5)
                        .map(player => `
                            <tr>
                                <td>${player.name}</td>
                                <td>${player.matches}</td>
                                <td>${player.wickets}</td>
                                <td class="${player.economy < 6 ? 'highlight-green' : ''}">${player.economy.toFixed(2)}</td>
                                <td>${player.best_bowling || '-'}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Graphical Insights -->
        <h4 class="text-lg font-semibold mb-2" data-aos="fade-up">Graphical Insights</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <canvas id="batting-bar-chart"></canvas>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                <canvas id="batting-pie-chart"></canvas>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg md:col-span-2">
                <canvas id="wickets-line-chart"></canvas>
            </div>
        </div>
    `;

    // Render Charts
    renderCharts(team);
}

function renderCharts(team) {
    const topBatsmen = team.batting_performance.players.sort((a, b) => b.runs - a.runs).slice(0, 5);

    // Bar Chart: Top 5 Batsmen (Runs vs Strike Rate)
    new Chart(document.getElementById('batting-bar-chart'), {
        type: 'bar',
        data: {
            labels: topBatsmen.map(p => p.name),
            datasets: [
                {
                    label: 'Runs',
                    data: topBatsmen.map(p => p.runs),
                    backgroundColor: '#ff4500',
                },
                {
                    label: 'Strike Rate',
                    data: topBatsmen.map(p => p.strike_rate || 0),
                    backgroundColor: '#ff8c00',
                }
            ]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });

    // Pie Chart: Batting Contributions
    new Chart(document.getElementById('batting-pie-chart'), {
        type: 'pie',
        data: {
            labels: topBatsmen.map(p => p.name),
            datasets: [{
                data: topBatsmen.map(p => p.runs),
                backgroundColor: ['#ff4500', '#ff8c00', '#ffa500', '#ff7f50', '#ff6347']
            }]
        }
    });

    // Line Chart: Wickets Progression (Mock Data)
    const topBowlers = team.bowling_performance.players.sort((a, b) => b.wickets - a.wickets).slice(0, 5);
    new Chart(document.getElementById('wickets-line-chart'), {
        type: 'line',
        data: {
            labels: topBowlers.map(p => p.name),
            datasets: [{
                label: 'Wickets',
                data: topBowlers.map(p => p.wickets),
                borderColor: '#ff4500',
                fill: false
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

function filterAndDisplayBatting() {
    const team = teamFilter.value;
    const search = searchBar.value.toLowerCase();

    const filteredData = battingData.filter(player => {
        return (!team || player.team === team) &&
               (!search || player.player.toLowerCase().includes(search));
    });

    const battingTbody = document.getElementById('batting-table-body');
    battingTbody.innerHTML = filteredData.map(player => `
        <tr>
            <td>${player.rank}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td>${player.innings}</td>
            <td>${player.runs}</td>
            <td>${player.highest_score}</td>
            <td>${player.average}</td>
            <td>${player.balls_faced}</td>
            <td>${player.strike_rate}</td>
            <td>${player.hundreds}</td>
            <td>${player.fifties}</td>
            <td>${player.fours}</td>
            <td>${player.sixes}</td>
        </tr>
    `).join('');

    const avgSorted = [...filteredData].sort((a, b) => b.average - a.average).slice(0, 10);
    const avgTbody = document.getElementById('batting-avg-table-body');
    avgTbody.innerHTML = avgSorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td>${player.average}</td>
            <td>${player.runs}</td>
        </tr>
    `).join('');

    const sixesFoursSorted = [...filteredData].sort((a, b) => (b.sixes + b.fours) - (a.sixes + a.fours)).slice(0, 10);
    const sixesFoursTbody = document.getElementById('batting-sixes-fours-table-body');
    sixesFoursTbody.innerHTML = sixesFoursSorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td>${player.sixes}</td>
            <td>${player.fours}</td>
        </tr>
    `).join('');
}

function filterAndDisplayBowling() {
    const team = teamFilter.value;
    const search = searchBar.value.toLowerCase();

    const filteredData = bowlingData.filter(player => {
        return (!team || player.team === team) &&
               (!search || player.player.toLowerCase().includes(search));
    });

    const bowlingTbody = document.getElementById('bowling-table-body');
    bowlingTbody.innerHTML = filteredData.map(player => `
        <tr>
            <td>${player.rank}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td>${player.innings}</td>
            <td>${player.wickets}</td>
            <td>${player.best_figures}</td>
            <td>${player.overs}</td>
            <td>${player.runs}</td>
            <td>${player.average}</td>
            <td class="${player.economy < 6 ? 'highlight-green' : ''}">${player.economy}</td>
            <td>${player.strike_rate}</td>
            <td>${player.four_wickets}</td>
            <td>${player.five_wickets}</td>
        </tr>
    `).join('');

    const wicketsSorted = [...filteredData].sort((a, b) => b.wickets - a.wickets).slice(0, 10);
    const wicketsTbody = document.getElementById('bowling-wickets-table-body');
    wicketsTbody.innerHTML = wicketsSorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td>${player.wickets}</td>
            <td class="${player.economy < 6 ? 'highlight-green' : ''}">${player.economy}</td>
            <td>${player.best_figures}</td>
        </tr>
    `).join('');

    const economySorted = [...filteredData].sort((a, b) => a.economy - b.economy).slice(0, 10);
    const economyTbody = document.getElementById('bowling-economy-table-body');
    economyTbody.innerHTML = economySorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.matches}</td>
            <td class="${player.economy < 6 ? 'highlight-green' : ''}">${player.economy}</td>
            <td>${player.wickets}</td>
        </tr>
    `).join('');

    const figuresSorted = [...filteredData].sort((a, b) => {
        const [aWickets, aRuns] = a.best_figures.split('/').map(Number);
        const [bWickets, bRuns] = b.best_figures.split('/').map(Number);
        return bWickets - aWickets || aRuns - bRuns;
    }).slice(0, 10);
    const figuresTbody = document.getElementById('bowling-figures-table-body');
    figuresTbody.innerHTML = figuresSorted.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td>${player.team}</td>
            <td>${player.best_figures}</td>
        </tr>
    `).join('');
}

// Event Listeners
battingBtn.addEventListener('click', displayBattingStats);
bowlingBtn.addEventListener('click', displayBowlingStats);
teamBtn.addEventListener('click', displayTeamStats);
teamFilter.addEventListener('change', () => {
    if (document.getElementById('batting-table-body')) filterAndDisplayBatting();
    else if (document.getElementById('bowling-table-body')) filterAndDisplayBowling();
});
searchBar.addEventListener('input', () => {
    if (document.getElementById('batting-table-body')) filterAndDisplayBatting();
    else if (document.getElementById('bowling-table-body')) filterAndDisplayBowling();
});

// Load Data on Page Load (but don't display anything yet)
loadData();