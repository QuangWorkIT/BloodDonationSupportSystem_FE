import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectProps {
    onValueChange: (value: string) => void;
    defaultVal?: string
}

export function BloodComponentSelect({ onValueChange, defaultVal }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} defaultValue={defaultVal}>
            <SelectTrigger className="w-full">
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

export function BloodTypeSelectRh({ onValueChange, defaultVal }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} value={defaultVal}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Rh" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="+">+</SelectItem>
                <SelectItem value="-">-</SelectItem>
            </SelectContent>
        </Select>
    )
}

function BloodTypeSelect({ onValueChange, defaultVal }: SelectProps) {
    return (
        <Select onValueChange={onValueChange} value={defaultVal}>
            <SelectTrigger className="w-full">
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
