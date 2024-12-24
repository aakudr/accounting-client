import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

type ComboboxProps = {
  options: { value: string; label: string }[];
  placeholder: string;
  noneSelectedText: string;
  selectedCategory?: string | null;
  onSelectionChange: (value: string) => void;
};

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.selectedCategory ?? null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? props.options.find((opt) => opt.value === value)?.label
            : props.placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={props.placeholder} />
          <CommandList>
            <CommandEmpty>{props.noneSelectedText}</CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
