// ============================================================================
// UPLOAD FEATURE - frontend/js/features/upload.js
// ============================================================================

/**
 * Initialize upload feature
 * - Setup drag-and-drop
 * - Handle file input
 * - Display uploaded files
 */
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click to select files
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0e8ff';
        uploadArea.style.borderColor = '#3C3489';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary-light');
        uploadArea.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        uploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files);
    });

    console.log('[Upload] Initialized');
}

/**
 * Handle file selection (from input or drag-drop)
 * @param {FileList} files - Files to upload
 */
async function handleFileSelect(files) {
    if (files.length === 0) return;

    // Validate file types
    const validFiles = Array.from(files).filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['pdf', 'docx', 'txt'].includes(ext)) {
            showNotification(`❌ ${file.name} - Invalid file type`, 'error');
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // Show loading
    showLoading(true, `Uploading ${validFiles.length} file(s)...`);

    try {
        // Call API to upload files
        const response = await API.uploadFiles(validFiles);

        if (response.uploaded && response.uploaded.length > 0) {
            showNotification(
                `✅ ${response.uploaded.length} file(s) uploaded successfully!`,
                'success'
            );

            // Refresh file list
            await refreshFilesList();

            // Update analysis file selects
            await updateFileSelects();

            // Clear input
            document.getElementById('fileInput').value = '';
        }
    } catch (error) {
        showNotification(`❌ Upload failed: ${error.message}`, 'error');
        console.error('Upload error:', error);
    } finally {
        showLoading(false);
    }
}

/**
 * Refresh the files list display
 */
async function refreshFilesList() {
    try {
        const response = await API.getFilesList();
        const filesList = document.getElementById('filesList');

        if (!response.files || response.files.length === 0) {
            filesList.innerHTML = '<p class="empty-state">No files uploaded yet</p>';
            document.getElementById('clearBtn').style.display = 'none';
            return;
        }

        // Build file list HTML
        let html = '';
        response.files.forEach(file => {
            html += `
                <div class="file-item">
                    <div class="file-name">
                        📄 ${file.name}
                    </div>
                    <div class="file-size">
                        ${file.size_kb} KB
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-info" onclick="downloadFile('${file.name}')" title="Download">
                            ⬇️
                        </button>
                        <button class="btn btn-danger" onclick="deleteFile('${file.name}')" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        filesList.innerHTML = html;
        document.getElementById('clearBtn').style.display = 'inline-block';

        // Update quick info
        document.getElementById('fileCount').textContent = response.count;
    } catch (error) {
        console.error('Error refreshing files:', error);
    }
}

/**
 * Delete a specific file
 * @param {string} filename - Name of file to delete
 */
async function deleteFile(filename) {
    if (!confirm(`Delete "${filename}"?`)) return;

    showLoading(true, 'Deleting...');

    try {
        await API.deleteFile(filename);
        showNotification(`✅ File deleted: ${filename}`, 'success');
        await refreshFilesList();
        await updateFileSelects();
    } catch (error) {
        showNotification(`❌ Delete failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Download a file from outputs
 * @param {string} filename - Name of file to download
 */
function downloadFile(filename) {
    const url = `${CONFIG.API_URL}/download/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    showNotification(`⬇️ Downloading: ${filename}`, 'info');
}

/**
 * Update all file select dropdowns
 */
async function updateFileSelects() {
    try {
        const response = await API.getFilesList();
        const files = response.files || [];

        const selects = [
            'summaryFile',
            'keywordsFile',
            'linesFile',
            'statsFile',
            'flashcardsFile',
            'quizFile',
            'mergeFileList',
            'compareFile1',
            'compareFile2'
        ];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            const currentValue = select.value;

            // Reset select
            if (selectId === 'mergeFileList') {
                // For merge, show checkboxes
                const container = document.getElementById(selectId);
                let html = '';
                if (files.length === 0) {
                    html = '<p class="empty-state">No files available</p>';
                } else {
                    files.forEach(file => {
                        html += `
                            <label class="file-checkbox">
                                <input type="checkbox" value="${file.name}">
                                <label>${file.name} (${file.size_kb} KB)</label>
                            </label>
                        `;
                    });
                }
                container.innerHTML = html;
            } else {
                // For other selects, show dropdown options
                select.innerHTML = '<option value="">-- Select file --</option>';
                files.forEach(file => {
                    const option = document.createElement('option');
                    option.value = file.name;
                    option.textContent = `${file.name} (${file.size_kb} KB)`;
                    select.appendChild(option);
                });
            }
        });

        console.log('[Upload] File selects updated');
    } catch (error) {
        console.error('Error updating file selects:', error);
    }
}

/**
 * Clear all files
 */
async function clearAllData() {
    if (!confirm('Delete ALL uploaded and output files? This cannot be undone!')) return;

    showLoading(true, 'Clearing all data...');

    try {
        await API.clearAll();
        showNotification('✅ All files cleared!', 'success');
        await refreshFilesList();
        await updateFileSelects();
    } catch (error) {
        showNotification(`❌ Clear failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}