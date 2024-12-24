import Providers from "@/components/entities/Providers";
import MainEditor from "@/components/widgets/MainEditor";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "../shared/ui/button";

const useUrlSearchParams = () => {
  const urlSearchParams = useMemo(() => {
    const paramsInstance = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(paramsInstance.entries());
    return params;
  }, []);
  return urlSearchParams;
};

const Redirector = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.replace("/document-list");
    }, 3000);
  }, []);

  return (
    <span>
      Вы не выбрали файл.
      <br /> Переходим на{" "}
      <a href="/document-list" id="redirect-anchor">
        список документов
      </a>{" "}
      через 3 секунды.
    </span>
  );
};

const MainEditorPage = () => {
  const params = useUrlSearchParams();

  return (
    <Providers>
      {params.filename ? (
        <>
          <Button
            onClick={() => (window.location.href = "/document-list")}
            variant="outline"
            size="icon"
            className="fixed top-4 left-4"
          >
            <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <MainEditor filename={params.filename} />
        </>
      ) : (
        <Redirector />
      )}
    </Providers>
  );
};

export default MainEditorPage;
