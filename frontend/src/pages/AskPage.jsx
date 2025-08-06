import { QuestionAnswerBox } from '../components/AskPage';
import Header from '../components/Layout/Header';

const AskPage = ({ pdfData, setCurrentPage, questions, setQuestions }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Q&A Assistant"
        subtitle={pdfData?.name}
        showBackButton={true}
        onBackClick={() => setCurrentPage('summary')}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <QuestionAnswerBox questions={questions} setQuestions={setQuestions} />
      </div>
    </div>
  );
};

export default AskPage;