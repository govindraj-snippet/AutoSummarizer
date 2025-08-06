import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, MessageCircle, ChevronRight, Loader2, AlertCircle, CheckCircle, Brain, Search, BookOpen, BarChart3, Download, Share2, Eye } from 'lucide-react';

const UploadForm = ({ setCurrentPage, setPdfData, setUploadProgress, setIsLoading, setError, error, isLoading, uploadProgress }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setPdfData({
        id: 'pdf_' + Date.now(),
        name: file.name,
        toc: [
          { title: "Executive Summary", level: 1, page: 1 },
          { title: "Introduction", level: 1, page: 3 },
          { title: "Market Analysis", level: 2, page: 4 },
          { title: "Competitive Landscape", level: 2, page: 6 },
          { title: "Methodology", level: 1, page: 8 },
          { title: "Data Collection", level: 2, page: 9 },
          { title: "Results", level: 1, page: 12 },
          { title: "Key Findings", level: 2, page: 13 },
          { title: "Conclusions", level: 1, page: 18 }
        ],
        summary: {
          tldr: "This research paper presents a comprehensive analysis of market trends in AI-powered document processing, revealing a 340% growth in adoption rates and identifying key barriers to implementation across various industries.",
          bullets: [
            "AI document processing market grew 340% year-over-year",
            "Implementation barriers include data privacy concerns (78%) and integration complexity (65%)",
            "Small to medium enterprises show highest adoption potential (2.3x growth rate)",
            "Real-time processing capabilities are the most requested feature",
            "ROI typically achieved within 6-8 months of implementation"
          ],
          keyStats: [
            { label: "Market Growth", value: "340%", trend: "up" },
            { label: "Adoption Rate", value: "67%", trend: "up" },
            { label: "ROI Timeline", value: "6-8 months", trend: "stable" },
            { label: "User Satisfaction", value: "4.2/5", trend: "up" }
          ]
        }
      });
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage('summary');
      }, 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Document Insights
          </h1>
          <p className="text-xl text-gray-600 mb-2">Transform PDFs into Actionable Intelligence</p>
          <p className="text-sm text-gray-500">Upload research papers, reports, or any PDF for instant summarization and Q&A</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div 
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 mx-auto animate-spin" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Processing your PDF...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Drop your PDF here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports research papers, reports, articles, and more
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Choose File</span>
                </button>
              </div>
              <p className="text-sm text-gray-500">Maximum file size: 50MB</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Smart Summary</h4>
            <p className="text-sm text-gray-600">Key insights & TL;DR</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Q&A Assistant</h4>
            <p className="text-sm text-gray-600">Ask any question</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Table of Contents</h4>
            <p className="text-sm text-gray-600">Navigate easily</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;