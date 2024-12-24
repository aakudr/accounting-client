import { Input } from "shared/ui/input";
import { Label } from "shared/ui/label";
import { Button } from "shared/ui/button";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DatePicker } from "./DatePicker";
import { MultiSelect } from "shared/ui/multi-select";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Checkbox } from "shared/ui/checkbox";
import clsx from "clsx";
import { Card } from "shared/ui/card";
import { ArrowUp, ArrowDown, Trash } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../shared/ui/popover";
import { Combobox } from "../shared/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../shared/ui/dialog";
import { useDocumentQuery } from "../entities/document";

type SpendingEntry = {
  category: string;
  price: number;
  date: Date;
  comment: string;
};

type EditorEntryProps = {
  compactMode: boolean;
  entry: SpendingEntry;
};

const EditorEntry = ({ compactMode, entry: item }: EditorEntryProps) => {
  return (
    <div
      className={clsx(
        "flex flex-row justify-between hover:outline hover:outline-[1px] outline-gray-300 mb-1",
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
          <span className="block font-bold text-xl">{item.category}</span>
          {item.comment && (
            <div>
              <span className="text-gray-500 dark:text-gray-400 italic">
                {item.comment}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          "flex",
          compactMode ? "flex-row items-center gap-2" : "flex-col items-start",
        )}
      >
        <span className="block font-bold text-gray-800 dark:text-gray-200">
          {item.price.toLocaleString("ru-RU", {
            maximumFractionDigits: 2,
          })}{" "}
          руб.
        </span>
        <div>
          <span className="font-italic text-gray-500 dark:text-gray-400">
            {format(item.date, "PP", { locale: ru })}
          </span>
        </div>
      </div>
    </div>
  );
};

const MainEditor = ({ filename }: { filename: string }) => {
  /*
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
	*/
  /*
	const handleFileUpload = async (formData: FormData) => {
	  const response = await fetch("http://localhost:8000/upload", {
	    method: "POST",
	    body: formData,
	  });
	  return await response.json().then((data) => ({
	    data: data.data.map(
	      (e: Omit<SpendingEntry, "date"> & { date: string }) => ({
		...e,
		date: new Date(e.date),
	      }),
	    ),
	  }));
	};
      
	const { mutateAsync, data } = useMutation({
	  mutationFn: (formData: FormData) => handleFileUpload(formData),
	});
	*/

  const documentQuery = useDocumentQuery(filename);
  const { data } = documentQuery;

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [categories, setCategories] = useState<string[]>([]);

  const categoryList = useMemo(() => {
    if (!data) return null;
    return (
      Array.from(
        new Set(
          data.data.map((entry: any) => {
            return entry.category.toString() as string;
          }),
        ),
      ) as string[]
    ).map((category: string) => {
      return { value: category, label: category };
    }) as { label: string; value: string }[];
  }, [data]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filterByDate = useCallback(
    (data: SpendingEntry) => {
      if (!dateFrom && !dateTo) return true;
      else if (!dateFrom) return new Date(data.date) <= dateTo!;
      else if (!dateTo) return new Date(data.date) >= dateFrom;
      else
        return new Date(data.date) >= dateFrom && new Date(data.date) <= dateTo;
    },
    [dateFrom, dateTo],
  );

  const filterByCategory = useCallback(
    (data: SpendingEntry) => {
      if (selectedCategories.length === 0) return true;
      else return selectedCategories.includes(data.category);
    },
    [selectedCategories],
  );

  const filteredEntries = useMemo(() => {
    return (
      data?.data
        ?.filter((e: SpendingEntry) => filterByCategory(e) && filterByDate(e))
        .sort(
          (a: SpendingEntry, b: SpendingEntry) =>
            a.date.valueOf() - b.date.valueOf(),
        ) ?? []
    );
  }, [data, selectedCategories, dateFrom, dateTo]);

  const [compactMode, setCompactMode] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState(true);

  return (
    <main className="m-auto max-w-[100ch] w-full p-4 [&>*]:mb-3">
      <div className="flex flex-row gap-2 justify-start items-center h-8">
        <Input
          type="checkbox"
          id="compactMode"
          checked={compactMode}
          onChange={() => setCompactMode(!compactMode)}
          className="w-4 h-4"
        />
        <Label htmlFor="compactMode">Компактный режим (для печати)</Label>
        {!compactMode && (
          <>
            <Input
              type="checkbox"
              id="editingEnabled"
              checked={editingEnabled}
              onChange={() => setEditingEnabled(!editingEnabled)}
              className="w-4 h-4 ml-4"
            />
            <Label htmlFor="editingEnabled">Разрешить редактирование</Label>
          </>
        )}
      </div>

      {data && (
        <div
          className={clsx(
            "filters flex flex-row gap-3",
            compactMode && "hidden",
          )}
        >
          <DatePicker date={dateFrom} setDate={setDateFrom} />
          <DatePicker date={dateTo} setDate={setDateTo} />
        </div>
      )}

      {categoryList && (
        <MultiSelect
          options={categoryList}
          onValueChange={setSelectedCategories}
          defaultValue={selectedCategories}
          placeholder="Выберите категории трат"
          variant="inverted"
          animation={2}
          maxCount={3}
          className={clsx(
            //"",
            compactMode && "hidden",
          )}
        />
      )}

      {filteredEntries && (
        <div className="flex flex-col">
          {filteredEntries.map((item: SpendingEntry, index: number) => (
            <Dialog>
              <DialogTrigger>
                <EditorEntry
                  key={index}
                  entry={item}
                  compactMode={compactMode}
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Редактирование записи</DialogHeader>
                <div className="grid gap-2 m-2">
                  {categoryList && (
                    <>
                      <Label htmlFor="category">Категория</Label>
                      <Combobox
                        options={categoryList}
                        placeholder="Выберите категорию"
                        noneSelectedText="Категория не найдена"
                        selectedCategory={item.category}
                        onSelectionChange={(value: string) => {
                          console.log(value);
                        }}
                      />
                    </>
                  )}
                  <Label htmlFor="price">Сумма</Label>
                  <Input id="price" type="number" defaultValue={item.price} />
                  <Label htmlFor="comment">Комментарий</Label>
                  <Input id="comment" defaultValue={item.comment} />
                  <Label htmlFor="date">Дата</Label>
                  <DatePicker date={item.date} setDate={() => {}} />
                  <Button variant="default" className="mt-2">
                    Сохранить
                  </Button>
                  <Popover>
                    <PopoverTrigger className="w-full">
                      <Button variant="destructive" className="w-full">
                        Удалить запись
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px]">
                      <div className="grid gap-2 m-2">
                        <span className="block">
                          Вы собираетесь удалить запись из файла.
                        </span>
                        <span className="block">
                          Вы действительно хотите это сделать?
                        </span>
                        {/*<Label htmlFor="newFilename" className="block mb-2">
                          Чтобы продолжить, введите имя файла
                        </Label>
                        <Input id="newFilename" placeholder={props.filename} />*/}
                        <Button variant="destructive" className="mt-2">
                          Да, удалить
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </DialogContent>
            </Dialog>
          ))}
          {filteredEntries.length > 0 && (
            <>
              <div className="h-[2px] bg-black dark:bg-white my-4" />
              <div className="flex flex-row items-center justify-end">
                <span className="font-bold">
                  <span className="font-normal text-gray-500 dark:text-gray-400">
                    Итого:{" "}
                  </span>
                  {filteredEntries
                    .reduce((acc: number, curr: SpendingEntry) => {
                      return acc + curr.price;
                    }, 0)
                    .toLocaleString("ru-RU", {
                      maximumFractionDigits: 2,
                    })}{" "}
                  руб.
                </span>
              </div>
            </>
          )}
        </div>
      )}
      <div className="fixed bottom-4 right-4">
        <Card
          className={clsx("p-6 transition-all", compactMode && "opacity-0")}
        >
          Сумма:{" "}
          {filteredEntries
            .reduce((acc: number, curr: SpendingEntry) => {
              return acc + curr.price;
            }, 0)
            .toLocaleString("ru-RU", {
              maximumFractionDigits: 2,
            })}{" "}
          руб.
          <div className="flex flex-row justify-end gap-3 mt-3">
            <Button
              variant="outline"
              className="aspect-square"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ArrowUp />
            </Button>
            <Button
              variant="outline"
              className="aspect-square"
              onClick={() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowDown />
            </Button>
          </div>
        </Card>
        {data && (
          <Card
            className={clsx(
              "p-6 transition-all mt-2",
              compactMode && !editingEnabled && "opacity-0",
            )}
          >
            <Dialog>
              <DialogTrigger className="w-full">
                <Button>Добавить запись</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <span>Новая запись</span>
                </DialogHeader>
                <div className="grid gap-2 m-2">
                  {categoryList && (
                    <>
                      <Label htmlFor="category">Категория</Label>
                      <Combobox
                        options={categoryList}
                        placeholder="Выберите категорию"
                        noneSelectedText="Категория не найдена"
                        selectedCategory={null}
                        onSelectionChange={(value: string) => {
                          console.log(value);
                        }}
                      />
                    </>
                  )}
                  <Label htmlFor="price">Сумма</Label>
                  <Input id="price" type="number" placeholder="1000" />
                  <Label htmlFor="comment">Комментарий</Label>
                  <Input id="comment" defaultValue={"Комментарий к записи"} />
                  <Label htmlFor="date">Дата</Label>
                  <DatePicker date={new Date()} setDate={() => {}} />
                  <Button variant="default" className="mt-2">
                    Сохранить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        )}
      </div>
    </main>
  );
};

export default MainEditor;
