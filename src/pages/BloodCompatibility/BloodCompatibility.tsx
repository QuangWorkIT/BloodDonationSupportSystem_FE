import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BloodCompatibilityForm: React.FC = ({ mode, setMode, abo, setAbo, rh, setRh, component, setComponent, aboGroups, rhFactors, components }: any) => {
  aboGroups = ["A", "B", "AB", "O"];
  rhFactors = ["+", "-"];
  components = ["Huyết tương", "Tiểu cầu", "Hồng cầu"];
  [mode, setMode] = useState<"full" | "component">("full");

  return (
    <div>
      <div className="flex max-w-[1080px] gap-[20px] mb-4 w-full justify-center rounded-lg border-black border px-6 py-2 mx-auto">
        <Button
          variant="ghost"
          onClick={() => setMode("full")}
          className={`px-4 py-4 rounded-lg min-w-[48%] hover:bg-red-700 hover:text-white cursor-pointer transition ease-in-out ${
            mode === "full" ? "bg-red-700 text-white text-lg" : "bg-gray-200"
          }`}
        >
          Toàn phần
        </Button>
        <Button
          variant="ghost"
          onClick={() => setMode("component")}
          className={`px-4 py-2 rounded-lg min-w-[48%] hover:bg-red-700 hover:text-white cursor-pointer transition ease-in-out ${
            mode === "component" ? "bg-red-700 text-white text-lg" : "bg-gray-200"
          }`}
        >
          Thành phần
        </Button>
      </div>

      <div className="bg-white max-w-[1080px] rounded-lg mx-auto border-black border p-6">
        <div className={`grid ${mode === "component" ? "grid-cols-3" : "grid-cols-2"} gap-[20px]`}>
          <Select value={abo} onValueChange={setAbo}>
            <SelectTrigger className="border p-2 rounded w-full">
              <SelectValue placeholder="Chọn ABO" />
            </SelectTrigger>
            <SelectContent>
              {aboGroups.map((group: string) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rh} onValueChange={setRh}>
            <SelectTrigger className="border p-2 rounded-lg w-full">
              <SelectValue placeholder="Chọn Rh" />
            </SelectTrigger>
            <SelectContent>
              {rhFactors.map((f: string) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mode === "component" && (
            <Select value={component} onValueChange={setComponent}>
              <SelectTrigger className="border p-2 rounded-lg w-full">
                <SelectValue placeholder="Chọn thành phần" />
              </SelectTrigger>
              <SelectContent>
                {components.map((c: string) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="w-full flex justify-center">
          <Button className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-6 py-2 rounded-lg mt-4">Tìm kiếm</Button>
        </div>

        <div className="mt-6 flex gap-[20px] w-full justify-center">
          <div className="mb-4 min-w-[48%]">
            <h4 className="font-semibold">Có thể truyền cho:</h4>
            <div className="border p-2 rounded bg-gray-50">-</div>
          </div>
          <div className="mb-4 min-w-[48%]">
            <h4 className="font-semibold">Có thể nhận từ:</h4>
            <div className="border p-2 rounded bg-gray-50">-</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityForm;
