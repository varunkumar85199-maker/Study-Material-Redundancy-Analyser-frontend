// ============================================================================
// QUIZ FEATURE - frontend/js/features/quiz.js
// ============================================================================

let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let userAnswers = [];

/**
 * Initialize quiz feature
 */
function initializeQuiz() {
    console.log('[Quiz] Initialized');
}

/**
 * Generate quiz
 */
async function generateQuiz() {
    const file = document.getElementById('quizFile').value;
    const count = parseInt(document.getElementById('quizCount').value);

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, `Generating ${count} quiz questions...`);

    try {
        const response = await API.generateQuiz([file], count);
        currentQuiz = response.quiz || [];

        if (currentQuiz.length === 0) {
            showNotification('❌ No questions could be generated from this file', 'error');
            return;
        }

        // Reset
        currentQuestionIndex = 0;
        quizScore = 0;
        userAnswers = new Array(currentQuiz.length).fill(null);

        // Show container
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('quizResults').style.display = 'none';

        // Display first question
        displayQuestion();

        showNotification(`✅ Quiz ready! ${currentQuiz.length} questions.`, 'success');

    } catch (error) {
        showNotification(`❌ Generation failed: ${error.message}`, 'error');
        console.error('Quiz error:', error);
    } finally {
        showLoading(false);
    }
}

/**
 * Display current question
 */
function displayQuestion() {
    if (currentQuiz.length === 0) return;

    const question = currentQuiz[currentQuestionIndex];
    const total = currentQuiz.length;

    // Update progress
    document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
    document.getElementById('quizScore').textContent = `Score: ${quizScore}/${total}`;

    // Update question
    document.getElementById('quizQuestion').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(option, question.answer);
        optionsContainer.appendChild(optionDiv);
    });

    // Show/hide buttons
    const nextBtn = document.getElementById('nextQuizBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (currentQuestionIndex < total - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    }
}

/**
 * Select an option
 */
function selectOption(selectedOption, correctAnswer) {
    // Store answer
    userAnswers[currentQuestionIndex] = selectedOption;

    // Mark option as selected
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');

        if (opt.textContent === selectedOption) {
            opt.classList.add('selected');
            if (selectedOption === correctAnswer) {
                opt.classList.add('correct');
                quizScore++;
            } else {
                opt.classList.add('incorrect');
            }
        }

        if (opt.textContent === correctAnswer && selectedOption !== correctAnswer) {
            opt.classList.add('correct');
        }
    });

    // Show next button
    const nextBtn = document.getElementById('nextQuizBtn');
    if (currentQuestionIndex < currentQuiz.length - 1) {
        nextBtn.style.display = 'inline-block';
    }
}

/**
 * Move to next question
 */
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

/**
 * Submit quiz and show results
 */
function submitQuiz() {
    const total = currentQuiz.length;
    const percentage = Math.round((quizScore / total) * 100);

    let feedback = '';
    if (percentage === 100) {
        feedback = '🎉 Perfect score! Outstanding!';
    } else if (percentage >= 80) {
        feedback = '🎊 Excellent work! You know this material well.';
    } else if (percentage >= 60) {
        feedback = '👍 Good job! Review the missed topics.';
    } else if (percentage >= 40) {
        feedback = '📚 Not bad. Study more and retake.';
    } else {
        feedback = '💪 Keep studying! You\'ll do better next time.';
    }

    document.getElementById('quizResults').style.display = 'block';
    document.getElementById('finalScore').innerHTML = `
        <strong>Your Score: ${quizScore}/${total} (${percentage}%)</strong><br>
        <br>
        ${feedback}
    `;

    // Hide quiz question box
    document.querySelector('.quiz-question-box').style.display = 'none';

    showNotification(`✅ Quiz submitted! Score: ${quizScore}/${total}`, 'success');
}

/**
 * Retake quiz
 */
function retakeQuiz() {
    // Reset
    currentQuestionIndex = 0;
    quizScore = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);

    // Show quiz, hide results
    document.querySelector('.quiz-question-box').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';

    displayQuestion();
}