import React from 'react';
import { DollarSign, Activity, Zap, Calendar, Target, BarChart3, Timer, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => {
  const colorClasses = {
    primary: 'icon-primary',
    success: 'icon-success',
    warning: 'icon-warning',
    purple: 'icon-purple'
  };

  return (
    <div className="stat-card animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* 🎯 CORE METRICS - Essential Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Cost"
          value={`$${stats.totalCost.toFixed(2)}`}
          subtitle={`$${stats.avgCostPerDay.toFixed(2)}/day`}
          color="success"
        />
        
        <StatCard
          icon={Activity}
          title="Total Sessions"
          value={stats.totalSessions.toLocaleString()}
          subtitle={`${stats.avgSessionsPerDay}/day`}
          color="primary"
        />
        
        <StatCard
          icon={Zap}
          title="Total Tokens"
          value={stats.totalTokens.toLocaleString()}
          subtitle={`${stats.avgTokensPerSession.toLocaleString()}/session`}
          color="success"
        />
        
        <StatCard
          icon={Target}
          title="Cost per Million Tokens"
          value={stats.costPerToken > 0 ? `$${(stats.costPerToken * 1000000).toFixed(2)}` : '$0.00'}
          subtitle="$/M tokens"
          color="warning"
        />
      </div>

      {/* 📊 EFFICIENCY & RELIABILITY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BarChart3}
          title="Input/Output Ratio"
          value={stats.inputOutputRatio.toFixed(2)}
          subtitle="Efficiency"
          color="purple"
        />
        
        <StatCard
          icon={AlertTriangle}
          title="Error Rate"
          value={`${stats.errorRate.toFixed(1)}%`}
          subtitle={`${stats.errorSessions} failed`}
          color="warning"
        />
        
        <StatCard
          icon={Timer}
          title="Peak Usage"
          value={`${stats.peakHour}:00`}
          subtitle={`Cost peak: ${stats.peakCostHour}:00`}
          color="warning"
        />
        
        <StatCard
          icon={Calendar}
          title="Analysis Period"
          value={`${stats.totalDays} days`}
          subtitle={`${stats.dateRange.start.toLocaleDateString()} - ${stats.dateRange.end.toLocaleDateString()}`}
          color="primary"
        />
      </div>

      {/* 🔍 DETAILED ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Session Size</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {stats.minSessionSize.toLocaleString()} - {stats.maxSessionSize.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Median: {stats.medianSessionSize.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Cost Range</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  ${stats.minSessionCost.toFixed(2)} - ${stats.maxSessionCost.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Median: ${stats.medianSessionCost.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Daily Usage</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{stats.sessionsPerDay} sessions</div>
                <div className="text-xs text-gray-500">{stats.tokensPerDay.toLocaleString()} tokens</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Patterns</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{stats.weekdayUsage.sessions || 0}</div>
                <div className="text-xs text-gray-600">Weekday</div>
                <div className="text-xs text-gray-500">${(stats.weekdayUsage.cost || 0).toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{stats.weekendUsage.sessions || 0}</div>
                <div className="text-xs text-gray-600">Weekend</div>
                <div className="text-xs text-gray-500">${(stats.weekendUsage.cost || 0).toFixed(2)}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Model Efficiency</div>
              <div className="space-y-1">
                {Object.entries(stats.modelEfficiency).map(([model, efficiency]) => (
                  <div key={model} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{model}</span>
                    <span className="font-medium">
                      {efficiency.costPerToken > 0 ? `$${(efficiency.costPerToken * 1000000).toFixed(2)}/M` : '$0.00/M'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

