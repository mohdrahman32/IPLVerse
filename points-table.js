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

// Tab Navigation
const pointsTab = document.getElementById('points-tab');
const playoffsTab = document.getElementById('playoffs-tab');
const pointsSection = document.getElementById('points-table-section');
const playoffsSection = document.getElementById('playoffs-section');

pointsTab.addEventListener('click', () => {
    pointsTab.classList.add('active');
    pointsTab.classList.remove('inactive');
    playoffsTab.classList.add('inactive');
    playoffsTab.classList.remove('active');

    pointsSection.classList.remove('hidden');
    pointsSection.classList.add('block');
    playoffsSection.classList.remove('block');
    playoffsSection.classList.add('hidden');
});

playoffsTab.addEventListener('click', () => {
    playoffsTab.classList.add('active');
    playoffsTab.classList.remove('inactive');
    pointsTab.classList.add('inactive');
    pointsTab.classList.remove('active');

    playoffsSection.classList.remove('hidden');
    playoffsSection.classList.add('block');
    pointsSection.classList.remove('block');
    pointsSection.classList.add('hidden');
});

// Points Table Logic
const seasonSelect = document.getElementById('season-select');
const tableBody = document.getElementById('points-table-body');

// Load initial data (IPL 2025)
fetchPointsTable('2025');

// Update table on season change
seasonSelect.addEventListener('change', (e) => {
    const selectedSeason = e.target.value;
    fetchPointsTable(selectedSeason);
});

function fetchPointsTable(season) {
    fetch('points_table.json')
        .then(response => response.json())
        .then(data => {
            const seasonData = data[season];
            tableBody.innerHTML = ''; // Clear previous data
            seasonData.forEach(team => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="font-bold">${team.rank}</td>
                    <td>${team.team}</td>
                    <td>${team.matches}</td>
                    <td>${team.won}</td>
                    <td>${team.lost}</td>
                    <td>${team.tied}</td>
                    <td class="font-bold">${team.points}</td>
                    <td>${team.nrr}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching points table:', error));
}

// Playoffs Logic
const playoffSeasonSelect = document.getElementById('playoff-season-select');
const qualifier1Team1 = document.getElementById('qualifier1-team1');
const qualifier1Team2 = document.getElementById('qualifier1-team2');
const qualifier1Details = document.getElementById('qualifier1-details');
const eliminatorTeam1 = document.getElementById('eliminator-team1');
const eliminatorTeam2 = document.getElementById('eliminator-team2');
const eliminatorDetails = document.getElementById('eliminator-details');
const qualifier2Team1 = document.getElementById('qualifier2-team1');
const qualifier2Team2 = document.getElementById('qualifier2-team2');
const qualifier2Details = document.getElementById('qualifier2-details');
const finalTeam1 = document.getElementById('final-team1');
const finalTeam2 = document.getElementById('final-team2');
const finalDetails = document.getElementById('final-details');

const teamColors = {
    "Kolkata Knight Riders": "#4B0082",
    "Sunrisers Hyderabad": "#FF4500",
    "Rajasthan Royals": "#1E90FF",
    "Royal Challengers Bengaluru": "#FF6347",
    "Chennai Super Kings": "#FFD700",
    "Delhi Capitals": "#0000FF",
    "Gujarat Titans": "#2F4F4F",
    "Lucknow Super Giants": "#00CED1",
    "Mumbai Indians": "#1E90FF",
    "Punjab Kings": "#DC143C"
};

// Load initial playoff data (IPL 2024)
fetchPlayoffData('2024');

// Update playoff on season change
playoffSeasonSelect.addEventListener('change', (e) => {
    const selectedSeason = e.target.value;
    fetchPlayoffData(selectedSeason);
});

function fetchPlayoffData(season) {
    fetch('playoffs.json')
        .then(response => response.json())
        .then(data => {
            const playoffData = data[season] || {
                qualifier_1: { teams: ["TBD", "TBD"], date: "TBD", stadium: "TBD", winner: "TBD" },
                eliminator: { teams: ["TBD", "TBD"], date: "TBD", stadium: "TBD", winner: "TBD" },
                qualifier_2: { teams: ["TBD", "TBD"], date: "TBD", stadium: "TBD", winner: "TBD" },
                final: { teams: ["TBD", "TBD"], date: "TBD", stadium: "TBD", winner: "TBD" }
            };

            // Qualifier 1
            qualifier1Team1.textContent = playoffData.qualifier_1.teams[0];
            qualifier1Team1.style.backgroundColor = teamColors[playoffData.qualifier_1.teams[0]] || '#666';
            qualifier1Team2.textContent = playoffData.qualifier_1.teams[1];
            qualifier1Team2.style.backgroundColor = teamColors[playoffData.qualifier_1.teams[1]] || '#666';
            qualifier1Details.textContent = `${playoffData.qualifier_1.date}, ${playoffData.qualifier_1.stadium}`;

            // Eliminator
            eliminatorTeam1.textContent = playoffData.eliminator.teams[0];
            eliminatorTeam1.style.backgroundColor = teamColors[playoffData.eliminator.teams[0]] || '#666';
            eliminatorTeam2.textContent = playoffData.eliminator.teams[1];
            eliminatorTeam2.style.backgroundColor = teamColors[playoffData.eliminator.teams[1]] || '#666';
            eliminatorDetails.textContent = `${playoffData.eliminator.date}, ${playoffData.eliminator.stadium}`;

            // Qualifier 2
            qualifier2Team1.textContent = playoffData.qualifier_2.teams[0];
            qualifier2Team1.style.backgroundColor = teamColors[playoffData.qualifier_2.teams[0]] || '#666';
            qualifier2Team2.textContent = playoffData.qualifier_2.teams[1];
            qualifier2Team2.style.backgroundColor = teamColors[playoffData.qualifier_2.teams[1]] || '#666';
            qualifier2Details.textContent = `${playoffData.qualifier_2.date}, ${playoffData.qualifier_2.stadium}`;

            // Final
            finalTeam1.innerHTML = playoffData.final.teams[0];
            finalTeam1.style.backgroundColor = teamColors[playoffData.final.teams[0]] || '#666';
            finalTeam2.innerHTML = playoffData.final.teams[1];
            finalTeam2.style.backgroundColor = teamColors[playoffData.final.teams[1]] || '#666';
            finalDetails.textContent = `${playoffData.final.date}, ${playoffData.final.stadium}`;

            // Add trophy to the winner of the final
            if (playoffData.final.winner !== "TBD") {
                const winnerTeam = playoffData.final.winner === playoffData.final.teams[0] ? finalTeam1 : finalTeam2;
                const trophyIcon = document.createElement('img');
                trophyIcon.src = 'assets/ipl-trophy.png';
                trophyIcon.alt = 'Trophy';
                trophyIcon.classList.add('trophy-icon');
                winnerTeam.appendChild(trophyIcon);
            }
        })
        .catch(error => console.error('Error fetching playoff data:', error));
}

// Particle Effect
function createParticles() {
    const playoffsSection = document.querySelector('.playoffs-section');
    const sectionRect = playoffsSection.getBoundingClientRect();
    const particleCount = 50;

    // Clear any existing particles
    const existingParticles = playoffsSection.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // Position within the section's bounds
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        playoffsSection.appendChild(particle);
    }
}

// Initialize particles when the playoffs section is shown
playoffsTab.addEventListener('click', () => {
    createParticles();
});

// Clean up particles when switching tabs to avoid performance issues
pointsTab.addEventListener('click', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
});