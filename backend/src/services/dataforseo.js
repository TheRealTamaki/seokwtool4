const fetch = require('node-fetch');
require('dotenv').config();

const API_BASE_URL = 'https://api.dataforseo.com/v3';

class DataForSEOService {
  constructor() {
    this.login = process.env.DATAFORSEO_LOGIN;
    this.password = process.env.DATAFORSEO_PASSWORD;

    if (!this.login || !this.password) {
      console.warn('⚠ DataForSEO credentials not configured. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env');
    }
  }

  getAuthHeader() {
    const credentials = Buffer.from(`${this.login}:${this.password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async makeRequest(endpoint, payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`DataForSEO API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DataForSEO API Error:', error);
      throw error;
    }
  }

  // Get related keywords
  async getRelatedKeywords(keyword, locationCode = 2840, languageCode = 'en', limit = 50) {
    const payload = [{
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      limit
    }];

    const data = await this.makeRequest('dataforseo_labs/google/related_keywords/live', payload);

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
      return data.tasks[0].result[0].items || [];
    }

    return [];
  }

  // Get keyword suggestions
  async getKeywordSuggestions(keyword, locationCode = 2840, languageCode = 'en', limit = 50) {
    const payload = [{
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      limit
    }];

    const data = await this.makeRequest('dataforseo_labs/google/keyword_suggestions/live', payload);

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
      return data.tasks[0].result[0].items || [];
    }

    return [];
  }

  // Get keyword metrics (difficulty, volume, CPC)
  async getKeywordMetrics(keywords, locationCode = 2840, languageCode = 'en') {
    const payload = [{
      keywords,
      location_code: locationCode,
      language_code: languageCode
    }];

    const data = await this.makeRequest('dataforseo_labs/google/bulk_keyword_difficulty/live', payload);

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
      return data.tasks[0].result[0].items || [];
    }

    return [];
  }

  // Get keywords for a domain
  async getKeywordsForDomain(domain, locationCode = 2840, languageCode = 'en', limit = 100) {
    const payload = [{
      target: domain,
      location_code: locationCode,
      language_code: languageCode,
      limit
    }];

    const data = await this.makeRequest('dataforseo_labs/google/ranked_keywords/live', payload);

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
      return data.tasks[0].result[0].items || [];
    }

    return [];
  }

  // Get SERP data (includes PAA and AI Overview)
  async getSERPData(keyword, locationCode = 2840, languageCode = 'en') {
    const payload = [{
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      device: 'desktop',
      os: 'windows'
    }];

    const data = await this.makeRequest('serp/google/organic/live/advanced', payload);

    if (data.tasks && data.tasks[0] && data.tasks[0].result && data.tasks[0].result[0]) {
      const items = data.tasks[0].result[0].items || [];

      // Extract People Also Ask
      const paaItem = items.find(item => item.type === 'people_also_ask');
      const paa = paaItem ? paaItem.items : [];

      // Extract AI Overview
      const aiOverviewItem = items.find(item => item.type === 'ai_overview');
      const aiOverview = aiOverviewItem || null;

      // Extract organic results
      const organicResults = items.filter(item => item.type === 'organic');

      return {
        paa,
        aiOverview,
        organicResults
      };
    }

    return {
      paa: [],
      aiOverview: null,
      organicResults: []
    };
  }

  // Comprehensive keyword research (combines multiple endpoints)
  async comprehensiveKeywordResearch(keyword, locationCode = 2840, languageCode = 'en') {
    try {
      // Run requests in parallel
      const [relatedKeywords, suggestions, serpData] = await Promise.all([
        this.getRelatedKeywords(keyword, locationCode, languageCode),
        this.getKeywordSuggestions(keyword, locationCode, languageCode),
        this.getSERPData(keyword, locationCode, languageCode)
      ]);

      // Combine and deduplicate keywords
      const allKeywords = [...relatedKeywords, ...suggestions];
      const uniqueKeywordsMap = new Map();

      allKeywords.forEach(kw => {
        if (!uniqueKeywordsMap.has(kw.keyword)) {
          uniqueKeywordsMap.set(kw.keyword, kw);
        }
      });

      const uniqueKeywords = Array.from(uniqueKeywordsMap.values());

      // Get metrics for all keywords
      const keywordStrings = uniqueKeywords.map(kw => kw.keyword);
      const metrics = await this.getKeywordMetrics(keywordStrings, locationCode, languageCode);

      return {
        keywords: metrics,
        paa: serpData.paa,
        aiOverview: serpData.aiOverview,
        organicResults: serpData.organicResults
      };
    } catch (error) {
      console.error('Comprehensive keyword research error:', error);
      throw error;
    }
  }
}

module.exports = new DataForSEOService();
