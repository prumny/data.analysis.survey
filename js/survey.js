// survey.js

async function loadSurvey(csvFile, isPreWorkshop) {
    const response = await fetch(csvFile);
    const csvData = await response.text();
    
    // Parse the CSV data
    const questions = parseCSV(csvData);

    // Render the questions properly
    renderQuestions(questions, isPreWorkshop);
}

// Improved CSV Parsing Function
function parseCSV(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    const questions = [];

    for (let i = 1; i < lines.length; i++) { // Start at 1 to skip headers
        const fields = lines[i].split(',');

        // Ensure all fields exist for a question
        if (fields.length >= 6) {
            questions.push({
                questionId: fields[0].trim(),
                questionText: fields[1].trim(),
                answers: [
                    fields[2].trim(),
                    fields[3].trim(),
                    fields[4].trim(),
                    fields[5].trim(),
                ],
                correctAnswerId: fields[6].trim() // This is the correct answer
            });
        }
    }
    return questions;
}

// Fixed function to render questions to the form
function renderQuestions(questions, isPreWorkshop) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';  // Clear the container first

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');

        // Render question text and answers properly
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

    // Attach form submission handling
    document.getElementById('surveyForm').onsubmit = (event) => {
        event.preventDefault();
        submitSurvey(isPreWorkshop);
    };
}
