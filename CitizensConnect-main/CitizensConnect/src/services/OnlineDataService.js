class OnlineDataService {
  constructor() {
    this.lastUpdateKey = 'onlineIssuesLastUpdate';
    this.cacheKey = 'onlineIssuesCache';
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Check if data needs to be updated (older than 24 hours)
  needsUpdate() {
    const lastUpdate = localStorage.getItem(this.lastUpdateKey);
    if (!lastUpdate) return true;

    const lastUpdateTime = new Date(lastUpdate).getTime();
    const currentTime = new Date().getTime();
    return (currentTime - lastUpdateTime) > this.updateInterval;
  }

  // Get cached data
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error reading cached online issues:', error);
      return [];
    }
  }

  // Save data to cache
  saveToCache(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
      localStorage.setItem(this.lastUpdateKey, new Date().toISOString());
    } catch (error) {
      console.error('Error saving online issues to cache:', error);
    }
  }

  // Convert news article to issue format
  convertToIssue(article, source) {
    // Use URL as stable ID for consistent identification across refreshes
    const stableId = article.url ? `online_${article.url.replace(/[^a-zA-Z0-9]/g, '').substr(0, 20)}` : `online_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: stableId,
      title: article.title,
      description: article.description || article.content || 'No description available',
      category: this.categorizeArticle(article),
      priority: this.determinePriority(article),
      status: 'open',
      author: source.name,
      authorId: `online_${source.id}`,
      authorRole: 'Online Source',
      upvotes: 31,
      voters: [],
      progress: Math.floor(Math.random() * 101), // Random progress 0-100
      createdAt: article.publishedAt || new Date().toISOString(),
      location: this.extractLocation(article),
      source: source,
      url: article.url,
      imageUrl: article.urlToImage,
      isOnlineIssue: true,
      lastUpdated: new Date().toISOString()
    };
  }

  // Categorize article based on content
  categorizeArticle(article) {
    const title = article.title.toLowerCase();
    const description = (article.description || '').toLowerCase();

    const text = title + ' ' + description;

    if (text.includes('pothole') || text.includes('road') || text.includes('infrastructure') || text.includes('construction')) {
      return 'Infrastructure';
    }
    if (text.includes('water') || text.includes('sanitation') || text.includes('electricity') || text.includes('power')) {
      return 'Utilities';
    }
    if (text.includes('health') || text.includes('hospital') || text.includes('medical') || text.includes('covid')) {
      return 'Healthcare';
    }
    if (text.includes('education') || text.includes('school') || text.includes('college') || text.includes('university')) {
      return 'Education';
    }
    if (text.includes('traffic') || text.includes('transport') || text.includes('parking')) {
      return 'Transportation';
    }
    if (text.includes('police') || text.includes('crime') || text.includes('safety') || text.includes('security')) {
      return 'Public Safety';
    }
    if (text.includes('environment') || text.includes('pollution') || text.includes('waste') || text.includes('garbage')) {
      return 'Environment';
    }

    return 'Other';
  }

  // Determine priority based on content keywords
  determinePriority(article) {
    const title = article.title.toLowerCase();
    const description = (article.description || '').toLowerCase();
    const text = title + ' ' + description;

    // Urgent keywords
    if (text.includes('emergency') || text.includes('crisis') || text.includes('disaster') ||
        text.includes('accident') || text.includes('death') || text.includes('fatal')) {
      return 'urgent';
    }

    // High priority keywords
    if (text.includes('urgent') || text.includes('critical') || text.includes('severe') ||
        text.includes('major') || text.includes('breaking')) {
      return 'high';
    }

    // Medium priority keywords
    if (text.includes('important') || text.includes('concern') || text.includes('issue') ||
        text.includes('problem') || text.includes('complaint')) {
      return 'medium';
    }

    return 'low';
  }

  // Extract location from article
  extractLocation(article) {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();

    // Common locations in Andhra Pradesh/India context
    const locations = [
      'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur', 'Nellore', 'Kurnool',
      'Rajahmundry', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Chittoor',
      'Andhra Pradesh', 'Telangana', 'Hyderabad', 'Chennai', 'Bangalore'
    ];

    for (const location of locations) {
      if (text.includes(location.toLowerCase())) {
        return location;
      }
    }

    return 'General';
  }

  // Fetch data from NewsAPI (requires API key)
  async fetchFromNewsAPI() {
    try {
      // Using NewsAPI with Andhra Pradesh/Telugu news focus
      const apiKey = process.env.REACT_APP_NEWS_API_KEY || 'demo_key';
      const url = `https://newsapi.org/v2/everything?q=(Andhra+Pradesh+OR+Vijayawada+OR+Visakhapatnam)+AND+(infrastructure+OR+roads+OR+water+OR+electricity+OR+health+OR+education)&language=en&sortBy=publishedAt&apiKey=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('NewsAPI request failed');

      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.warn('NewsAPI fetch failed:', error);
      return [];
    }
  }

  // Fetch from government RSS feeds or public APIs
  async fetchFromGovernmentSources() {
    try {
      // Andhra Pradesh government news RSS (mock implementation)
      const governmentNews = [
        {
          title: 'AP Government Launches Smart City Initiative in Vijayawada',
          description: 'The Andhra Pradesh government has announced a comprehensive smart city project in Vijayawada focusing on digital infrastructure and citizen services.',
          publishedAt: new Date().toISOString(),
          url: 'https://ap.gov.in/smart-city-initiative',
          source: { id: 'apgov', name: 'Andhra Pradesh Government' }
        },
        {
          title: 'Water Supply Enhancement Project Completed in Rural Areas',
          description: 'The Rural Water Supply Department has successfully completed water pipeline extensions to 50 villages in Guntur district.',
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          url: 'https://ap.gov.in/water-project-completion',
          source: { id: 'apgov', name: 'Andhra Pradesh Government' }
        },
        {
          title: 'New Metro Rail Project Approved for Visakhapatnam',
          description: 'The state cabinet has approved the detailed project report for Visakhapatnam Metro Rail Phase 1, expected to begin construction next year.',
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          url: 'https://ap.gov.in/metro-rail-project',
          source: { id: 'apgov', name: 'Andhra Pradesh Government' }
        }
      ];

      return governmentNews;
    } catch (error) {
      console.warn('Government sources fetch failed:', error);
      return [];
    }
  }

  // Fetch from social media and citizen reports APIs
  async fetchFromSocialMedia() {
    try {
      // Mock social media issues (in real implementation, use Twitter API, etc.)
      const socialIssues = [
        {
          title: 'Citizens Report Power Outage in Sector 15, Vijayawada',
          description: 'Multiple residents reporting prolonged power outage in Sector 15 since morning. APEPDCL has been notified but no response yet.',
          publishedAt: new Date().toISOString(),
          url: 'https://twitter.com/citizen_reports/status/123',
          source: { id: 'social', name: 'Social Media Reports' }
        },
        {
          title: 'Traffic Congestion at Benz Circle Due to Construction',
          description: 'Heavy traffic congestion at Benz Circle due to ongoing road construction. Alternative routes suggested.',
          publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          url: 'https://twitter.com/traffic_updates/status/456',
          source: { id: 'social', name: 'Traffic Updates' }
        }
      ];

      return socialIssues;
    } catch (error) {
      console.warn('Social media fetch failed:', error);
      return [];
    }
  }

  // Main method to fetch and process all online data
  async fetchOnlineIssues() {
    try {
      console.log('Fetching online issues...');

      // Fetch from multiple sources
      const [newsArticles, governmentArticles, socialArticles] = await Promise.all([
        this.fetchFromNewsAPI(),
        this.fetchFromGovernmentSources(),
        this.fetchFromSocialMedia()
      ]);

      // Convert all articles to issue format
      const allIssues = [];

      // Process news articles
      newsArticles.forEach(article => {
        const issue = this.convertToIssue(article, { id: 'newsapi', name: 'News Media' });
        allIssues.push(issue);
      });

      // Process government articles
      governmentArticles.forEach(article => {
        const issue = this.convertToIssue(article, article.source);
        allIssues.push(issue);
      });

      // Process social media articles
      socialArticles.forEach(article => {
        const issue = this.convertToIssue(article, article.source);
        allIssues.push(issue);
      });

      // Remove duplicates based on title similarity and URL
      const uniqueIssues = this.removeDuplicateIssues(allIssues);

      // Sort by published date (newest first)
      uniqueIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Limit to recent 50 issues
      const limitedIssues = uniqueIssues.slice(0, 50);

      console.log(`Fetched ${limitedIssues.length} online issues (removed ${allIssues.length - limitedIssues.length} duplicates)`);

      return limitedIssues;
    } catch (error) {
      console.error('Error fetching online issues:', error);
      return [];
    }
  }

  // Remove duplicate issues based on title similarity and URL
  removeDuplicateIssues(issues) {
    const uniqueIssues = [];
    const seenTitles = new Set();
    const seenUrls = new Set();

    for (const issue of issues) {
      // Skip if URL already seen
      if (issue.url && seenUrls.has(issue.url)) {
        continue;
      }

      // Create a normalized title for comparison (remove common words and punctuation)
      const normalizedTitle = issue.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\b(the|and|or|but|in|on|at|to|for|of|with|by|a|an)\b/g, '') // Remove common words
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      // Skip if very similar title already seen (basic similarity check)
      let isDuplicate = false;
      for (const seenTitle of seenTitles) {
        // Check if titles are very similar (80% overlap in words)
        const titleWords = new Set(normalizedTitle.split(' '));
        const seenWords = new Set(seenTitle.split(' '));
        const intersection = new Set([...titleWords].filter(x => seenWords.has(x)));
        const union = new Set([...titleWords, ...seenWords]);

        if (intersection.size / union.size > 0.8 && intersection.size > 3) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueIssues.push(issue);
        seenTitles.add(normalizedTitle);
        if (issue.url) {
          seenUrls.add(issue.url);
        }
      }
    }

    return uniqueIssues;
  }

  // Get online issues (from cache or fresh fetch)
  async getOnlineIssues(forceUpdate = false) {
    if (!forceUpdate && !this.needsUpdate()) {
      const cachedData = this.getCachedData();
      if (cachedData.length > 0) {
        console.log('Using cached online issues');
        return cachedData;
      }
    }

    const freshData = await this.fetchOnlineIssues();
    if (freshData.length > 0) {
      this.saveToCache(freshData);
    }

    return freshData;
  }

  // Force refresh online issues
  async refreshOnlineIssues() {
    console.log('Force refreshing online issues...');
    const freshData = await this.fetchOnlineIssues();
    this.saveToCache(freshData);
    return freshData;
  }

  // Get last update time
  getLastUpdateTime() {
    const lastUpdate = localStorage.getItem(this.lastUpdateKey);
    return lastUpdate ? new Date(lastUpdate) : null;
  }
}

// Export singleton instance
export default new OnlineDataService();
