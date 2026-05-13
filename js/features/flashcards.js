// ============================================================================
// FLASHCARDS FEATURE - frontend/js/features/flashcards.js
// ============================================================================

let currentFlashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

/**
 * Initialize flashcards feature
 */
function initializeFlashcards() {
    console.log('[Flashcards] Initialized');
}

/**
 * Generate flashcards
 */
async function generateFlashcards() {
    const file = document.getElementById('flashcardsFile').value;
    const count = parseInt(document.getElementById('flashcardsCount').value);

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, `Generating ${count} flashcards...`);

    try {
        const response = await API.generateFlashcards([file], count);
        currentFlashcards = response.flashcards || [];

        if (currentFlashcards.length === 0) {
            showNotification('❌ No flashcards could be generated from this file', 'error');
            return;
        }

        currentCardIndex = 0;
        isFlipped = false;

        // Show container
        document.getElementById('flashcardsContainer').style.display = 'block';

        // Display first card
        displayFlashcard();

        showNotification(`✅ Generated ${currentFlashcards.length} flashcards!`, 'success');

    } catch (error) {
        showNotification(`❌ Generation failed: ${error.message}`, 'error');
        console.error('Flashcard error:', error);
    } finally {
        showLoading(false);
    }
}

/**
 * Display current flashcard
 */
function displayFlashcard() {
    if (currentFlashcards.length === 0) return;

    const card = currentFlashcards[currentCardIndex];
    const flashcard = document.getElementById('flashcard');

    // Remove flipped class
    flashcard.classList.remove('flipped');
    isFlipped = false;

    // Update text
    document.getElementById('cardQuestion').textContent = card.question;
    document.getElementById('cardAnswer').textContent = card.answer;

    // Update progress
    const total = currentFlashcards.length;
    document.getElementById('cardProgress').textContent = `Card ${currentCardIndex + 1} of ${total}`;

    // Update progress bar
    const percentage = ((currentCardIndex + 1) / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
}

/**
 * Toggle flashcard flip
 */
function toggleFlashcard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

/**
 * Next card
 */
function nextCard() {
    if (currentCardIndex < currentFlashcards.length - 1) {
        currentCardIndex++;
        displayFlashcard();
    } else {
        showNotification('✅ You reached the last card!', 'info');
    }
}

/**
 * Previous card
 */
function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcard();
    } else {
        showNotification('ℹ️ You are on the first card', 'info');
    }
}

/**
 * Keyboard controls for flashcards
 */
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('flashcardsContainer') || document.getElementById('flashcardsContainer').style.display === 'none') {
        return;
    }

    if (e.code === 'ArrowRight') {
        nextCard();
    } else if (e.code === 'ArrowLeft') {
        previousCard();
    } else if (e.code === 'Space') {
        e.preventDefault();
        toggleFlashcard();
    }
});