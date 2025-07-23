import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectProps {
    onValueChange: (value: string) => void;
    defaultVal?: string;
    disabled?: boolean;
}

export function BloodComponentSelect({ onValueChange, defaultVal, disabled = false }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} defaultValue={defaultVal} >
            <SelectTrigger className="w-full" disabled = {disabled}>
                <SelectValue placeholder="Chọn loại máu" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="wholeblood">Máu toàn phần</SelectItem>
                <SelectItem value="redbloodcell">Hồng cầu</SelectItem>
                <SelectItem value="platelet">Tiểu cầu</SelectItem>
                <SelectItem value="plasma">Huyết tương</SelectItem>
            </SelectContent>
        </Select>
    )
}

export function BloodTypeSelectRh({ onValueChange, defaultVal,disabled = false }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} value={defaultVal} >
            <SelectTrigger className="w-full border border-black/20 shadow-md" disabled = {disabled}>
                <SelectValue placeholder="Chọn Rh" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="+">+</SelectItem>
                <SelectItem value="-">-</SelectItem>
            </SelectContent>
        </Select>
    )
}

function BloodTypeSelect({ onValueChange, defaultVal, disabled = false }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} value={defaultVal}>
            <SelectTrigger className="w-full border border-black/20 shadow-md" disabled = {disabled}>
                <SelectValue placeholder="Chọn ABO" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="O">O</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default BloodTypeSelect
