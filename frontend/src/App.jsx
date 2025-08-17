import { useState } from "react";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to format summary text with highlighting and structure
  const formatSummaryText = (text) => {
    if (!text) return null;

    // Split text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      let formattedParagraph = paragraph;
      
      // Detect and format different types of content
      if (paragraph.match(/^(summary|conclusion|key findings?|overview|abstract|introduction|main points?|results?|findings?):/i)) {
        // Section headers
        return (
          <div key={index} className="mb-6 first:mt-0">
            <h3 className="text-xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-200 flex items-center">
              <span className="bg-blue-100 p-1 rounded-lg mr-2">📋</span>
              {paragraph}
            </h3>
          </div>
        );
      } else if (paragraph.match(/^\d+\.\s/)) {
        // Numbered lists
        const [number, ...content] = paragraph.split(/\.\s(.+)/);
        return (
          <div key={index} className="mb-4 flex items-start">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
              {number}
            </span>
            <p className="text-gray-700 leading-relaxed">{formatInlineText(content.join('. '))}</p>
          </div>
        );
      } else if (paragraph.match(/^[-•]\s/)) {
        // Bullet points
        const content = paragraph.replace(/^[-•]\s/, '');
        return (
          <div key={index} className="mb-3 flex items-start">
            <span className="text-blue-600 text-lg mr-3 mt-1 flex-shrink-0">•</span>
            <p className="text-gray-700 leading-relaxed">{formatInlineText(content)}</p>
          </div>
        );
      } else if (paragraph.match(/^(note|important|warning|attention):/i)) {
        // Special notes/callouts
        return (
          <div key={index} className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-yellow-800 font-medium flex items-center">
              <span className="mr-2">⚠️</span>
              {formatInlineText(paragraph)}
            </p>
          </div>
        );
      } else {
        // Regular paragraphs
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed text-justify">
            {formatInlineText(paragraph)}
          </p>
        );
      }
    });
  };

  // Function to format inline text with highlighting
  const formatInlineText = (text) => {
    if (!text) return '';
    
    // Split text to handle different formatting
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|"[^"]+"|'[^']+'|\b(?:important|significant|crucial|key|main|primary|essential|critical|notable|major)\b)/gi);
    
    return parts.map((part, index) => {
      if (part.match(/^\*\*.*\*\*$/)) {
        // Bold text
        return (
          <strong key={index} className="font-bold text-gray-900 bg-blue-100 px-1 rounded">
            {part.replace(/\*\*/g, '')}
          </strong>
        );
      } else if (part.match(/^\*.*\*$/)) {
        // Italic text
        return (
          <em key={index} className="italic text-blue-700">
            {part.replace(/\*/g, '')}
          </em>
        );
      } else if (part.match(/^["'].*["']$/)) {
        // Quoted text
        return (
          <span key={index} className="bg-gray-100 px-2 py-1 rounded italic text-gray-600 border-l-2 border-gray-400">
            {part}
          </span>
        );
      } else if (part.match(/^(important|significant|crucial|key|main|primary|essential|critical|notable|major)$/i)) {
        // Keywords highlighting
        return (
          <span key={index} className="bg-gradient-to-r from-yellow-200 to-yellow-300 px-1 rounded font-medium text-gray-800">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  // Function to format summary for printing
  const formatSummaryForPrint = (text) => {
    if (!text) return '';
    
    const paragraphs = text.split('\n').filter(p => p.trim());
    let formattedHtml = '';
    
    paragraphs.forEach(paragraph => {
      if (paragraph.match(/^(summary|conclusion|key findings?|overview|abstract|introduction|main points?|results?|findings?):/i)) {
        formattedHtml += `<div class="section-header"><h3>${paragraph}</h3></div>`;
      } else if (paragraph.match(/^\d+\.\s/)) {
        formattedHtml += `<div class="numbered-item">${paragraph.replace(/^\d+\.\s/, '')}</div>`;
      } else if (paragraph.match(/^[-•]\s/)) {
        formattedHtml += `<div class="bullet-point">• ${paragraph.replace(/^[-•]\s/, '')}</div>`;
      } else {
        const highlighted = paragraph.replace(/\b(important|significant|crucial|key|main|primary|essential|critical|notable|major)\b/gi, '<span class="highlight">$1</span>');
        formattedHtml += `<p>${highlighted}</p>`;
      }
    });
    
    return formattedHtml;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setSummary("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");
    
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      
      const response = await fetch("http://127.0.0.1:8000/pdf/process-pdf/", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${text}`);
      }
      
      const data = await response.json();
      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setSummary("");
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your PDF document and get an intelligent summary powered by AI. 
            Perfect for research papers, reports, and lengthy documents.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Upload Section */}
          <div className="p-8">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Choose or drag your PDF file
                </h3>
                <p className="text-gray-500 mb-6">
                  Supports PDF files up to 10MB
                </p>
                
                <label className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer inline-flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Selected File Display */}
            {pdfFile && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">File Selected</p>
                    <p className="text-sm text-green-600">{pdfFile.name}</p>
                    <p className="text-xs text-green-500">
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={!pdfFile || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-red-800">Error</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Section */}
          {summary && (
            <div className="border-t border-gray-100 bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      Document Summary
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-green-700 font-medium">✓ Generated</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="relative">
                  {/* Main Summary Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
                      <h3 className="text-white font-semibold text-lg">Key Insights</h3>
                    </div>
                    <div className="p-8">
                      <div className="prose prose-lg max-w-none">
                        <div className="formatted-summary text-gray-800 leading-relaxed text-base">
                          {formatSummaryText(summary)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-6">
                          <span>📄 Source: {pdfFile?.name}</span>
                          <span>📊 Words: {summary.split(' ').length}</span>
                          <span>⏱️ Generated: {new Date().toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(summary);
                      // Could add toast notification here
                    }}
                    className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <svg className="h-4 w-4 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Summary
                  </button>
                  
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([summary], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${pdfFile.name.replace('.pdf', '')}_summary.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Summary
                  </button>
                  
                  <button 
                    onClick={() => {
                      const formattedContent = formatSummaryForPrint(summary);
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Summary - ${pdfFile.name}</title>
                            <style>
                              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.6; color: #374151; }
                              h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
                              h2 { color: #1f2937; margin-top: 30px; }
                              h3 { color: #3b82f6; margin-top: 25px; }
                              .highlight { background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; }
                              .section-header { background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
                              .bullet-point { margin: 10px 0; padding-left: 20px; }
                              .numbered-item { margin: 10px 0; padding-left: 30px; position: relative; }
                              .numbered-item::before { content: counter(item); counter-increment: item; position: absolute; left: 0; top: 0; background: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; text-align: center; font-size: 12px; line-height: 20px; }
                              ol { counter-reset: item; }
                            </style>
                          </head>
                          <body>
                            <h1>📄 Document Summary</h1>
                            <p><strong>Source:</strong> ${pdfFile.name}</p>
                            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                            <hr style="margin: 30px 0; border: none; height: 1px; background-color: #e5e7eb;">
                            <div>${formattedContent}</div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <svg className="h-4 w-4 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Summary
                  </button>
                </div>

                {/* Reading Time & Analysis Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.split(' ').length}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.ceil(summary.split(' ').length / 200)}</div>
                    <div className="text-sm text-gray-600">Min Read</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">{summary.split('\n').filter(p => p.trim()).length}</div>
                    <div className="text-sm text-gray-600">Paragraphs</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI algorithms extract key insights from your documents
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Get comprehensive summaries in seconds, not hours
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-indigo-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">
              Drag and drop or click to upload your PDF files instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;