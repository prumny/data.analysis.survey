// results.js

document.addEventListener("DOMContentLoaded", function() {
    loadResults();
});

async function loadResults() {
    const response = await fetch('csv/survey_responses.csv');
    const csvData = await response.text();
    const responses = parseCSV(csvData);

    // Calculate the results
    const userId = getCurrentUserId(); // Implement your logic for fetching the current user's ID
    const userResponses = responses.filter(r => r.user_id === userId);
    
    const improvement = calculateImprovement(userResponses);
    
    // Display the results on the page
    displayResults(improvement);
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const resultArray = [];

    lines.forEach(line => {
        const [user_id, question_id, pre_workshop_answer, post_workshop_answer, is_correct_pre, is_correct_post] = line.split(',');
        if (user_id) {
            resultArray.push({
                user_id: user_id.trim(),
                question_id: question_id.trim(),
                pre_workshop_answer: pre_workshop_answer.trim(),
                post_workshop_answer: post_workshop_answer.trim(),
                is_correct_pre: is_correct_pre.trim() === 'true',
                is_correct_post: is_correct_post.trim() === 'true'
            });
        }
    });

    return resultArray;
}

function calculateImprovement(userResponses) {
    let correctPre = 0;
    let correctPost = 0;

    userResponses.forEach(response => {
        if (response.is_correct_pre) {
            correctPre++;
        }
        if (response.is_correct_post) {
            correctPost++;
        }
    });

    const totalQuestions = userResponses.length;
    const improvement = ((correctPost - correctPre) / totalQuestions) * 100;
    
    return {
        totalQuestions: totalQuestions,
        correctPre: correctPre,
        correctPost: correctPost,
        improvement: improvement
    };
}

function displayResults(result) {
    const resultContainer = document.getElementById('results');
    resultContainer.innerHTML = `
        <p>Total Questions: ${result.totalQuestions}</p>
        <p>Correct Answers (Pre-Workshop): ${result.correctPre}</p>
        <p>Correct Answers (Post-Workshop): ${result.correctPost}</p>
        <h2>Improvement: ${result.improvement.toFixed(2)}%</h2>
    `;
}

function getCurrentUserId() {
    // Placeholder for actual logic to get the current user ID (e.g., from session storage or a query parameter)
    return "1"; // For now, assume a static user ID of "1"
}
