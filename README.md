# SEO Keyword Research Tool

[![Twitter Follow](https://img.shields.io/twitter/follow/yourusername?style=social)](https://twitter.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/yourusername)
[![GitHub followers](https://img.shields.io/github/followers/yourusername?style=social)](https://github.com/yourusername)

A powerful, clean, and intuitive SEO keyword research tool powered by the DataForSEO API. Built with vanilla JavaScript for maximum performance and simplicity.

## Features

### Core Features

- **Seed Keyword Research**: Enter any keyword to discover related keyword ideas and variations
- **Keyword Metrics Analysis**: Get critical SEO metrics for each keyword:
  - Search Volume (monthly searches)
  - Keyword Difficulty (0-100 score)
  - CPC (Cost-Per-Click value)
- **Sortable Results Table**: Click any column header to sort results instantly
- **Competitor Research**: Analyze keywords any domain ranks for
- **People Also Ask**: Extract questions from Google's PAA box for content ideas
- **AI Overview Tracking**: Capture Google's AI-generated summaries and source citations

### Design Highlights

- **World-Class UI**: Clean, modern interface using Tailwind CSS and Inter font
- **Minimal & Intuitive**: Instant understanding with zero learning curve
- **Professional Aesthetics**: Carefully crafted color palette and spacing
- **Responsive Design**: Works beautifully on all screen sizes
- **Real-time Feedback**: Loading states and clear error messages

## Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- DataForSEO API credentials ([Get them here](https://dataforseo.com/))

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/seokwtool4.git
   cd seokwtool4
   ```

2. Open `index.html` in your browser:
   ```bash
   open index.html  # macOS
   ```

3. On first launch, enter your DataForSEO API credentials in the configuration modal

4. Start researching keywords!

## Usage

### Keyword Research

1. Select the "By Keyword" tab
2. Enter your seed keyword (e.g., "AI marketing", "best running shoes")
3. Choose your target location
4. Click "Search"
5. View keyword ideas with metrics, sortable by volume, difficulty, or CPC

### Competitor Research

1. Select the "By Domain" tab
2. Enter a competitor's domain (e.g., "example.com")
3. Choose your target location
4. Click "Search"
5. See all keywords the domain ranks for

### Additional Insights

- **People Also Ask**: Scroll down to see related questions from Google
- **AI Overview**: View Google's AI-generated summary and cited sources

## Project Structure

```
seokwtool4/
├── index.html          # Main application interface
├── js/
│   ├── config.js       # API configuration management
│   └── app.js          # Core application logic
├── docs/
│   └── BUG_SOLUTIONS.md # Common bugs and fixes
└── README.md           # This file
```

## API Integration

This tool uses the following DataForSEO API endpoints:

- **DataForSEO Labs API**:
  - Related Keywords
  - Keyword Suggestions
  - Bulk Keyword Difficulty
  - Ranked Keywords (for domain research)

- **SERP API**:
  - Google Organic SERP (for PAA and AI Overview)

### Important Note on CORS

DataForSEO API calls from client-side JavaScript may encounter CORS restrictions. For production use, implement a backend proxy server. See [docs/BUG_SOLUTIONS.md](docs/BUG_SOLUTIONS.md) for details.

## Configuration

API credentials are stored securely in your browser's localStorage. To update or clear your credentials:

```javascript
// Clear stored credentials
localStorage.removeItem('dataforseo_config');
// Reload the page to re-enter credentials
```

## Keyboard Shortcuts (macOS)

- **Cmd + R**: Reload page
- **Enter**: Submit search (when input is focused)
- **Cmd + Option + I**: Open Developer Tools

## Development

### Testing Without API Credits

For development, you can mock API responses. See [docs/BUG_SOLUTIONS.md](docs/BUG_SOLUTIONS.md#testing-without-api-calls) for examples.

### Extending Functionality

The modular structure makes it easy to add new features:

1. Add new API functions in `js/app.js`
2. Create display functions for new data types
3. Update the UI in `index.html`

## Troubleshooting

Common issues and solutions are documented in [docs/BUG_SOLUTIONS.md](docs/BUG_SOLUTIONS.md).

**Quick Fixes:**

- **Modal keeps appearing**: Check API credentials are saved correctly
- **No results found**: Verify API credentials and quota
- **CORS errors**: Implement backend proxy (see BUG_SOLUTIONS.md)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- API credentials stored in localStorage (browser-only)
- No server-side storage of credentials
- For production, implement proper backend authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Built with ❤️ using vanilla JavaScript
- Powered by [DataForSEO API](https://dataforseo.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Font: [Inter](https://rsms.me/inter/)

## Support

Found a bug or have a feature request? [Open an issue](https://github.com/yourusername/seokwtool4/issues)

---

**Made by [@yourusername](https://twitter.com/yourusername)** | [Website](https://yourwebsite.com) | [LinkedIn](https://linkedin.com/in/yourusername)
