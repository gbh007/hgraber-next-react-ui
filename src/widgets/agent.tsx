export function AgentStatusWidget(props: {
    value?: string
}) {
    const color = props.value == "ok" ? "green" :
        props.value == "error" ? "red" :
            props.value == "warning" ? "yellow" :
                props.value == "offline" ? "gray" : "purple"

    return <div><div
        style={{
            backgroundColor: color,
            padding: "10px",
            borderRadius: "10px",
        }}
    /></div>
}