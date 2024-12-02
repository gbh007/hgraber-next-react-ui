interface ShowSelectProps {
    value: string
    onChange: (v: string) => void
}

export function ShowSelectWidget(props: ShowSelectProps) {
    return <select className="app" value={props.value} onChange={e => props.onChange(e.target.value)}>
        <option value="all">Все</option>
        <option value="only">Только</option>
        <option value="except">Кроме</option>
    </select>
}