// ============================================================================
// CONFIGURATION - frontend/js/config.js
// ============================================================================

const CONFIG = {
    // API Configuration
    API_URL: 'http://localhost:5000',
    API_TIMEOUT: 30000,

    // Feature defaults
    SUMMARY_DEFAULT_SENTENCES: 5,
    KEYWORDS_DEFAULT_TOP: 15,
    LINES_DEFAULT_TOP: 20,
    FLASHCARDS_DEFAULT_COUNT: 10,
    QUIZ_DEFAULT_COUNT: 5,

    // UI Messages
    MESSAGES: {
        SUCCESS: '✅ Success!',
        ERROR: '❌ Error!',
        LOADING: '⏳ Loading...',
        WARNING: '⚠️ Warning!',
        INFO: 'ℹ️ Info',
    },

    // Colors
    COLORS: {
        PRIMARY: '#5349C8',
        SUCCESS: '#4CAF50',
        ERROR: '#F44336',
        WARNING: '#FFC107',
        INFO: '#2196F3',
    }
};

// Global state
window.appState = {
    currentTab: 'upload',
    isLoading: false,
    files: [],
    selectedFiles: [],
};

console.log('[Config] Loaded - API URL:', CONFIG.API_URL);