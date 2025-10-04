# Cursor Usage Analytics

A modern, elegant React application for analyzing Cursor AI usage patterns and costs. Upload your Cursor usage CSV data to get detailed insights, visualizations, and analytics.

## Features

- **📊 Comprehensive Analytics**: Track sessions, tokens, costs, and usage patterns
- **📈 Interactive Charts**: Beautiful visualizations using Recharts
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, minimal design with smooth animations
- **📁 Easy Upload**: Drag & drop CSV file upload with validation
- **🔍 Detailed Insights**: Model usage analysis, peak usage times, and cost trends

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

## Usage

1. **Upload Data**: Drag and drop your Cursor usage CSV file or click to browse
2. **Try Sample Data**: Use the "Try with Sample Data" button to see the app in action
3. **View Analytics**: Explore your usage patterns, costs, and insights
4. **Reset**: Click "Upload New File" to analyze different data

## CSV Format

The app expects CSV files with the following columns:

- Date
- Kind
- Model
- Max Mode
- Input (w/ Cache Write)
- Input (w/o Cache Write)
- Cache Read
- Output Tokens
- Total Tokens
- Cost

## Technologies Used

- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icons
- **Create React App** - Development tooling

## Features Overview

### Analytics Dashboard

- Total sessions and tokens
- Daily usage patterns
- Cost analysis and trends
- Model usage distribution
- Peak usage times

### Visualizations

- Usage over time (Area chart)
- Token usage trends (Line chart)
- Daily cost analysis (Bar chart)
- Model distribution (Pie chart)

### Responsive Design

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
