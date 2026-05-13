// ============================================================================
// UI MANAGER - frontend/js/ui.js
// ============================================================================

function initializeUI() {
    setupTabSwitching();
    setupLoadingOverlay();
    setupNotifications();
    console.log('[UI] Initialized');
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    appState.currentTab = tabName;
    console.log('[UI] Switched to tab:', tabName);
}

function setupLoadingOverlay() {
    console.log('[UI] Loading overlay ready');
}

function showLoading(show, message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');

    if (show) {
        overlay.style.display = 'flex';
        text.textContent = message;
        appState.isLoading = true;
    } else {
        overlay.style.display = 'none';
        appState.isLoading = false;
    }
}

function setupNotifications() {
    console.log('[UI] Notifications ready');
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    console.log(`[Notification] ${type.toUpperCase()}: ${message}`);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function updateQuickInfo(info) {
    const quickInfoDiv = document.getElementById('quickInfo');
    if (quickInfoDiv) {
        quickInfoDiv.innerHTML = `
            <p><strong>Files:</strong> <span id="fileCount">${info.fileCount || 0}</span></p>
            <p><strong>Status:</strong> <span id="statusInfo">${info.status || 'Ready'}</span></p>
        `;
    }
}