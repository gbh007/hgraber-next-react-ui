interface DatetimePickerProps {
    value: string
    onChange: (v: string) => void
}

export function DatetimePickerWidget(props: DatetimePickerProps) {
    return <input
        className="app"
        type="datetime-local"
        value={props.value}
        onChange={e => {
            const v = e.target.value
            if (v) {
                props.onChange(new Date(v).toJSON())
            } else {
                props.onChange("")
            }
        }}
    />
}