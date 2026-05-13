// ============================================================================
// MERGE FEATURE - frontend/js/features/merge.js
// ============================================================================

/**
 * Initialize merge feature
 */
function initializeMerge() {
    const mergeBtn = document.getElementById('mergeBtn');
    if (mergeBtn) {
        mergeBtn.addEventListener('click', performSmartMerge);
    }
    console.log('[Merge] Initialized');
}

/**
 * Perform smart merge on selected files
 */
async function performSmartMerge() {
    // Get selected files
    const checkboxes = document.querySelectorAll('#mergeFileList input[type="checkbox"]:checked');
    const selectedFiles = Array.from(checkboxes).map(cb => cb.value);

    if (selectedFiles.length === 0) {
        showNotification('❌ Please select at least 1 file to merge', 'error');
        return;
    }

    // Get format
    const format = document.querySelector('input[name="format"]:checked').value;

    showLoading(true, `Smart merging ${selectedFiles.length} file(s)...`);

    try {
        const response = await API.smartMerge(selectedFiles, format);

        // Show results
        const resultBox = document.getElementById('mergeResult');
        const statsText = document.getElementById('mergeStats');

        statsText.innerHTML = `
            <strong>✅ Merge Complete!</strong><br>
            <strong>Files merged:</strong> ${selectedFiles.length}<br>
            <strong>Unique lines extracted:</strong> ${response.unique_lines}<br>
            <strong>Output format:</strong> ${format.toUpperCase()}<br>
            <strong>File:</strong> ${response.filename}<br>
            <br>
            <em>Deduplication applied: Exact match → Word overlap → TF-IDF</em>
        `;

        resultBox.style.display = 'block';

        const downloadBtn = document.getElementById('downloadMerge');
        downloadBtn.onclick = () => downloadFile(response.filename);

        showNotification(`✅ Smart merge complete! ${response.unique_lines} unique lines extracted.`, 'success');

    } catch (error) {
        showNotification(`❌ Merge failed: ${error.message}`, 'error');
        console.error('Merge error:', error);
    } finally {
        showLoading(false);
    }
}