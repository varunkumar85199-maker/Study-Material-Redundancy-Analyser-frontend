// ============================================================================
// MAIN INITIALIZATION - frontend/js/main.js
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 StudY MateriaL RedundancY AnalyseR ~ StudYSynC Frontend Initializing...');

    try {
        initializeUI();
        initializeUpload();
        initializeMerge();
        initializeAnalysis();
        initializeFlashcards();
        initializeQuiz();

        await checkServerHealthOnStartup();

        await refreshFilesList();
        await updateFileSelects();

        console.log('✅ StudY MateriaL RedundancY AnalyseR ~ StudYSynC Frontend Ready!');
        showNotification('✅ StudY MateriaL RedundancY AnalyseR ~ StudYSynC Ready!', 'success');

    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('❌ Initialization failed. Check console.', 'error');
    }
});

async function checkServerHealthOnStartup() {
    try {
        const health = await API.checkHealth();
        const statusIndicator = document.getElementById('serverStatus');
        const statusText = document.getElementById('statusText');

        if (health.status === 'online') {
            statusIndicator.style.color = '#4CAF50';
            statusText.textContent = 'Server Online';
        } else {
            statusIndicator.style.color = '#F44336';
            statusText.textContent = 'Server Offline';
        }
    } catch (error) {
        document.getElementById('serverStatus').style.color = '#F44336';
        document.getElementById('statusText').textContent = 'Server Offline';
        console.error('Health check failed:', error);
    }
}

async function checkServerHealth() {
    try {
        const health = await API.checkHealth();
        const resultBox = document.getElementById('healthResult');

        let html = `
            <h4>✅ Server Status</h4>
            <table class="stats-table">
                <tbody>
                    <tr>
                        <td><strong>Status</strong></td>
                        <td style="color: #4CAF50;">ONLINE</td>
                    </tr>
                    <tr>
                        <td><strong>Version</strong></td>
                        <td>${health.version}</td>
                    </tr>
                    <tr>
                        <td><strong>pdfplumber</strong></td>
                        <td>${health.pdfplumber ? '✅' : '❌'}</td>
                    </tr>
                    <tr>
                        <td><strong>scikit-learn</strong></td>
                        <td>${health.sklearn ? '✅' : '❌'}</td>
                    </tr>
                    <tr>
                        <td><strong>reportlab</strong></td>
                        <td>${health.reportlab ? '✅' : '❌'}</td>
                    </tr>
                    <tr>
                        <td><strong>python-docx</strong></td>
                        <td>${health.python_docx ? '✅' : '❌'}</td>
                    </tr>
                    <tr>
                        <td><strong>TF-IDF Threshold</strong></td>
                        <td>${health.tfidf_threshold}</td>
                    </tr>
                    <tr>
                        <td><strong>Word Overlap Min</strong></td>
                        <td>${health.word_overlap_min}</td>
                    </tr>
                    <tr>
                        <td><strong>Server Time</strong></td>
                        <td>${health.time}</td>
                    </tr>
                </tbody>
            </table>
        `;

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification('✅ Server health check complete!', 'success');
    } catch (error) {
        showNotification(`❌ Health check failed: ${error.message}`, 'error');
    }
}

async function exportToWord() {
    try {
        const response = await API.getFilesList();
        const files = response.files.map(f => f.name);

        if (files.length === 0) {
            showNotification('❌ No files to export', 'error');
            return;
        }

        showLoading(true, 'Exporting to Word...');

        const result = await API.exportToWord(files);
        showNotification(`✅ Exported! File: ${result.filename}`, 'success');

        setTimeout(() => {
            downloadFile(result.filename);
        }, 500);
    } catch (error) {
        showNotification(`❌ Export failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}