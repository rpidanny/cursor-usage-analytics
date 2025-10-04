# Cursor Usage Analytics

A modern, elegant React application for analyzing Cursor AI usage patterns and costs. Upload your Cursor usage CSV data to get detailed insights, visualizations, and analytics.

## Getting Started

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

## License

This project is open source and available under the [MIT License](LICENSE).
