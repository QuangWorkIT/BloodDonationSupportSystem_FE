interface DateInputProps {
    value: Date | string;
    readOnly?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// this function create a custom date picker
function DateInput({ value, onChange, readOnly }: DateInputProps) {
    const formatDate = (date: string | Date | undefined): string => {
        if (!date) return ''

        const dateObj = date instanceof Date ? date : new Date(date)

        if (isNaN(dateObj.getTime())) return ''

        return dateObj.toISOString().split('T')[0]
    }

    return (
        <>
            <input
                type="date"
                value={formatDate(value)}
                onChange={onChange}
                readOnly={readOnly}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
             transition-all duration-300 ease-in-out hover:shadow-md"/>
        </>
    )
}

export default DateInput
