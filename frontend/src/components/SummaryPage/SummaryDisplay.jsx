import { Brain, BarChart3, MessageCircle, Download, Share2 } from 'lucide-react';

const SummaryDisplay = ({ summary, setCurrentPage }) => (
  <div className="space-y-6">
    {/* TL;DR Section */}
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
        <Brain className="w-6 h-6 mr-2 text-indigo-600" />
        TL;DR
      </h3>
      <p className="text-gray-700 leading-relaxed text-lg">{summary.tldr}</p>
    </div>

    {/* Key Statistics */}
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
        Key Statistics
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.keyStats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bullet Summary */}
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
      <ul className="space-y-3">
        {summary.bullets.map((bullet, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setCurrentPage('ask')}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 space-x-2"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Ask Questions</span>
      </button>
      <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 space-x-2">
        <Download className="w-5 h-5" />
        <span>Export Summary</span>
      </button>
      <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 space-x-2">
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>
    </div>
  </div>
);

export default SummaryDisplay;