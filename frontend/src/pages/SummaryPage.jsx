import { SummaryDisplay, TOCNavigator } from '../components/SummaryPage';
import Header from '../components/Layout/Header';

const SummaryPage = ({ pdfData, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Document Analysis"
        subtitle={pdfData?.name}
        showUploadButton={true}
        onUploadClick={() => setCurrentPage('upload')}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TOCNavigator toc={pdfData?.toc || []} onSectionClick={(item) => console.log('Navigate to:', item)} />
          </div>
          <div className="lg:col-span-3">
            <SummaryDisplay summary={pdfData?.summary} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;