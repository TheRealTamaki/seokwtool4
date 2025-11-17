// Main Application Logic
const API_BASE_URL = 'https://api.dataforseo.com/v3';

// State Management
let currentKeywords = [];
let currentSortColumn = null;
let currentSortDirection = 'desc';

// DOM Elements
const elements = {
    // Tabs
    tabKeyword: document.getElementById('tab-keyword'),
    tabDomain: document.getElementById('tab-domain'),

    // Search containers
    searchContainerKeyword: document.getElementById('search-container-keyword'),
    searchContainerDomain: document.getElementById('search-container-domain'),

    // Inputs
    keywordInput: document.getElementById('keyword-input'),
    domainInput: document.getElementById('domain-input'),
    locationSelect: document.getElementById('location-select'),

    // Buttons
    searchBtnKeyword: document.getElementById('search-btn-keyword'),
    searchBtnDomain: document.getElementById('search-btn-domain'),

    // Spinners
    searchSpinnerKeyword: document.getElementById('search-spinner-keyword'),
    searchSpinnerDomain: document.getElementById('search-spinner-domain'),
    searchTextKeyword: document.getElementById('search-text-keyword'),
    searchTextDomain: document.getElementById('search-text-domain'),

    // Results
    resultsSection: document.getElementById('results-section'),
    keywordTableBody: document.getElementById('keyword-table-body'),
    resultsCount: document.getElementById('results-count'),

    // PAA
    paaCard: document.getElementById('paa-card'),
    paaContent: document.getElementById('paa-content'),

    // AI Overview
    aiOverviewCard: document.getElementById('ai-overview-card'),
    aiOverviewContent: document.getElementById('ai-overview-content'),

    // Error
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),

    // Config Modal
    configModal: document.getElementById('config-modal'),
    apiLogin: document.getElementById('api-login'),
    apiPassword: document.getElementById('api-password'),
    saveConfigBtn: document.getElementById('save-config-btn')
};

// Initialize App
function init() {
    // Check if API is configured
    if (!apiConfig.isConfigured()) {
        showConfigModal();
    } else {
        hideConfigModal();
    }

    // Event Listeners
    elements.tabKeyword.addEventListener('click', () => switchTab('keyword'));
    elements.tabDomain.addEventListener('click', () => switchTab('domain'));

    elements.searchBtnKeyword.addEventListener('click', () => handleSearch('keyword'));
    elements.searchBtnDomain.addEventListener('click', () => handleSearch('domain'));

    elements.keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch('keyword');
    });

    elements.domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch('domain');
    });

    elements.saveConfigBtn.addEventListener('click', saveConfig);

    // Table sorting
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortTable(column);
        });
    });
}

// Config Modal
function showConfigModal() {
    elements.configModal.classList.remove('hidden');
}

function hideConfigModal() {
    elements.configModal.classList.add('hidden');
}

function saveConfig() {
    const login = elements.apiLogin.value.trim();
    const password = elements.apiPassword.value.trim();

    if (!login || !password) {
        showError('Please enter both API login and password');
        return;
    }

    apiConfig.save(login, password);
    hideConfigModal();
    hideError();
}

// Tab Switching
function switchTab(tab) {
    if (tab === 'keyword') {
        elements.tabKeyword.classList.add('tab-active');
        elements.tabDomain.classList.remove('tab-active');
        elements.searchContainerKeyword.classList.remove('hidden');
        elements.searchContainerDomain.classList.add('hidden');
    } else {
        elements.tabDomain.classList.add('tab-active');
        elements.tabKeyword.classList.remove('tab-active');
        elements.searchContainerDomain.classList.remove('hidden');
        elements.searchContainerKeyword.classList.add('hidden');
    }

    // Reset results
    hideResults();
}

// Search Handler
async function handleSearch(type) {
    hideError();

    if (!apiConfig.isConfigured()) {
        showError('Please configure your API credentials first');
        showConfigModal();
        return;
    }

    const input = type === 'keyword' ? elements.keywordInput.value.trim() : elements.domainInput.value.trim();

    if (!input) {
        showError(`Please enter a ${type === 'keyword' ? 'keyword' : 'domain'}`);
        return;
    }

    const location = parseInt(elements.locationSelect.value);

    if (type === 'keyword') {
        await searchKeywords(input, location);
    } else {
        await searchDomain(input, location);
    }
}

// Keyword Search
async function searchKeywords(keyword, location) {
    setLoading(true, 'keyword');

    try {
        // Get keyword ideas from multiple sources
        const [relatedKeywords, suggestions] = await Promise.all([
            getRelatedKeywords(keyword, location),
            getKeywordSuggestions(keyword, location)
        ]);

        // Combine and deduplicate keywords
        const allKeywords = [...relatedKeywords, ...suggestions];
        const uniqueKeywords = Array.from(new Set(allKeywords.map(k => k.keyword)))
            .map(kw => allKeywords.find(k => k.keyword === kw));

        if (uniqueKeywords.length === 0) {
            showError('No keyword ideas found. Try a different keyword.');
            setLoading(false, 'keyword');
            return;
        }

        // Get metrics for all keywords
        const keywordsWithMetrics = await getKeywordMetrics(uniqueKeywords, location);

        currentKeywords = keywordsWithMetrics;
        displayKeywords(keywordsWithMetrics);

        // Fetch PAA and AI Overview in parallel
        Promise.all([
            getPeopleAlsoAsk(keyword, location),
            getAIOverview(keyword, location)
        ]).then(([paa, aiOverview]) => {
            if (paa && paa.length > 0) {
                displayPeopleAlsoAsk(paa);
            }
            if (aiOverview) {
                displayAIOverview(aiOverview);
            }
        }).catch(err => {
            console.error('Error fetching additional data:', err);
        });

    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'Failed to fetch keyword data. Please check your API credentials.');
    } finally {
        setLoading(false, 'keyword');
    }
}

// Domain Search
async function searchDomain(domain, location) {
    setLoading(true, 'domain');

    try {
        const keywords = await getKeywordsForSite(domain, location);

        if (keywords.length === 0) {
            showError('No keywords found for this domain.');
            setLoading(false, 'domain');
            return;
        }

        currentKeywords = keywords;
        displayKeywords(keywords);

    } catch (error) {
        console.error('Domain search error:', error);
        showError(error.message || 'Failed to fetch domain data. Please check your API credentials.');
    } finally {
        setLoading(false, 'domain');
    }
}

// API Calls
async function getRelatedKeywords(keyword, location) {
    const response = await fetch(`${API_BASE_URL}/dataforseo_labs/google/related_keywords/live`, {
        method: 'POST',
        headers: {
            'Authorization': apiConfig.getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            keyword: keyword,
            location_code: location,
            language_code: 'en',
            limit: 50
        }])
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
        return data.tasks[0].result[0].items || [];
    }

    return [];
}

async function getKeywordSuggestions(keyword, location) {
    const response = await fetch(`${API_BASE_URL}/dataforseo_labs/google/keyword_suggestions/live`, {
        method: 'POST',
        headers: {
            'Authorization': apiConfig.getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            keyword: keyword,
            location_code: location,
            language_code: 'en',
            limit: 50
        }])
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
        return data.tasks[0].result[0].items || [];
    }

    return [];
}

async function getKeywordMetrics(keywords, location) {
    // Extract keyword strings
    const keywordList = keywords.map(k => k.keyword || k);

    // Get keyword overview data (includes volume, CPC)
    const response = await fetch(`${API_BASE_URL}/dataforseo_labs/google/bulk_keyword_difficulty/live`, {
        method: 'POST',
        headers: {
            'Authorization': apiConfig.getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            keywords: keywordList,
            location_code: location,
            language_code: 'en'
        }])
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
        return data.tasks[0].result[0].items || [];
    }

    return keywords.map(k => ({
        keyword: k.keyword || k,
        keyword_info: {
            search_volume: k.keyword_info?.search_volume || 0,
            cpc: k.keyword_info?.cpc || 0
        },
        keyword_properties: {
            keyword_difficulty: 0
        }
    }));
}

async function getKeywordsForSite(domain, location) {
    const response = await fetch(`${API_BASE_URL}/dataforseo_labs/google/ranked_keywords/live`, {
        method: 'POST',
        headers: {
            'Authorization': apiConfig.getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            target: domain,
            location_code: location,
            language_code: 'en',
            limit: 100
        }])
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
        return data.tasks[0].result[0].items || [];
    }

    return [];
}

async function getPeopleAlsoAsk(keyword, location) {
    try {
        const response = await fetch(`${API_BASE_URL}/serp/google/organic/live/advanced`, {
            method: 'POST',
            headers: {
                'Authorization': apiConfig.getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                keyword: keyword,
                location_code: location,
                language_code: 'en',
                device: 'desktop',
                os: 'windows'
            }])
        });

        if (!response.ok) {
            console.error('PAA API Error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
            const items = data.tasks[0].result[0].items || [];
            const paaItem = items.find(item => item.type === 'people_also_ask');

            if (paaItem && paaItem.items) {
                return paaItem.items;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching PAA:', error);
        return null;
    }
}

async function getAIOverview(keyword, location) {
    try {
        const response = await fetch(`${API_BASE_URL}/serp/google/organic/live/advanced`, {
            method: 'POST',
            headers: {
                'Authorization': apiConfig.getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                keyword: keyword,
                location_code: location,
                language_code: 'en',
                device: 'desktop',
                os: 'windows'
            }])
        });

        if (!response.ok) {
            console.error('AI Overview API Error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
            const items = data.tasks[0].result[0].items || [];
            const aiItem = items.find(item => item.type === 'ai_overview');

            if (aiItem) {
                return aiItem;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching AI Overview:', error);
        return null;
    }
}

// Display Functions
function displayKeywords(keywords) {
    elements.keywordTableBody.innerHTML = '';
    elements.resultsCount.textContent = `${keywords.length} keyword${keywords.length !== 1 ? 's' : ''} found`;

    keywords.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        const keyword = item.keyword || '-';
        const volume = item.keyword_info?.search_volume || item.search_volume || 0;
        const difficulty = item.keyword_properties?.keyword_difficulty || item.keyword_difficulty || 0;
        const cpc = item.keyword_info?.cpc || item.cpc || 0;

        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-900 font-medium">${keyword}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${volume.toLocaleString()}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}">
                    ${difficulty}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">$${cpc.toFixed(2)}</td>
        `;

        elements.keywordTableBody.appendChild(row);
    });

    elements.resultsSection.classList.remove('hidden');
}

function displayPeopleAlsoAsk(paaItems) {
    elements.paaContent.innerHTML = '';

    paaItems.forEach((item, index) => {
        const paaDiv = document.createElement('div');
        paaDiv.className = 'p-4';

        const question = item.title || item.question || 'Question not available';
        const answer = item.expanded_element?.[0]?.description || item.answer || 'Answer not available';

        paaDiv.innerHTML = `
            <button class="w-full text-left flex justify-between items-center group" onclick="togglePAA(${index})">
                <h3 class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">${question}</h3>
                <svg id="paa-icon-${index}" class="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div id="paa-answer-${index}" class="hidden mt-3 text-sm text-gray-600 leading-relaxed">
                ${answer}
            </div>
        `;

        elements.paaContent.appendChild(paaDiv);
    });

    elements.paaCard.classList.remove('hidden');
}

function displayAIOverview(aiOverview) {
    const text = aiOverview.text || aiOverview.description || 'No AI overview available';
    const references = aiOverview.references || aiOverview.links || [];

    let html = `
        <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">AI-Generated Summary</h3>
            <p class="text-sm text-gray-700 leading-relaxed">${text}</p>
        </div>
    `;

    if (references.length > 0) {
        html += `
            <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Sources Cited by AI</h3>
                <div class="space-y-2">
        `;

        references.forEach(ref => {
            const title = ref.title || ref.domain || 'Untitled';
            const url = ref.url || '#';
            const domain = ref.domain || new URL(url).hostname;

            html += `
                <div class="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex-1">
                        <a href="${url}" target="_blank" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                            ${title}
                        </a>
                        <p class="text-xs text-gray-500 mt-1">${domain}</p>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    elements.aiOverviewContent.innerHTML = html;
    elements.aiOverviewCard.classList.remove('hidden');
}

// Utility Functions
function getDifficultyColor(difficulty) {
    if (difficulty >= 70) return 'bg-red-100 text-red-800';
    if (difficulty >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
}

function setLoading(loading, type) {
    const btn = type === 'keyword' ? elements.searchBtnKeyword : elements.searchBtnDomain;
    const spinner = type === 'keyword' ? elements.searchSpinnerKeyword : elements.searchSpinnerDomain;
    const text = type === 'keyword' ? elements.searchTextKeyword : elements.searchTextDomain;

    btn.disabled = loading;

    if (loading) {
        spinner.classList.remove('hidden');
        text.classList.add('hidden');
        btn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        spinner.classList.add('hidden');
        text.classList.remove('hidden');
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

function hideResults() {
    elements.resultsSection.classList.add('hidden');
    elements.paaCard.classList.add('hidden');
    elements.aiOverviewCard.classList.add('hidden');
}

// Table Sorting
function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'desc';
    }

    // Update sort icons
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('asc', 'desc');
        if (header.dataset.column === column) {
            header.classList.add(currentSortDirection);
        }
    });

    // Sort data
    const sorted = [...currentKeywords].sort((a, b) => {
        let aVal, bVal;

        switch (column) {
            case 'keyword':
                aVal = (a.keyword || '').toLowerCase();
                bVal = (b.keyword || '').toLowerCase();
                break;
            case 'volume':
                aVal = a.keyword_info?.search_volume || a.search_volume || 0;
                bVal = b.keyword_info?.search_volume || b.search_volume || 0;
                break;
            case 'difficulty':
                aVal = a.keyword_properties?.keyword_difficulty || a.keyword_difficulty || 0;
                bVal = b.keyword_properties?.keyword_difficulty || b.keyword_difficulty || 0;
                break;
            case 'cpc':
                aVal = a.keyword_info?.cpc || a.cpc || 0;
                bVal = b.keyword_info?.cpc || b.cpc || 0;
                break;
            default:
                return 0;
        }

        if (column === 'keyword') {
            return currentSortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        } else {
            return currentSortDirection === 'asc'
                ? aVal - bVal
                : bVal - aVal;
        }
    });

    displayKeywords(sorted);
}

// PAA Toggle
function togglePAA(index) {
    const answer = document.getElementById(`paa-answer-${index}`);
    const icon = document.getElementById(`paa-icon-${index}`);

    answer.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
