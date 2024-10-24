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
        event.preventDefault();  // Prevent page reload
        submitSurvey(questions, isPreWorkshop);  // Pass questions to the submit handler
    };
}

// New and fixed submitSurvey function
function submitSurvey(questions, isPreWorkshop) {
    const userAnswers = [];

    // Collect user's answers from the form
    questions.forEach((q) => {
        const selectedAnswer = document.querySelector(`input[name="question${q.questionId}"]:checked`);
        
        if (selectedAnswer) {
            userAnswers.push({
                questionId: q.questionId,
                selectedAnswer: selectedAnswer.value,  // Get the selected answer
                isCorrect: selectedAnswer.value === q.correctAnswerId  // Check if it's correct
            });
        } else {
            // If no answer is selected, push a placeholder
            userAnswers.push({
                questionId: q.questionId,
                selectedAnswer: null,
                isCorrect: false  // Mark as incorrect since no answer was provided
            });
        }
    });

    // Log the user's answers for debugging purposes (you can replace this with actual CSV saving)
    console.log('User Answers:', userAnswers);

    // Here is where you would send the answers to your CSV or API
    // You can use the GitHub Actions or any other back-end service to save this data

    alert("Survey submitted!");  // Notify the user of successful submission
}
