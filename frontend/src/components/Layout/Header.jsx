import { Brain, ChevronRight } from 'lucide-react';

const Header = ({ title, subtitle, showBackButton, onBackClick, showUploadButton, onUploadClick }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        {showUploadButton && (
          <button
            onClick={onUploadClick}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Upload New Document
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Header;