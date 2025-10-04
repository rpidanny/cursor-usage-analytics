/**
 * Parse CSV data and extract Cursor usage statistics
 */
export const parseCursorUsageData = (csvText) => {
  const lines = csvText.trim().split('\n');
  
  // Parse CSV properly handling quoted fields
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };
  
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
  
  const data = lines.slice(1).map(line => {
    const values = parseCSVLine(line).map(v => v.replace(/"/g, '').trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });

  // Process and calculate statistics
  const processedData = data.map(row => {
    const cost = parseFloat(row.Cost) || 0;
    const inputTokens = parseInt(row['Input (w/ Cache Write)']) + parseInt(row['Input (w/o Cache Write)']);
    const totalTokens = parseInt(row['Total Tokens']);
    
    return {
      ...row,
      date: new Date(row.Date),
      inputTokens: inputTokens,
      cacheRead: parseInt(row['Cache Read']),
      outputTokens: parseInt(row['Output Tokens']),
      totalTokens: totalTokens,
      cost: cost
    };
  });

  return {
    rawData: processedData,
    stats: calculateStats(processedData),
    timeSeries: createTimeSeries(processedData)
  };
};

const calculateStats = (data) => {
  const totalSessions = data.length;
  const totalCost = data.reduce((sum, row) => sum + (row.cost || 0), 0);
  const totalTokens = data.reduce((sum, row) => sum + (row.totalTokens || 0), 0);
  const avgTokensPerSession = totalTokens / totalSessions;
  
  // Enhanced token analysis
  const totalInputTokens = data.reduce((sum, row) => sum + (row.inputTokens || 0), 0);
  const totalOutputTokens = data.reduce((sum, row) => sum + (row.outputTokens || 0), 0);
  const totalCacheRead = data.reduce((sum, row) => sum + (row.cacheRead || 0), 0);
  const inputOutputRatio = totalInputTokens > 0 ? totalOutputTokens / totalInputTokens : 0;
  
  // Cost efficiency metrics
  const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;
  const costPerSession = totalSessions > 0 ? totalCost / totalSessions : 0;
  
  // Error analysis
  const errorSessions = data.filter(row => row.Kind && row.Kind.toLowerCase().includes('errored'));
  const successfulSessions = data.filter(row => row.Kind && !row.Kind.toLowerCase().includes('errored'));
  const errorRate = totalSessions > 0 ? (errorSessions.length / totalSessions) * 100 : 0;
  const errorCost = errorSessions.reduce((sum, row) => sum + (row.cost || 0), 0);
  const errorTokens = errorSessions.reduce((sum, row) => sum + (row.totalTokens || 0), 0);
  const successfulCost = successfulSessions.reduce((sum, row) => sum + (row.cost || 0), 0);
  const successfulTokens = successfulSessions.reduce((sum, row) => sum + (row.totalTokens || 0), 0);
  
  // Group by date for daily stats
  const dailyStats = {};
  data.forEach(row => {
    const date = row.date.toISOString().split('T')[0];
    if (!dailyStats[date]) {
      dailyStats[date] = {
        sessions: 0,
        tokens: 0,
        cost: 0,
        inputTokens: 0,
        outputTokens: 0
      };
    }
    dailyStats[date].sessions += 1;
    dailyStats[date].tokens += (row.totalTokens || 0);
    dailyStats[date].cost += (row.cost || 0);
    dailyStats[date].inputTokens += (row.inputTokens || 0);
    dailyStats[date].outputTokens += (row.outputTokens || 0);
  });

  const dailyAverages = Object.values(dailyStats);
  const avgSessionsPerDay = dailyAverages.reduce((sum, day) => sum + day.sessions, 0) / dailyAverages.length;
  const avgTokensPerDay = dailyAverages.reduce((sum, day) => sum + day.tokens, 0) / dailyAverages.length;
  const avgCostPerDay = dailyAverages.reduce((sum, day) => sum + day.cost, 0) / dailyAverages.length;

  // Model usage analysis
  const modelUsage = {};
  const modelCosts = {};
  const modelTokens = {};
  data.forEach(row => {
    const model = row.Model;
    modelUsage[model] = (modelUsage[model] || 0) + 1;
    modelCosts[model] = (modelCosts[model] || 0) + (row.cost || 0);
    modelTokens[model] = (modelTokens[model] || 0) + (row.totalTokens || 0);
  });

  // Calculate model efficiency
  const modelEfficiency = {};
  Object.keys(modelUsage).forEach(model => {
    const modelTokenCount = modelTokens[model] || 0;
    const modelCost = modelCosts[model] || 0;
    const modelSessionCount = modelUsage[model] || 0;
    
    modelEfficiency[model] = {
      costPerToken: modelTokenCount > 0 ? modelCost / modelTokenCount : 0,
      avgTokensPerSession: modelSessionCount > 0 ? modelTokenCount / modelSessionCount : 0,
      totalCost: modelCost,
      totalTokens: modelTokenCount
    };
  });

  // Peak usage times
  const hourlyUsage = {};
  const hourlyCosts = {};
  const hourlyTokens = {};
  data.forEach(row => {
    const hour = row.date.getHours();
    hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
    hourlyCosts[hour] = (hourlyCosts[hour] || 0) + (row.cost || 0);
    hourlyTokens[hour] = (hourlyTokens[hour] || 0) + (row.totalTokens || 0);
  });

  const peakHour = Object.entries(hourlyUsage).reduce((a, b) => hourlyUsage[a[0]] > hourlyUsage[b[0]] ? a : b)[0];
  const peakCostHour = Object.entries(hourlyCosts).reduce((a, b) => hourlyCosts[a[0]] > hourlyCosts[b[0]] ? a : b)[0];

  // Session analysis
  const sessionSizes = data.map(row => row.totalTokens || 0);
  const maxSessionSize = Math.max(...sessionSizes);
  const minSessionSize = Math.min(...sessionSizes);
  const medianSessionSize = sessionSizes.sort((a, b) => a - b)[Math.floor(sessionSizes.length / 2)];

  // Cost analysis
  const sessionCosts = data.map(row => row.cost || 0);
  const maxSessionCost = Math.max(...sessionCosts);
  const minSessionCost = Math.min(...sessionCosts);
  const medianSessionCost = sessionCosts.sort((a, b) => a - b)[Math.floor(sessionCosts.length / 2)];

  // Productivity metrics
  const totalDays = Math.ceil((new Date(Math.max(...data.map(row => row.date))) - new Date(Math.min(...data.map(row => row.date)))) / (1000 * 60 * 60 * 24)) + 1;
  const sessionsPerDay = totalSessions / totalDays;
  const tokensPerDay = totalTokens / totalDays;
  const costPerDay = totalCost / totalDays;

  // Usage patterns
  const weekdayUsage = {};
  const weekendUsage = {};
  data.forEach(row => {
    const dayOfWeek = row.date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend) {
      weekendUsage.sessions = (weekendUsage.sessions || 0) + 1;
      weekendUsage.cost = (weekendUsage.cost || 0) + (row.cost || 0);
      weekendUsage.tokens = (weekendUsage.tokens || 0) + (row.totalTokens || 0);
    } else {
      weekdayUsage.sessions = (weekdayUsage.sessions || 0) + 1;
      weekdayUsage.cost = (weekdayUsage.cost || 0) + (row.cost || 0);
      weekdayUsage.tokens = (weekdayUsage.tokens || 0) + (row.totalTokens || 0);
    }
  });

  return {
    // Basic stats
    totalSessions,
    totalCost: Math.round(totalCost * 100) / 100,
    totalTokens,
    avgTokensPerSession: Math.round(avgTokensPerSession),
    avgSessionsPerDay: Math.round(avgSessionsPerDay * 10) / 10,
    avgTokensPerDay: Math.round(avgTokensPerDay),
    avgCostPerDay: Math.round(avgCostPerDay * 100) / 100,
    
    // Enhanced token analysis
    totalInputTokens,
    totalOutputTokens,
    totalCacheRead,
    inputOutputRatio: Math.round(inputOutputRatio * 100) / 100,
    
    // Cost efficiency
    costPerToken: costPerToken, // Cost per token in dollars (keep full precision)
    costPerSession: Math.round(costPerSession * 100) / 100,
    
    // Model analysis
    modelUsage,
    modelEfficiency,
    
    // Time analysis
    peakHour: parseInt(peakHour),
    peakCostHour: parseInt(peakCostHour),
    
    // Session analysis
    maxSessionSize,
    minSessionSize,
    medianSessionSize,
    maxSessionCost: Math.round(maxSessionCost * 100) / 100,
    minSessionCost: Math.round(minSessionCost * 100) / 100,
    medianSessionCost: Math.round(medianSessionCost * 100) / 100,
    
    // Productivity metrics
    totalDays,
    sessionsPerDay: Math.round(sessionsPerDay * 10) / 10,
    tokensPerDay: Math.round(tokensPerDay),
    costPerDay: Math.round(costPerDay * 100) / 100,
    
    // Usage patterns
    weekdayUsage,
    weekendUsage,
    
    // Error analysis
    errorRate: Math.round(errorRate * 100) / 100,
    errorSessions: errorSessions.length,
    successfulSessions: successfulSessions.length,
    errorCost: Math.round(errorCost * 100) / 100,
    errorTokens,
    successfulCost: Math.round(successfulCost * 100) / 100,
    successfulTokens,
    
    // Date range
    dateRange: {
      start: new Date(Math.min(...data.map(row => row.date))),
      end: new Date(Math.max(...data.map(row => row.date)))
    }
  };
};

const createTimeSeries = (data) => {
  if (!data || data.length === 0) return [];
  
  // Calculate date range
  const dates = data.map(row => row.date);
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Determine optimal grouping based on data span
  let groupBy, dateFormat, labelFormat;
  
  if (daysDiff <= 7) {
    // Less than a week: show hourly data
    groupBy = 'hour';
    dateFormat = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:00`;
    };
    labelFormat = (date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
    };
  } else if (daysDiff <= 30) {
    // Less than a month: show daily data
    groupBy = 'day';
    dateFormat = (date) => date.toISOString().split('T')[0];
    labelFormat = (date) => new Date(date).toLocaleDateString();
  } else if (daysDiff <= 90) {
    // Less than 3 months: show weekly data
    groupBy = 'week';
    dateFormat = (date) => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay()); // Start of week (Sunday)
      return weekStart.toISOString().split('T')[0];
    };
    labelFormat = (date) => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    };
  } else {
    // More than 3 months: show monthly data
    groupBy = 'month';
    dateFormat = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };
    labelFormat = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
  }
  
  // Group data by the determined time period
  const groupedData = {};
  data.forEach(row => {
    const groupKey = dateFormat(row.date);
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = {
        date: groupKey,
        sessions: 0,
        tokens: 0,
        cost: 0,
        inputTokens: 0,
        outputTokens: 0,
        groupBy
      };
    }
    groupedData[groupKey].sessions += 1;
    groupedData[groupKey].tokens += (row.totalTokens || 0);
    groupedData[groupKey].cost += (row.cost || 0);
    groupedData[groupKey].inputTokens += (row.inputTokens || 0);
    groupedData[groupKey].outputTokens += (row.outputTokens || 0);
  });

  const timeSeries = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Add metadata for chart rendering
  timeSeries.metadata = {
    groupBy,
    labelFormat,
    totalDays: daysDiff,
    dataPoints: timeSeries.length
  };
  
  return timeSeries;
};
