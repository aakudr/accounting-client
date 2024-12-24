import Providers from "../entities/Providers";
import { DocumentList } from "widgets/document";

const DocumentListPage = () => {
  return (
    <Providers>
      <main className="m-auto max-w-[100ch] w-full p-4 [&>*]:mb-3">
        <h1>Список документов</h1>
        <DocumentList />
      </main>
    </Providers>
  );
};

export default DocumentListPage;
