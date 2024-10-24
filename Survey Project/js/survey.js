// survey.js

async function loadSurvey(csvFile, isPreWorkshop) {
    const response = await fetch(csvFile);
    const csvData = await response.text();
    const questions = parseCSV(csvData);
    renderQuestions(questions, isPreWorkshop);
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const questions = [];

    lines.forEach(line => {
        const [questionId, questionText, ...answers] = line.split(',');
        questions.push({ questionId, questionText, answers });
    });

    return questions;
}

function renderQuestions(questions, isPreWorkshop) {
    const questionsContainer = document.getElementById('questions');
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.questionText}</p>
            ${q.answers.map((answer, i) => `
                <label>
                    <input type="radio" name="question${q.questionId}" value="${i + 1}">
                    ${answer}
                </label><br>
            `).join('')}
        `;
        questionsContainer.appendChild(questionDiv);
    });

    document.getElementById('surveyForm').onsubmit = (event) => {
        event.preventDefault();
        submitSurvey(isPreWorkshop);
    };
}

function submitSurvey(isPreWorkshop) {
    const answers = [];
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        answers.push(input.value);
    });

    // Submit answers via GitHub Action
    const surveyType = isPreWorkshop ? 'pre' : 'post';
    triggerGitHubAction(answers, surveyType);
}

function triggerGitHubAction(answers, surveyType) {
    fetch(`https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/actions/workflows/update-csv.yml/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer YOUR_GITHUB_TOKEN`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: {
                answers: JSON.stringify(answers),
                surveyType: surveyType
            }
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Survey submitted successfully');
        }
    });
}
