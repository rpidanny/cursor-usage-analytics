/**
 * Generate sample Cursor usage data for testing and demonstration
 */
export const generateSampleData = () => {
  const models = ['auto', 'gpt-4', 'claude-3', 'gpt-3.5-turbo'];
  const kinds = ['pro-free-trial', 'pro', 'free'];
  const maxModes = ['No', 'Yes'];
  
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 30 days ago
  
  for (let i = 0; i < 150; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 5)); // 5 sessions per day on average
    date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));
    
    const model = models[Math.floor(Math.random() * models.length)];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const maxMode = maxModes[Math.floor(Math.random() * maxModes.length)];
    
    const inputWithCache = Math.floor(Math.random() * 5000) + 1000;
    const inputWithoutCache = Math.floor(Math.random() * 2000);
    const cacheRead = Math.floor(Math.random() * 100000) + 10000;
    const outputTokens = Math.floor(Math.random() * 2000) + 500;
    const totalTokens = inputWithCache + inputWithoutCache + cacheRead + outputTokens;
    const cost = (totalTokens * 0.0001 * Math.random()).toFixed(2);
    
    data.push({
      Date: date.toISOString(),
      Kind: kind,
      Model: model,
      'Max Mode': maxMode,
      'Input (w/ Cache Write)': inputWithCache.toString(),
      'Input (w/o Cache Write)': inputWithoutCache.toString(),
      'Cache Read': cacheRead.toString(),
      'Output Tokens': outputTokens.toString(),
      'Total Tokens': totalTokens.toString(),
      Cost: cost
    });
  }
  
  // Create CSV string
  const headers = [
    'Date', 'Kind', 'Model', 'Max Mode', 
    'Input (w/ Cache Write)', 'Input (w/o Cache Write)', 
    'Cache Read', 'Output Tokens', 'Total Tokens', 'Cost'
  ];
  
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => `"${row[header]}"`).join(',')
    )
  ];
  
  return csvRows.join('\n');
};
