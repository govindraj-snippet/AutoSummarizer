import { useState } from 'react';
import UploadPage from './pages/UploadPage';
import SummaryPage from './pages/SummaryPage';
import AskPage from './pages/AskPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('upload');
  const [pdfData, setPdfData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  return (
    <div className="font-sans">
      {currentPage === 'upload' && (
        <UploadPage
          setCurrentPage={setCurrentPage}
          setPdfData={setPdfData}
          setUploadProgress={setUploadProgress}
          setIsLoading={setIsLoading}
          setError={setError}
          error={error}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
        />
      )}
      {currentPage === 'summary' && (
        <SummaryPage
          pdfData={pdfData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'ask' && (
        <AskPage
          pdfData={pdfData}
          setCurrentPage={setCurrentPage}
          questions={questions}
          setQuestions={setQuestions}
        />
      )}
    </div>
  );
};

export default App;