// survey.js

// Load the CSV file and parse the survey questions
async function loadSurvey(csvFile, isPreWorkshop) {
    try {
        const response = await fetch(csvFile);
        if (!response.ok) throw new Error('Failed to load survey data');
        const csvData = await response.text();
    
        // Parse the CSV data into questions
        const questions = parseCSV(csvData);
    
        // Render the questions dynamically
        renderQuestions(questions, isPreWorkshop);
    } catch (error) {
        console.error('Error loading survey:', error);
        alert('Failed to load the survey. Please try again later.');
    }
}

// Function to parse CSV data into a usable array of question objects
function parseCSV(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    const questions = [];

    // Loop through each line (starting from 1 to skip headers)
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(',');

        // Ensure the correct number of fields
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
                correctAnswerId: fields[6].trim()
            });
        }
    }
    return questions;
}

// Function to render the questions dynamically in the form
function renderQuestions(questions, isPreWorkshop) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';  // Clear the container before rendering

    // Loop through each question and append it to the form
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

    // Attach form submission handler
    document.getElementById('surveyForm').onsubmit = (event) => {
        event.preventDefault();  // Prevent page reload
        submitSurvey(questions, isPreWorkshop);  // Submit the survey data
    };
}

// Function to handle survey submission
function submitSurvey(questions, isPreWorkshop) {
    const userAnswers = [];

    // Collect user-selected answers
    questions.forEach((q) => {
        const selectedAnswer = document.querySelector(`input[name="question${q.questionId}"]:checked`);
        
        if (selectedAnswer) {
            userAnswers.push({
                questionId: q.questionId,
                selectedAnswer: selectedAnswer.value,  // Get selected answer value
                isCorrect: selectedAnswer.value === q.correctAnswerId  // Check if correct
            });
        } else {
            // If no answer is selected, mark it as incorrect
            userAnswers.push({
                questionId: q.questionId,
                selectedAnswer: null,
                isCorrect: false
            });
        }
    });

    // Check if the user actually answered any questions
    if (userAnswers.length === 0) {
        alert('Please answer at least one question.');
        return;
    }

    // Debugging: Log the user's answers to the console
    console.log('User Answers:', userAnswers);

    // Provide feedback to the user after submitting
    alert('Survey submitted successfully!');
}
