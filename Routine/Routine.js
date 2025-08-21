// Authentication check
document.addEventListener("DOMContentLoaded", () => {
    // Check if user is authenticated
    if (!sessionStorage.getItem('authToken')) {
        window.location.href = "login.html";
        return;
    }

    // Display username
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById('display-username').textContent = username;
    }

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize components
    renderCalendar();
    updateClock();
    setInterval(updateClock, 1000);
    renderTimetable();

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    });

    // PDF button
    document.getElementById('savePdfBtn').addEventListener('click', () => {
        window.print();
    });
});

// Calendar Script
function renderCalendar() {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    const monthYear = document.getElementById("monthYear");
    const daysContainer = document.getElementById("daysContainer");

    monthYear.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    daysContainer.innerHTML = '';

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;

        if (day === today) {
            dayElement.classList.add("today");
        }

        daysContainer.appendChild(dayElement);
    }
}

// Clock Script
function updateClock() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('clock').textContent = now.toLocaleTimeString([], options);
}

// Timetable Script
function renderTimetable() {
    const timetableData = {
        "2020-2021": {
            "Saturday": [
                { time: "8:00-9:50", subject: "ICTE 4363 (RI)", location: "Lecture Room 4001", colspan: 2 },
                { time: "10:00-11:50", subject: "ICTE 4331 (SA)", location: "Lecture Room 4001", colspan: 2 },
                { time: "1:00-2:50", subject: "ICTE 4332 (SA)", location: "Lab G-1 Room 1202", colspan: 2 },
                { time: "3:00-4:50", subject: "ICTE 4332 (SA)", location: "Lab G-2 Room 1202", colspan: 2 }
            ],
            "Sunday": [
                { time: "8:00-9:50", subject: "ICTE 4336 (FI)", location: "Lab G-1 Room 2701", colspan: 2 },
                { time: "10:00-11:50", subject: "ICTE 4364 (RI)", location: "Lab G-1 Room 4701", colspan: 2 },
                { time: "1:00-4:50", subject: "ACC 4301 (RB)", location: "Tutorial Room 1001", colspan: 4 }
            ],
            "Monday": [
                { time: "8:00-9:50", subject: "ACC 4333 (RB)", location: "Tutorial Room 2001", colspan: 2 },
                { time: "10:00-11:50", subject: "ICTE 4335 (FI)", location: "Tutorial Room 4001", colspan: 2 },
                { time: "1:00-2:50", subject: "ACC 4301 (RB)", location: "Lecture Room 1001", colspan: 2 },
                { time: "3:00-4:50", subject: "ICTE 4335 (FI)", location: "Lecture Room 4001", colspan: 2 }
            ],
            "Tuesday": [
                { time: "9:00-10:50", subject: "ICTE 4335 (FI)", location: "Tutorial Room 2001", colspan: 2 },
                { time: "12:00-1:50", subject: "ICTE 4331 (SA)", location: "Tutorial Room 4001", colspan: 2 }
            ],
            "Wednesday": [],
            "Thursday": []
        }
    };

    const tbody = document.getElementById("timetable-body");
    tbody.innerHTML = "";

    for (const [day, sessions] of Object.entries(timetableData["2020-2021"])) {
        const row = document.createElement("tr");
        
        // Day cell
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        dayCell.rowSpan = sessions.length > 0 ? sessions.length : 1;
        row.appendChild(dayCell);
        
        // Session cell
        const sessionCell = document.createElement("td");
        sessionCell.textContent = "2020-2021";
        sessionCell.rowSpan = sessions.length > 0 ? sessions.length : 1;
        row.appendChild(sessionCell);

        if (sessions.length === 0) {
            // Empty day
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = 9;
            emptyCell.textContent = "";
            row.appendChild(emptyCell);
            tbody.appendChild(row);
            continue;
        }

        // First session
        const firstSession = sessions[0];
        const timeCell = document.createElement("td");
        timeCell.colSpan = firstSession.colspan;
        timeCell.innerHTML = `${firstSession.subject}<br>${firstSession.location}`;
        row.appendChild(timeCell);
        
        // Fill remaining time slots
        let currentCol = firstSession.colspan;
        while (currentCol < 9) {
            const emptyCell = document.createElement("td");
            emptyCell.textContent = "";
            row.appendChild(emptyCell);
            currentCol++;
        }
        
        tbody.appendChild(row);

        // Additional sessions for the day
        for (let i = 1; i < sessions.length; i++) {
            const session = sessions[i];
            const sessionRow = document.createElement("tr");
            
            const sessionCell = document.createElement("td");
            sessionCell.colSpan = session.colspan;
            sessionCell.innerHTML = `${session.subject}<br>${session.location}`;
            sessionRow.appendChild(sessionCell);
            
            // Fill remaining time slots
            let currentCol = session.colspan;
            while (currentCol < 9) {
                const emptyCell = document.createElement("td");
                emptyCell.textContent = "";
                sessionRow.appendChild(emptyCell);
                currentCol++;
            }
            
            tbody.appendChild(sessionRow);
        }
    }
}