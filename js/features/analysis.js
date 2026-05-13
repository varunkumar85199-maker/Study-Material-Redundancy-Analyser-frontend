// ============================================================================
// ANALYSIS FEATURES - frontend/js/features/analysis.js
// ============================================================================

/**
 * Initialize analysis features
 */
function initializeAnalysis() {
    console.log('[Analysis] Initialized');
}

/**
 * Generate summary
 */
async function generateSummary() {
    const file = document.getElementById('summaryFile').value;
    const sentences = parseInt(document.getElementById('summaryCount').value);

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, 'Generating summary...');

    try {
        const response = await API.generateSummary([file], sentences);
        const resultBox = document.getElementById('summaryResult');

        resultBox.innerHTML = `
            <h4>📝 Summary (${sentences} sentences)</h4>
            <p>${response.combined || response.individual[file]}</p>
        `;
        resultBox.style.display = 'block';

        showNotification('✅ Summary generated!', 'success');
    } catch (error) {
        showNotification(`❌ Summary failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Generate keywords
 */
async function generateKeywords() {
    const file = document.getElementById('keywordsFile').value;
    const topN = parseInt(document.getElementById('keywordsCount').value);

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, 'Extracting keywords...');

    try {
        const response = await API.generateKeywords([file], topN);
        const resultBox = document.getElementById('keywordsResult');

        let html = `<h4>🔑 Top ${topN} Keywords</h4><div class="keywords-list">`;

        const keywords = response.combined || response.per_file[file] || [];
        keywords.forEach(kw => {
            html += `
                <span class="keyword-tag">
                    ${kw.word}
                    <span class="keyword-count">${kw.count}</span>
                </span>
            `;
        });
        html += '</div>';

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification(`✅ Keywords extracted! Found ${keywords.length} keywords.`, 'success');
    } catch (error) {
        showNotification(`❌ Keywords failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Generate important lines
 */
async function generateImportantLines() {
    const file = document.getElementById('linesFile').value;
    const topN = parseInt(document.getElementById('linesCount').value);

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, 'Extracting important lines...');

    try {
        const response = await API.generateImportantLines([file], topN);
        const resultBox = document.getElementById('linesResult');

        let html = `<h4>⭐ Top ${topN} Important Lines</h4>`;

        if (response.lines && response.lines.length > 0) {
            html += '<ol style="padding-left: 20px;">';
            response.lines.forEach(item => {
                const scorePercent = Math.round(item.score * 100);
                html += `
                    <li style="margin-bottom: 10px;">
                        <strong>${item.line}</strong><br>
                        <small style="color: #666;">Score: ${scorePercent}%</small>
                    </li>
                `;
            });
            html += '</ol>';
        } else {
            html += '<p>No significant lines found.</p>';
        }

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification(`✅ Important lines extracted! Found ${response.total} lines.`, 'success');
    } catch (error) {
        showNotification(`❌ Extraction failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Perform text search
 */
async function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();

    if (!query) {
        showNotification('❌ Please enter a search query', 'error');
        return;
    }

    // Get all files
    const response = await API.getFilesList();
    const files = response.files.map(f => f.name);

    if (files.length === 0) {
        showNotification('❌ No files available to search', 'error');
        return;
    }

    showLoading(true, `Searching for "${query}"...`);

    try {
        const searchResponse = await API.searchText(files, query);
        const resultBox = document.getElementById('searchResult');

        let html = `<h4>🔍 Search Results for "${query}"</h4>`;
        html += `<p><strong>Total matches: ${searchResponse.total_matches} across ${searchResponse.files_matched} file(s)</strong></p>`;

        if (searchResponse.files_matched === 0) {
            html += '<p>No matches found.</p>';
        } else {
            for (const [filename, data] of Object.entries(searchResponse.results)) {
                html += `
                    <div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                        <h5>${filename} (${data.count} match${data.count !== 1 ? 'es' : ''})</h5>
                `;
                data.matches.forEach(match => {
                    html += `<p style="margin: 5px 0;">• ${match}</p>`;
                });
                html += '</div>';
            }
        }

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification(`✅ Search complete! ${searchResponse.total_matches} matches found.`, 'success');
    } catch (error) {
        showNotification(`❌ Search failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Generate statistics
 */
async function generateStats() {
    const file = document.getElementById('statsFile').value;

    if (!file) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    showLoading(true, 'Analyzing file...');

    try {
        const response = await API.generateStats([file]);
        const resultBox = document.getElementById('statsResult');

        const stats = response.per_file[file];

        let html = `
            <h4>📊 File Statistics: ${stats.filename}</h4>
            <table class="stats-table">
                <tbody>
                    <tr>
                        <td><strong>Characters</strong></td>
                        <td>${stats.characters.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Words</strong></td>
                        <td>${stats.words.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Sentences</strong></td>
                        <td>${stats.sentences.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Unique Words</strong></td>
                        <td>${stats.unique_words.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Avg Word Length</strong></td>
                        <td>${stats.avg_word_length} characters</td>
                    </tr>
                    <tr>
                        <td><strong>Avg Sentence Length</strong></td>
                        <td>${stats.avg_sent_len} words</td>
                    </tr>
                    <tr>
                        <td><strong>Estimated Pages</strong></td>
                        <td>${stats.estimated_pages}</td>
                    </tr>
                    <tr>
                        <td><strong>Read Time</strong></td>
                        <td>${stats.read_time_min} minutes</td>
                    </tr>
                </tbody>
            </table>
        `;

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification('✅ Statistics generated!', 'success');
    } catch (error) {
        showNotification(`❌ Statistics failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Compare two files
 */
async function compareFiles() {
    const file1 = document.getElementById('compareFile1').value;
    const file2 = document.getElementById('compareFile2').value;

    if (!file1 || !file2) {
        showNotification('❌ Please select both files', 'error');
        return;
    }

    if (file1 === file2) {
        showNotification('❌ Please select different files', 'error');
        return;
    }

    showLoading(true, 'Comparing files...');

    try {
        const response = await API.compareFiles(file1, file2);
        const resultBox = document.getElementById('compareResult');

        let html = `
            <h4>🔀 File Comparison</h4>
            <table class="stats-table">
                <tbody>
                    <tr>
                        <td><strong>File 1</strong></td>
                        <td>${response.file1}</td>
                    </tr>
                    <tr>
                        <td><strong>File 2</strong></td>
                        <td>${response.file2}</td>
                    </tr>
                    <tr>
                        <td><strong>Word Overlap</strong></td>
                        <td>${response.word_overlap_pct}%</td>
                    </tr>
                    <tr>
                        <td><strong>Unique to File 1</strong></td>
                        <td>${response.unique_to_file1} words</td>
                    </tr>
                    <tr>
                        <td><strong>Unique to File 2</strong></td>
                        <td>${response.unique_to_file2} words</td>
                    </tr>
                </tbody>
            </table>
        `;

        if (response.common_keywords && response.common_keywords.length > 0) {
            html += '<h5 style="margin-top: 15px;">Common Keywords:</h5><div class="keywords-list">';
            response.common_keywords.forEach(kw => {
                html += `<span class="keyword-tag">${kw}</span>`;
            });
            html += '</div>';
        }

        if (response.similar_sentence_pairs && response.similar_sentence_pairs.length > 0) {
            html += '<h5 style="margin-top: 15px;">Similar Sentences:</h5>';
            response.similar_sentence_pairs.forEach((pair, i) => {
                html += `
                    <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                        <strong>Match ${i + 1} (${pair.similarity * 100}% similar)</strong><br>
                        <em>File 1:</em> ${pair.from_file1}<br>
                        <em>File 2:</em> ${pair.from_file2}
                    </div>
                `;
            });
        }

        resultBox.innerHTML = html;
        resultBox.style.display = 'block';

        showNotification('✅ Comparison complete!', 'success');
    } catch (error) {
        showNotification(`❌ Comparison failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}