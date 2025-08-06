import { useState } from 'react';
import { MessageCircle, Search, Loader2, Eye } from 'lucide-react';

const QuestionAnswerBox = ({ questions, setQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) return;

    setIsAsking(true);
    
    // Simulate API call
    setTimeout(() => {
      const newQ = {
        id: Date.now(),
        question: currentQuestion,
        answer: "Based on the document, the methodology employed includes both quantitative and qualitative analysis techniques. The research utilized survey data from 1,200 participants across multiple industries, combined with in-depth interviews with key stakeholders.",
        context: "Section 3.2 describes the mixed-methods approach, emphasizing the importance of triangulating data sources to ensure validity and reliability of findings..."
      };
      
      setQuestions(prev => [newQ, ...prev]);
      setCurrentQuestion('');
      setIsAsking(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
          Ask Any Question
        </h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className="space-y-4">
          <textarea
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="What methodology was used in this study? What are the main findings? How was the data collected?"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!currentQuestion.trim() || isAsking}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAsking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{isAsking ? 'Analyzing...' : 'Ask Question'}</span>
          </button>
        </form>
      </div>

      {/* Questions and Answers */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Previous Questions</h3>
          {questions.map((qa) => (
            <div key={qa.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">Q: {qa.question}</p>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                    </div>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View Context from Document
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
                        {qa.context}
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerBox;