import { Control, Path } from "react-hook-form";
import { Schema } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props<T, K> {
  control: Control<T | any>;
  name: Path<T>;
  label?: string;
  schema?: Schema<T>;
  placeholder?: string;
  data?: { label: string; value: string }[];
  disabled?: boolean;
  className?: string;
}
export default function FormSelect<T, K extends keyof T>({
  control,
  name,
  label,
  placeholder,
  schema,
  data,
  disabled = false,
  className = "",
}: Props<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} <FormMessage className="text-xs" />
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger disabled={disabled}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.length === 0 ? (
                <SelectItem value="blank" disabled>
                  You don&apos;t have data
                </SelectItem>
              ) : (
                data?.map((v) => (
                  <SelectItem
                    key={v.value}
                    value={v.value}
                    className={className}
                  >
                    {v.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
