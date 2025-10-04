import React from 'react';
import { TrendingUp, DollarSign, Activity, Zap, Calendar, Target, BarChart3, Brain, Timer, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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
      {/* 🎯 KEY METRICS - Most Important Info First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Cost"
          value={`$${stats.totalCost.toFixed(2)}`}
          subtitle={`$${stats.avgCostPerDay.toFixed(2)} per day`}
          color="success"
        />
        
        <StatCard
          icon={Activity}
          title="Total Sessions"
          value={stats.totalSessions.toLocaleString()}
          subtitle={`${stats.avgSessionsPerDay} per day`}
          color="primary"
        />
        
        <StatCard
          icon={Zap}
          title="Total Tokens"
          value={stats.totalTokens.toLocaleString()}
          subtitle={`${stats.avgTokensPerSession.toLocaleString()} per session`}
          color="success"
        />
        
        <StatCard
          icon={Target}
          title="Cost per Token"
          value={stats.costPerToken > 0 ? `$${(stats.costPerToken * 1000000).toFixed(2)}` : '$0.00'}
          subtitle="Micro-dollars per token"
          color="warning"
        />
      </div>

      {/* 📊 EFFICIENCY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BarChart3}
          title="Input/Output Ratio"
          value={stats.inputOutputRatio.toFixed(2)}
          subtitle="Output efficiency"
          color="purple"
        />
        
        <StatCard
          icon={Brain}
          title="Input Tokens"
          value={stats.totalInputTokens.toLocaleString()}
          subtitle={`${stats.totalCacheRead.toLocaleString()} cache read`}
          color="primary"
        />
        
        <StatCard
          icon={Timer}
          title="Peak Usage Hour"
          value={`${stats.peakHour}:00`}
          subtitle={`Peak cost: ${stats.peakCostHour}:00`}
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

      {/* 📈 SESSION ANALYSIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Session Size Range"
          value={`${stats.minSessionSize.toLocaleString()} - ${stats.maxSessionSize.toLocaleString()}`}
          subtitle={`Median: ${stats.medianSessionSize.toLocaleString()}`}
          color="primary"
        />
        
        <StatCard
          icon={DollarSign}
          title="Cost Range"
          value={`$${stats.minSessionCost.toFixed(2)} - $${stats.maxSessionCost.toFixed(2)}`}
          subtitle={`Median: $${stats.medianSessionCost.toFixed(2)}`}
          color="success"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Daily Sessions"
          value={stats.sessionsPerDay}
          subtitle={`${stats.tokensPerDay.toLocaleString()} tokens/day`}
          color="purple"
        />
      </div>

      {/* 🚨 ERROR ANALYSIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={AlertTriangle}
          title="Error Rate"
          value={`${stats.errorRate.toFixed(1)}%`}
          subtitle={`${stats.errorSessions} failed sessions`}
          color="warning"
        />
        
        <StatCard
          icon={CheckCircle}
          title="Success Rate"
          value={`${(100 - stats.errorRate).toFixed(1)}%`}
          subtitle={`${stats.successfulSessions} successful sessions`}
          color="success"
        />
        
        <StatCard
          icon={XCircle}
          title="Error Cost"
          value={`$${stats.errorCost.toFixed(2)}`}
          subtitle={`${stats.errorTokens.toLocaleString()} tokens wasted`}
          color="warning"
        />
        
        <StatCard
          icon={DollarSign}
          title="Success Cost"
          value={`$${stats.successfulCost.toFixed(2)}`}
          subtitle={`${stats.successfulTokens.toLocaleString()} productive tokens`}
          color="success"
        />
      </div>

      {/* 🔍 USAGE PATTERNS - Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekday vs Weekend Usage</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.weekdayUsage.sessions || 0}</div>
              <div className="text-sm text-gray-600">Weekday Sessions</div>
              <div className="text-xs text-gray-500">${(stats.weekdayUsage.cost || 0).toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.weekendUsage.sessions || 0}</div>
              <div className="text-sm text-gray-600">Weekend Sessions</div>
              <div className="text-xs text-gray-500">${(stats.weekendUsage.cost || 0).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Efficiency</h3>
          <div className="space-y-2">
            {Object.entries(stats.modelEfficiency).map(([model, efficiency]) => (
              <div key={model} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{model}</span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {efficiency.costPerToken > 0 ? `$${(efficiency.costPerToken * 1000000).toFixed(2)}/token` : '$0.00/token'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {efficiency.avgTokensPerSession.toLocaleString()} tokens/session
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

