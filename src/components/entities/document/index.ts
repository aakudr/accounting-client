import { useMutation, useQuery } from "@tanstack/react-query";

const getDocumentList = async () => {
  const response = await fetch("http://localhost:8000/document/list", {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  return response
    .json()
    .then((data) =>
      data.data?.files?.map((filename: string) => ({ filename })),
    );
};
export const useDocumentListQuery = () =>
  useQuery<{ filename: string }[]>({
    queryKey: ["documentList"],
    queryFn: getDocumentList,
  });

const renameDocument = async (payload: {
  old_name: string;
  new_name: string;
}) => {
  const { old_name, new_name } = payload;

  const response = await fetch(
    `http://localhost:8000/document/rename?old_name=${old_name}&new_name=${new_name}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    },
  );

  const json = await response.json();
  return json as { status: string; data: { filename: string } };
};

export const useRenameDocumentMutation = () => {
  return useMutation({ mutationFn: renameDocument });
};

const getDocument = async (filename: string) => {
  /*
	 * curl -X 'GET' \
  'http://localhost:8000/document?filename=test.xls' \
  -H 'accept: application/json'*/

  const response = await fetch(
    `http://localhost:8000/document?filename=${filename}`,
    {
      headers: {
        accept: "application/json",
      },
    },
  );

  const json = await response.json();
  return json;
};
export const useDocumentQuery = (filename: string) => {
  return useQuery({
    queryFn: () => getDocument(filename),
    queryKey: ["document", filename],
  });
};

const deleteDocument = async (filename: string) => {
  const response = await fetch(
    `http://localhost:8000/document?filename=${filename}`,
    {
      method: "delete",
      headers: { accept: "application/json" },
    },
  );

  const json = await response.json();
};

export const useDeleteDocumentMutation = () => {
  return useMutation({
    mutationFn: deleteDocument,
  });
};
