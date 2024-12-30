export function HumanTimeWidget(props: {
    value: string
}) {
    return <span>{new Date(props.value).toLocaleString()}</span>
}