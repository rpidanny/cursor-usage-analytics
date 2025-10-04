import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-6 border border-white/20 rounded-2xl shadow-xl">
        <p className="font-semibold text-gray-900 text-lg mb-3">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.name}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const UsageOverTimeChart = ({ timeSeries }) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  const metadata = timeSeries.metadata || {};
  const groupBy = metadata.groupBy || 'day';
  const labelFormat = metadata.labelFormat || ((date) => new Date(date).toLocaleDateString());

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Usage Over Time
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({groupBy === 'hour' ? 'Hourly' : groupBy === 'day' ? 'Daily' : groupBy === 'week' ? 'Weekly' : 'Monthly'} view)
        </span>
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={labelFormat}
              angle={groupBy === 'hour' ? -45 : 0}
              textAnchor={groupBy === 'hour' ? 'end' : 'middle'}
              height={groupBy === 'hour' ? 60 : 30}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              content={<CustomTooltip />}
              labelFormatter={(label) => labelFormat(label)}
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TokenUsageChart = ({ timeSeries }) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  const metadata = timeSeries.metadata || {};
  const groupBy = metadata.groupBy || 'day';
  const labelFormat = metadata.labelFormat || ((date) => new Date(date).toLocaleDateString());

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Token Usage Over Time
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({groupBy === 'hour' ? 'Hourly' : groupBy === 'day' ? 'Daily' : groupBy === 'week' ? 'Weekly' : 'Monthly'} view)
        </span>
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={labelFormat}
              angle={groupBy === 'hour' ? -45 : 0}
              textAnchor={groupBy === 'hour' ? 'end' : 'middle'}
              height={groupBy === 'hour' ? 60 : 30}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              labelFormatter={(label) => labelFormat(label)}
            />
            <Line
              type="monotone"
              dataKey="inputTokens"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Input Tokens"
            />
            <Line
              type="monotone"
              dataKey="outputTokens"
              stroke="#10b981"
              strokeWidth={2}
              name="Output Tokens"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CostChart = ({ timeSeries }) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  const metadata = timeSeries.metadata || {};
  const groupBy = metadata.groupBy || 'day';
  const labelFormat = metadata.labelFormat || ((date) => new Date(date).toLocaleDateString());

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Cost Over Time
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({groupBy === 'hour' ? 'Hourly' : groupBy === 'day' ? 'Daily' : groupBy === 'week' ? 'Weekly' : 'Monthly'} view)
        </span>
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={labelFormat}
              angle={groupBy === 'hour' ? -45 : 0}
              textAnchor={groupBy === 'hour' ? 'end' : 'middle'}
              height={groupBy === 'hour' ? 60 : 30}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              labelFormatter={(label) => labelFormat(label)}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
            />
            <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ModelUsageChart = ({ modelUsage }) => {
  if (!modelUsage || Object.keys(modelUsage).length === 0) return null;

  const data = Object.entries(modelUsage).map(([model, count]) => ({
    name: model,
    value: count
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Model Usage Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const InputOutputChart = ({ timeSeries }) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Input vs Output Tokens</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="inputTokens" fill="#3b82f6" name="Input Tokens" />
            <Bar dataKey="outputTokens" fill="#10b981" name="Output Tokens" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CostEfficiencyChart = ({ timeSeries }) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  // Calculate cost per token for each day (in micro-dollars for better visibility)
  const dataWithEfficiency = timeSeries.map(day => ({
    ...day,
    costPerToken: day.tokens > 0 ? (day.cost / day.tokens) * 1000000 : 0
  }));

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cost Efficiency Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataWithEfficiency}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Cost per Token']}
            />
            <Line
              type="monotone"
              dataKey="costPerToken"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Cost per Token ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SessionSizeChart = ({ rawData }) => {
  if (!rawData || rawData.length === 0) return null;

  // Create histogram bins
  const maxTokens = Math.max(...rawData.map(row => row.totalTokens));
  const minTokens = Math.min(...rawData.map(row => row.totalTokens));
  const binCount = 20; // Number of histogram bins
  const binSize = (maxTokens - minTokens) / binCount;
  
  const histogram = Array(binCount).fill(0);
  const binLabels = [];
  
  // Create bin labels
  for (let i = 0; i < binCount; i++) {
    const start = minTokens + (i * binSize);
    const end = minTokens + ((i + 1) * binSize);
    binLabels.push(`${Math.round(start / 1000)}k-${Math.round(end / 1000)}k`);
  }
  
  // Count sessions in each bin
  rawData.forEach(row => {
    const tokens = row.totalTokens;
    const binIndex = Math.min(Math.floor((tokens - minTokens) / binSize), binCount - 1);
    histogram[binIndex]++;
  });
  
  const chartData = histogram.map((count, index) => ({
    bin: binLabels[index],
    count,
    percentage: ((count / rawData.length) * 100).toFixed(1)
  }));

  return (
    <div className="chart-container">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Session Size Histogram</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="bin" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value, name, props) => [
                `${value} sessions (${props.payload.percentage}%)`, 
                'Sessions'
              ]}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Charts = ({ timeSeries, modelUsage, rawData }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UsageOverTimeChart timeSeries={timeSeries} />
        <TokenUsageChart timeSeries={timeSeries} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <CostChart timeSeries={timeSeries} />
        <ModelUsageChart modelUsage={modelUsage} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <InputOutputChart timeSeries={timeSeries} />
        <CostEfficiencyChart timeSeries={timeSeries} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <SessionSizeChart rawData={rawData} />
      </div>
    </div>
  );
};

export default Charts;
