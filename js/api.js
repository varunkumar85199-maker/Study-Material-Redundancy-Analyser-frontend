// ============================================================================
// API CLIENT - frontend/js/api.js
// ============================================================================

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    async uploadFiles(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(`${this.baseURL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return await response.json();
    }

    async getFilesList() {
        return this.request('/files');
    }

    async deleteFile(filename) {
        return this.request(`/files/${filename}`, { method: 'DELETE' });
    }

    async checkHealth() {
        return this.request('/health');
    }

    async smartMerge(files, format = 'pdf') {
        return this.request('/smart-merge', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                format: format,
            }),
        });
    }

    async generateSummary(files, sentences = 5) {
        return this.request('/summary', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                sentences: sentences,
            }),
        });
    }

    async generateKeywords(files, top = 15) {
        return this.request('/keywords', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                top: top,
            }),
        });
    }

    async generateImportantLines(files, top = 20) {
        return this.request('/important-lines', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                top: top,
            }),
        });
    }

    async searchText(files, query) {
        return this.request('/search', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                query: query,
            }),
        });
    }

    async generateFlashcards(files, count = 10) {
        return this.request('/flashcards', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                count: count,
            }),
        });
    }

    async generateQuiz(files, count = 5) {
        return this.request('/quiz', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
                count: count,
            }),
        });
    }

    async generateStats(files) {
        return this.request('/stats', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
            }),
        });
    }

    async compareFiles(file1, file2) {
        return this.request('/compare', {
            method: 'POST',
            body: JSON.stringify({
                file1: file1,
                file2: file2,
            }),
        });
    }

    async exportToWord(files) {
        return this.request('/export-docx', {
            method: 'POST',
            body: JSON.stringify({
                files: files,
            }),
        });
    }

    async getOutputsList() {
        return this.request('/outputs');
    }

    async clearAll() {
        return this.request('/clear', { method: 'POST' });
    }
}

const API = new APIClient(CONFIG.API_URL);
console.log('[API] Initialized with URL:', CONFIG.API_URL);