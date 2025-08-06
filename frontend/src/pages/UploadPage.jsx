import { UploadForm } from '../components/UploadPage';

const UploadPage = ({ setCurrentPage, setPdfData, setUploadProgress, setIsLoading, setError, error, isLoading, uploadProgress }) => {
  return (
    <UploadForm 
      setCurrentPage={setCurrentPage}
      setPdfData={setPdfData}
      setUploadProgress={setUploadProgress}
      setIsLoading={setIsLoading}
      setError={setError}
      error={error}
      isLoading={isLoading}
      uploadProgress={uploadProgress}
    />
  );
};

export default UploadPage;