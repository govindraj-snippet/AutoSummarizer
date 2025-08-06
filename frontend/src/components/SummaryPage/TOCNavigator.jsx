import { BookOpen } from 'lucide-react';

const TOCNavigator = ({ toc, onSectionClick }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
      Table of Contents
    </h3>
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {toc.map((item, index) => (
        <button
          key={index}
          onClick={() => onSectionClick(item)}
          className={`w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
            item.level === 1 ? 'font-medium text-gray-900' : 'text-gray-600 ml-4'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="truncate">{item.title}</span>
            <span className="text-xs text-gray-400 ml-2">p.{item.page}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default TOCNavigator;