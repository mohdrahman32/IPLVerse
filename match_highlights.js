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

// Team Colors and Logo Mapping
const teamColors = {
    "Royal Challengers Bengaluru": "#FF6347",
    "Chennai Super Kings": "#FFD700",
    "Delhi Capitals": "#0000FF",
    "Punjab Kings": "#DC143C",
    "Kolkata Knight Riders": "#4B0082",
    "Sunrisers Hyderbad": "#FF4500",
    "Rajasthan Royals": "#1E90FF",
    "Lucknow Super Gaints": "#00CED1",
    "Gujarat Titans": "#2F4F4F",
    "Mumbai Indians": "#1E90FF"
};

const teamLogos = {
    "Royal Challengers Bengaluru": "teams/rcb.png",
    "Chennai Super Kings": "teams/csk.png",
    "Delhi Capitals": "teams/dc.png",
    "Punjab Kings": "teams/pbks.png",
    "Kolkata Knight Riders": "teams/kkr.png",
    "Sunrisers Hyderbad": "teams/srh.png",
    "Rajasthan Royals": "teams/rr.png",
    "Lucknow Super Gaints": "teams/lsg.png",
    "Gujarat Titans": "teams/gt.png",
    "Mumbai Indians": "teams/mi.png"
};

// Fetch and Display Matches
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const matchGrid = document.getElementById('match-grid');

    function displayMatches(matches) {
        matchGrid.innerHTML = '';
        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.classList.add('match-card', 'p-4', 'shadow-lg', 'hover:shadow-xl', 'transition-all');
            matchCard.style.backgroundColor = teamColors[match.teams[0]] || '#2d2d2d';
            matchCard.dataset.matchId = match.match_id;

            // Determine the match title based on match_id
            let matchTitle = `Match - ${match.match_id}: ${match.teams[0]} vs ${match.teams[1]}`;
            if (match.match_id === 71) {
                matchTitle = `Match - ${match.match_id} (Playoffs: Semi Finals-1): ${match.teams[0]} vs ${match.teams[1]}`;
            } else if (match.match_id === 72) {
                matchTitle = `Match - ${match.match_id} (Playoffs: Eliminators): ${match.teams[0]} vs ${match.teams[1]}`;
            } else if (match.match_id === 73) {
                matchTitle = `Match - ${match.match_id} (Playoffs: Semi Finals-2): ${match.teams[0]} vs ${match.teams[1]}`;
            } else if (match.match_id === 74) {
                matchTitle = `Match - ${match.match_id} (Playoffs: Finals): ${match.teams[0]} vs ${match.teams[1]}`;
            }

            matchCard.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <img src="${teamLogos[match.teams[0]]}" alt="${match.teams[0]} Logo" class="team-logo mr-2">
                        <h3 class="text-lg font-bold">${matchTitle}</h3>
                    </div>
                </div>
                <p class="text-sm text-gray-300">Date: ${match.date} | Venue: ${match.venue}</p>
                <p class="text-md font-semibold mt-2">Score: ${match.scorecard.team1} vs ${match.scorecard.team2}</p>
                <p class="text-md font-semibold">Result: ${match.scorecard.result}</p>
                <p class="text-sm text-gray-400 mt-1">Player of the Match: ${match.player_of_match}</p>
                ${match.match_id === 74 && match.player_of_Tournament ? `<p class="text-sm text-gray-400">Player of the Tournament: ${match.player_of_Tournament}</p>` : ''}
                <p class="text-sm text-gray-400">Toss: ${match.Toss}</p>
                <div class="hidden expanded-content mt-4" style="overflow: hidden; transition: max-height 0.5s ease;">
                    <div class="highlight-image relative">
                        <img src="highlights/match-${match.match_id}.jpg" alt="Match ${match.match_id} Highlights" class="w-full h-auto">
                        <a href="${match.highlight_video}" target="_blank" class="video-button">Watch Highlights</a>
                    </div>
                    <div class="mt-2 text-sm">
                        <p><strong>Scorecard:</strong> ${match.scorecard.team1} vs ${match.scorecard.team2}</p>
                        <p><strong>Result:</strong> ${match.scorecard.result}</p>
                        <p><strong>Player of the Match:</strong> ${match.player_of_match}</p>
                        ${match.match_id === 74 && match.player_of_Tournament ? `<p><strong>Player of the Tournament:</strong> ${match.player_of_Tournament}</p>` : ''}
                        <p><strong>Toss:</strong> ${match.Toss}</p>
                    </div>
                </div>
            `;

            // Expand/Collapse Functionality with Smooth Drop Effect
            matchCard.addEventListener('click', (e) => {
                // Prevent the click on the video button from triggering the card expansion
                if (e.target.classList.contains('video-button')) return;

                const expandedContent = matchCard.querySelector('.expanded-content');
                const isExpanded = !expandedContent.classList.contains('hidden');

                // Close all other expanded cards
                document.querySelectorAll('.match-card').forEach(card => {
                    const otherContent = card.querySelector('.expanded-content');
                    if (otherContent !== expandedContent && !otherContent.classList.contains('hidden')) {
                        otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                        setTimeout(() => {
                            otherContent.classList.add('hidden');
                            otherContent.style.maxHeight = '0';
                        }, 10);
                    }
                });

                if (!isExpanded) {
                    expandedContent.classList.remove('hidden');
                    // Set max-height to content height for smooth drop
                    expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
                } else {
                    expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
                    setTimeout(() => {
                        expandedContent.style.maxHeight = '0';
                        setTimeout(() => {
                            expandedContent.classList.add('hidden');
                        }, 500); // Match transition duration
                    }, 10);
                }
            });

            matchGrid.appendChild(matchCard);
        });
    }

    // Fetch and Initial Display
    fetch('match_highlights.json')
        .then(response => response.json())
        .then(data => {
            displayMatches(data.matches);

            // Search Functionality
            searchBar.addEventListener('input', () => {
                const searchTerm = searchBar.value.toLowerCase().trim();
                const filteredMatches = data.matches.filter(match => 
                    match.teams[0].toLowerCase().includes(searchTerm) || 
                    match.teams[1].toLowerCase().includes(searchTerm)
                );
                displayMatches(filteredMatches);
            });
        })
        .catch(error => console.error('Error fetching match highlights:', error));
});