document.addEventListener('DOMContentLoaded', () => {
    // Team Data with Home Grounds
    const teamsData = {
        'Kolkata Knight Riders': { logo: 'teams/kkr.png', homeGround: 'Eden Gardens, Kolkata' },
        'Royal Challengers Bengaluru': { logo: 'teams/rcb.png', homeGround: 'M. Chinnaswamy Stadium, Bengaluru' },
        'Sunrisers Hyderabad': { logo: 'teams/srh.png', homeGround: 'Rajiv Gandhi International Stadium, Hyderabad' },
        'Rajasthan Royals': { logo: 'teams/rr.png', homeGround: 'Sawai Mansingh Stadium, Jaipur' },
        'Chennai Super Kings': { logo: 'teams/csk.png', homeGround: 'MA Chidambaram Stadium, Chennai' },
        'Mumbai Indians': { logo: 'teams/mi.png', homeGround: 'Wankhede Stadium, Mumbai' },
        'Delhi Capitals': { logo: 'teams/dc.png', homeGround: 'Arun Jaitley Stadium, Delhi' },
        'Lucknow Super Giants': { logo: 'teams/lsg.png', homeGround: 'BRSABV Ekana Cricket Stadium, Lucknow' },
        'Gujarat Titans': { logo: 'teams/gt.png', homeGround: 'Narendra Modi Stadium, Ahmedabad' },
        'Punjab Kings': { logo: 'teams/pbks.png', homeGround: 'Maharaja Yadavindra Singh International Cricket Stadium, New Chandigarh' }
    };

    let matches = [];
    let selectedTeam = null;
    let selectedVenue = '';

    // Elements
    const teamFilterButtons = document.getElementById('team-filter-buttons');
    const venueFilter = document.getElementById('venue-filter');
    const scheduleTable = document.getElementById('schedule-table');

    // Fetch Schedule Data
    fetch('schedule.json')
        .then(response => response.json())
        .then(data => {
            matches = data;
            populateTeamButtons();
            populateVenueFilter();
            displayMatches(matches); // Initially display all matches
        })
        .catch(error => console.error('Error loading schedule:', error));

    // Populate Team Filter Buttons
    function populateTeamButtons() {
        // Add "All Teams" button
        const allButton = document.createElement('button');
        allButton.className = 'bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition duration-300 hvr-grow';
        allButton.textContent = 'All Teams';
        allButton.addEventListener('click', () => {
            selectedTeam = null;
            filterMatches();
        });
        teamFilterButtons.appendChild(allButton);

        // Add Team Logo Buttons
        Object.keys(teamsData).forEach(team => {
            const button = document.createElement('button');
            button.className = 'w-16 h-16 rounded-full hover:bg-orange-500 transition duration-300 hvr-grow';
            const img = document.createElement('img');
            img.src = teamsData[team].logo;
            img.alt = team;
            img.className = 'w-full h-full object-contain rounded-full';
            button.appendChild(img);
            button.addEventListener('click', () => {
                selectedTeam = team;
                filterMatches();
            });
            teamFilterButtons.appendChild(button);
        });
    }

    // Populate Venue Filter Dropdown
    function populateVenueFilter() {
        const venues = [...new Set(matches.map(match => match.venue))]; // Unique venues
        venues.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue;
            option.textContent = venue;
            venueFilter.appendChild(option);
        });

        // Add event listener for venue selection
        venueFilter.addEventListener('change', (e) => {
            selectedVenue = e.target.value;
            filterMatches();
        });
    }

    // Filter and Display Matches
    function filterMatches() {
        let filteredMatches = matches;

        // Filter by team if selected
        if (selectedTeam) {
            filteredMatches = filteredMatches.filter(match => match.teams.includes(selectedTeam));
        }

        // Filter by venue if selected
        if (selectedVenue) {
            filteredMatches = filteredMatches.filter(match => match.venue === selectedVenue);
        }

        displayMatches(filteredMatches);
    }

    // Display Matches in Table
    function displayMatches(matchesToDisplay) {
        scheduleTable.innerHTML = '';
        matchesToDisplay.forEach((match, index) => {
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700';

            // Match No.
            const matchNoCell = document.createElement('td');
            matchNoCell.className = 'p-4';
            matchNoCell.textContent = match.id;
            row.appendChild(matchNoCell);

            // Date
            const dateCell = document.createElement('td');
            dateCell.className = 'p-4';
            dateCell.textContent = match.date;
            row.appendChild(dateCell);

            // Time
            const timeCell = document.createElement('td');
            timeCell.className = 'p-4';
            timeCell.textContent = match.time;
            row.appendChild(timeCell);

            // Teams
            const teamsCell = document.createElement('td');
            teamsCell.className = 'p-4';
            teamsCell.textContent = match.teams.join(' vs ');
            row.appendChild(teamsCell);

            // Venue with Conditional Icons
            const venueCell = document.createElement('td');
            venueCell.className = 'p-4 flex items-center space-x-2';
            venueCell.textContent = match.venue;

            // Add icons only when a team is selected
            if (selectedTeam) {
                const teamData = teamsData[selectedTeam];
                const isHomeGround = teamData.homeGround === match.venue;
                const icon = document.createElement('i');
                icon.className = `fas ${isHomeGround ? 'fa-home text-green-400' : 'fa-plane text-red-500'}`;
                venueCell.appendChild(icon);
            }

            row.appendChild(venueCell);
            scheduleTable.appendChild(row);
        });
    }
});