import {
  useDeleteDocumentMutation,
  useDocumentListQuery,
  useRenameDocumentMutation,
} from "@/components/entities/document";

import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";

import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Formik } from "formik";
import * as Yup from "yup";

import { Download, Eye, Pencil, Trash } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

const compactMode = true;

type AccountingDocument = {
  filename: string;
};

const mockDocuments = [
  { filename: "document1.xls" },
  { filename: "Траты.xls" },
  { filename: "ИП.xls" },
  { filename: "КФХ_.xls" },
  { filename: "Зарплаты.xls" },
];

type DocumentListEntryProps = AccountingDocument & {};

const DocumentListEntry = (props: DocumentListEntryProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const renameMutation = useRenameDocumentMutation();
  const deleteMutation = useDeleteDocumentMutation();

  return (
    <>
      <div
        className={clsx(
          "flex flex-row justify-between hover:outline hover:outline-[1px] outline-gray-300 mb-1 p-2",
          compactMode ? "p-0" : "p-2 px-4 rounded-md",
        )}
      >
        <div>
          <div
            className={clsx(
              "flex",
              compactMode
                ? "flex-row items-center gap-2"
                : "flex-col items-start",
            )}
          >
            <span className="block font-bold text-xl">{props.filename}</span>
            {/*item.comment && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 italic">
                        {item.comment}
                      </span>
                    </div>
                  )*/}
          </div>
        </div>

        <div
          className={clsx(
            "flex",
            compactMode
              ? "flex-row items-center gap-2"
              : "flex-col items-start",
          )}
        >
          <Button
            variant="outline"
            className="aspect-square h-10 w-10"
            onClick={() => {
              window.location.href = `/editor?filename=${props.filename}`;
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="outline"
            className="aspect-square h-10 w-10"
            onClick={() => {
              alert("download");
            }}
          >
            <Download />
          </Button>

          <div className="flex flex-row items-center gap-2">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="aspect-square h-10 w-10"

                  //onClick={() => {
                  //  setPopoverOpen(true);
                  //}}
                >
                  <Pencil />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-2 m-2">
                  <Formik
                    initialValues={{ newFilename: "" }}
                    validationSchema={Yup.object({
                      newFilename: Yup.string()
                        .required("Введите новое имя документа")
                        .matches(
                          /^[^\\/?%*:|"<>\.]+\.xls[x]?$/,
                          "Введите корректное имя документа (например, 'Новый документ.xls')",
                        ),
                    })}
                    onSubmit={(values, actions) => {
                      renameMutation
                        .mutateAsync({
                          old_name: props.filename,
                          new_name: values.newFilename,
                        })
                        .then(() => window.location.reload());
                    }}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      handleChange,
                      handleSubmit,
                    }) => (
                      <>
                        <Label htmlFor="newFilename">Новое имя документа</Label>
                        <Input
                          id="newFilename"
                          placeholder={props.filename}
                          value={values.newFilename}
                          onChange={handleChange}
                        />
                        <Button
                          disabled={!!errors.newFilename}
                          onClick={() => handleSubmit()}
                          variant="default"
                          className="mt-2"
                        >
                          Переименовать
                        </Button>
                        <span className="text-red-500">
                          {touched.newFilename && errors.newFilename}
                        </span>
                      </>
                    )}
                  </Formik>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="destructive"
                  className="aspect-square h-10 w-10"
                  onClick={() => {}}
                >
                  <Trash className="text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px]">
                <div className="grid gap-2 m-2">
                  <Formik
                    initialValues={{ filename: "" }}
                    validationSchema={Yup.object({
                      filename: Yup.string().required().is([props.filename]),
                    })}
                    onSubmit={(values, actions) => {
                      deleteMutation
                        .mutateAsync(props.filename)
                        .then(() => window.location.reload());
                    }}
                  >
                    {({ values, errors, handleChange, handleSubmit }) => (
                      <>
                        <span className="block">
                          Вы собираетесь удалить файл из облака.
                        </span>
                        <Label htmlFor="newFilename" className="block mb-2">
                          Чтобы продолжить, введите имя файла
                        </Label>
                        <Input
                          value={values.filename}
                          id="filename"
                          placeholder={props.filename}
                          onChange={handleChange}
                        />
                        <Button
                          disabled={!!errors.filename}
                          variant="destructive"
                          className="mt-2"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          Удалить
                        </Button>
                      </>
                    )}
                  </Formik>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export const DocumentList = () => {
  const documentListQuery = useDocumentListQuery();

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] || null);

  const createFormData = useCallback(
    async (file: File | null) => {
      if (!file) {
        throw new Error("No file provided");
      }

      console.log("sending");
      const formData = new FormData();
      formData.append("file", file as Blob, file?.name);
      return formData;
    },
    [file],
  );
  const handleFileUpload = async (formData: FormData) => {
    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
    return await response.json();
  };

  const uploadFileMutation = useMutation({
    mutationFn: (formData: FormData) => handleFileUpload(formData),
  });

  return (
    <div>
      <div className="my-12">
        {documentListQuery.isSuccess &&
          documentListQuery.data &&
          documentListQuery.data.map((doc) => {
            return <DocumentListEntry key={doc.filename} {...doc} />;
          })}
      </div>

      <div className="float-right mt-3 flex flex-row gap-2 items-end">
        <div className={clsx("grid w-full max-w-sm items-center gap-1.5")}>
          <Label htmlFor="picture">Файл Excel</Label>
          <Input
            id="workbook"
            type="file"
            onChange={(e) => handleFileChange(e)}
          />
        </div>
        <Button variant="default" onClick={() => {}}>
          Добавить документ
        </Button>
      </div>
    </div>
  );
};
