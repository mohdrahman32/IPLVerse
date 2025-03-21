document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS (assuming it's already in your main script)
    AOS.init();

    // Team name to abbreviation mapping
    const teamAbbreviations = {
        "Chennai Super Kings": "csk",
        "Kolkata Knight Riders": "kkr",
        "Sunrisers Hyderabad": "srh",
        "Delhi Capitals": "dc",
        "Royal Challengers Bengaluru": "rcb",
        "Mumbai Indians": "mi",
        "Punjab Kings": "pbks",
        "Gujarat Titans": "gt",
        "Rajasthan Royals": "rr",
        "Lucknow Super Giants": "lsg"
    };

    // Fetch schedule data
    fetch("schedule.json")
        .then(response => response.json())
        .then(schedule => {
            let currentMatchIndex = 0;
            const MATCH_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

            // DOM Elements
            const team1Logo = document.getElementById("team1-logo");
            const team2Logo = document.getElementById("team2-logo");
            const team1Name = document.getElementById("team1-name");
            const team2Name = document.getElementById("team2-name");
            const statusText = document.getElementById("status-text");
            const countdownTimer = document.getElementById("countdown-timer");
            const liveIndicator = document.getElementById("live-indicator");
            const venueDetails = document.getElementById("venue-details");
            const progressBar = document.getElementById("progress-bar");
            const daysEl = document.getElementById("days");
            const hoursEl = document.getElementById("hours");
            const minutesEl = document.getElementById("minutes");
            const secondsEl = document.getElementById("seconds");

            // Function to update UI for the current match
            function updateMatchUI() {
                const match = schedule[currentMatchIndex];
                const team1 = match.teams[0];
                const team2 = match.teams[1];

                // Update team details using abbreviation mapping
                team1Logo.src = `teams/${teamAbbreviations[team1]}.png`;
                team2Logo.src = `teams/${teamAbbreviations[team2]}.png`;
                team1Name.textContent = team1;
                team2Name.textContent = team2;
                venueDetails.textContent = `${match.venue} | ${match.date} at ${match.time}`;

                // Parse match start time
                const matchStartTime = new Date(`${match.date}T${match.time}:00`).getTime();
                const matchEndTime = matchStartTime + MATCH_DURATION;

                // Update UI based on current time
                updateStatus(matchStartTime, matchEndTime);
            }

            // Function to update status (Countdown, Live, or Next Match)
            function updateStatus(startTime, endTime) {
                const now = new Date().getTime();

                if (now < startTime) {
                    // Countdown Mode
                    statusText.textContent = "Next Match Countdown";
                    countdownTimer.classList.remove("hidden");
                    liveIndicator.classList.add("hidden");
                    particlesJSUnload(); // Remove particles if present

                    const timeLeft = startTime - now;
                    updateCountdown(timeLeft);
                    updateProgressBar(timeLeft, startTime - new Date(schedule[0].date).getTime());

                    if (!window.countdownInterval) {
                        window.countdownInterval = setInterval(() => {
                            const newTimeLeft = startTime - new Date().getTime();
                            if (newTimeLeft <= 0) {
                                clearInterval(window.countdownInterval);
                                window.countdownInterval = null;
                                updateStatus(startTime, endTime); // Switch to Live
                            } else {
                                updateCountdown(newTimeLeft);
                                updateProgressBar(newTimeLeft, startTime - new Date(schedule[0].date).getTime());
                            }
                        }, 1000);
                    }
                } else if (now >= startTime && now <= endTime) {
                    // Live Match Mode
                    statusText.textContent = "Match In Progress";
                    countdownTimer.classList.add("hidden");
                    liveIndicator.classList.remove("hidden");
                    progressBar.style.width = "100%";
                    particlesJSLoad(); // Load particle effects

                    if (window.countdownInterval) {
                        clearInterval(window.countdownInterval);
                        window.countdownInterval = null;
                    }

                    setTimeout(() => {
                        currentMatchIndex = (currentMatchIndex + 1) % schedule.length;
                        updateMatchUI();
                    }, endTime - now);
                } else {
                    // Post-Match Mode: Move to next match
                    currentMatchIndex = (currentMatchIndex + 1) % schedule.length;
                    updateMatchUI();
                }
            }

            // Update countdown timer
            function updateCountdown(timeLeft) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                daysEl.textContent = days < 10 ? `0${days}` : days;
                hoursEl.textContent = hours < 10 ? `0${hours}` : hours;
                minutesEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
                secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
            }

            // Update progress bar
            function updateProgressBar(timeLeft, totalTime) {
                const progress = ((totalTime - timeLeft) / totalTime) * 100;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }

            // Load Particles.js for Live Mode
            function particlesJSLoad() {
                if (!window.particlesJS) {
                    particlesJS("particles-js", {
                        particles: {
                            number: { value: 50, density: { enable: true, value_area: 800 } },
                            color: { value: "#ff4500" },
                            shape: { type: "circle" },
                            opacity: { value: 0.5, random: true },
                            size: { value: 3, random: true },
                            move: { enable: true, speed: 2, direction: "none", random: true }
                        },
                        interactivity: { detect_on: "canvas", events: { onhover: { enable: false } } }
                    });
                }
            }

            // Unload Particles.js
            function particlesJSUnload() {
                const canvas = document.querySelector("#particles-js canvas");
                if (canvas) canvas.remove();
                window.particlesJS = null;
            }

            // Initial UI update
            updateMatchUI();
        })
        .catch(error => console.error("Error fetching schedule:", error));
});