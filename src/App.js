import React, { useState } from 'react';
import { MousePointer, BarChart3, Sparkles, Play } from 'lucide-react';
import FileUpload from './components/FileUpload';
import StatsCards from './components/StatsCards';
import Charts from './components/Charts';
import { parseCursorUsageData } from './utils/csvParser';
import { generateSampleData } from './utils/sampleData';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (csvText) => {
    setIsLoading(true);
    try {
      const parsedData = parseCursorUsageData(csvText);
      setData(parsedData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    setData(null);
  };

  const loadSampleData = () => {
    setIsLoading(true);
    try {
      const sampleCsv = generateSampleData();
      const parsedData = parseCursorUsageData(sampleCsv);
      setData(parsedData);
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={resetData}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MousePointer className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Cursor Usage Analytics</h1>
                <p className="text-gray-500 text-xs">AI usage insights</p>
              </div>
            </div>
            {data && (
              <button
                onClick={resetData}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 border border-gray-200"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {!data ? (
          <div className="text-center animate-fade-in-up">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-8 shadow-lg">
                <BarChart3 className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                Analyze Your <span className="text-gradient">Cursor Usage</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover insights into your AI usage patterns, optimize costs, and understand your productivity trends with beautiful, interactive analytics.
              </p>
            </div>
            
            <FileUpload 
              onFileProcessed={handleFileProcessed}
              isLoading={isLoading}
            />
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-500">or</div>
              <button
                onClick={loadSampleData}
                disabled={isLoading}
                className="btn-secondary flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Try with Sample Data</span>
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-500">
                <div className="icon-primary mx-auto mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your daily usage patterns and identify peak productivity times with beautiful visualizations
                </p>
              </div>
              
              <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-500">
                <div className="icon-success mx-auto mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your spending and optimize your Cursor usage for better value and efficiency
                </p>
              </div>
              
              <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-500">
                <div className="icon-purple mx-auto mb-6">
                  <MousePointer className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand which AI models you use most and their effectiveness in your workflow
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-gray-900 mb-4">
                Your <span className="text-gradient">Usage Analytics</span>
              </h2>
              <p className="text-xl text-gray-600">
                Insights from <span className="font-semibold text-blue-600">{data.rawData.length}</span> sessions over <span className="font-semibold text-purple-600">{Math.ceil((data.stats.dateRange.end - data.stats.dateRange.start) / (1000 * 60 * 60 * 24))}</span> days
              </p>
            </div>
            
            <StatsCards stats={data.stats} />
            <Charts timeSeries={data.timeSeries} modelUsage={data.stats.modelUsage} rawData={data.rawData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-xl border-t border-gray-200/30 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">          
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Built for developers, by 🤖s
              </p>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
