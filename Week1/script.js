let totalTasks = 0;
let completedTasks = 0;


// =========================
// GO TO PLANNER
// =========================

function goToPlanner() {

    document
        .getElementById("planner")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// =========================
// ADD SUBJECT
// =========================

function addSubject(
    subjectName = "",
    examDate = "",
    difficulty = "Medium"
) {

    const subjects = document.getElementById("subjects");


    const row = document.createElement("div");

    row.className = "subject-row";


    row.innerHTML = `

        <input
            type="text"
            class="subject-name"
            placeholder="Subject"
            value="${subjectName}"
        >


        <input
            type="date"
            class="exam-date"
            value="${examDate}"
        >


        <select class="difficulty">

            <option value="Easy"
                ${difficulty === "Easy" ? "selected" : ""}>
                Easy
            </option>

            <option value="Medium"
                ${difficulty === "Medium" ? "selected" : ""}>
                Medium
            </option>

            <option value="Hard"
                ${difficulty === "Hard" ? "selected" : ""}>
                Hard
            </option>

        </select>


        <button
            class="remove-button"
            onclick="removeSubject(this)"
        >
            ×
        </button>

    `;


    subjects.appendChild(row);

}


// =========================
// REMOVE SUBJECT
// =========================

function removeSubject(button) {

    button.parentElement.remove();

}


// =========================
// GENERATE PLAN
// =========================

function generatePlan() {

    const rows =
        document.querySelectorAll(".subject-row");


    const hours =
        Number(
            document.getElementById("hours").value
        );


    if (hours < 1) {

        alert(
            "Please enter at least 1 hour."
        );

        return;
    }


    let subjects = [];


    rows.forEach(row => {

        const name =
            row.querySelector(
                ".subject-name"
            ).value.trim();


        const date =
            row.querySelector(
                ".exam-date"
            ).value;


        const difficulty =
            row.querySelector(
                ".difficulty"
            ).value;


        if (name !== "") {

            subjects.push({

                name: name,

                date: date,

                difficulty: difficulty

            });

        }

    });


    if (subjects.length === 0) {

        alert(
            "Please add at least one subject."
        );

        return;
    }


    /*
        Difficulty weights

        Hard   = 3
        Medium = 2
        Easy   = 1
    */

    const weights = {

        Easy: 1,

        Medium: 2,

        Hard: 3

    };


    /*
        Calculate total weight
    */

    let totalWeight = 0;


    subjects.forEach(subject => {

        totalWeight +=
            weights[subject.difficulty];

    });


    /*
        Total available minutes
    */

    const totalMinutes =
        hours * 60;


    /*
        Sort difficult subjects first
    */

    subjects.sort((a, b) => {

        return (
            weights[b.difficulty]
            -
            weights[a.difficulty]
        );

    });


    /*
        Create study plan
    */

    let plan = [];


    subjects.forEach(subject => {

        let minutes =
            Math.round(

                (
                    weights[subject.difficulty]
                    /
                    totalWeight
                )
                *
                totalMinutes

            );


        /*
            Minimum 20 minutes
        */

        if (minutes < 20) {

            minutes = 20;

        }


        plan.push({

            ...subject,

            minutes: minutes

        });

    });


    displayPlan(plan);

}


// =========================
// DISPLAY PLAN
// =========================

function displayPlan(plan) {

    const result =
        document.getElementById("result");


    let html = `

        <div class="plan-header">

            <h3>
                ✦ Your Study Plan
            </h3>

            <span class="ai-badge">
                AI PRIORITIZED
            </span>

        </div>


        <p class="plan-description">

            Your plan gives more study time
            to difficult subjects.

        </p>

    `;


    plan.forEach((subject, index) => {

        let examText = "";


        if (subject.date !== "") {

            const date =
                new Date(
                    subject.date + "T00:00:00"
                );


            examText =
                "Exam: "
                +
                date.toLocaleDateString()
                +
                " · ";

        }


        html += `

            <label class="plan-task">

                <input
                    type="checkbox"
                    onchange="updateProgress(this)"
                >


                <div class="plan-info">

                    <strong>

                        ${index + 1}.
                        ${escapeHTML(subject.name)}

                    </strong>


                    <small>

                        ${examText}

                        ${subject.minutes}
                        minutes

                    </small>

                </div>


                <span class="badge">

                    ${subject.difficulty}

                </span>

            </label>

        `;

    });


    result.innerHTML = html;


    totalTasks = plan.length;

    completedTasks = 0;


    updateStats();


    result.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =========================
// UPDATE PROGRESS
// =========================

function updateProgress(checkbox) {

    if (checkbox.checked) {

        completedTasks++;

    } else {

        completedTasks--;

    }


    updateStats();

}


// =========================
// UPDATE STATISTICS
// =========================

function updateStats() {

    document.getElementById(
        "completed"
    ).textContent = completedTasks;


    document.getElementById(
        "total"
    ).textContent = totalTasks;


    let percentage = 0;


    if (totalTasks > 0) {

        percentage =
            Math.round(
                (completedTasks / totalTasks)
                * 100
            );

    }


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progress-fill"
    ).style.width =
        percentage + "%";

}


// =========================
// SECURITY
// =========================

function escapeHTML(text) {

    return text.replace(
        /[&<>"']/g,

        function (character) {

            const characters = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            };


            return characters[character];

        }
    );

}


// =========================
// DEFAULT SUBJECTS
// =========================

addSubject(
    "Database",
    "",
    "Hard"
);


addSubject(
    "Python",
    "",
    "Medium"
);


addSubject(
    "Statistics",
    "",
    "Hard"
);