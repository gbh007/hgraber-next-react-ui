import { PropsWithChildren, useEffect, useState } from "react"
import styles from "./common.module.css"

export function HumanTimeWidget(props: {
    value: string
}) {
    return <span>{new Date(props.value).toLocaleString()}</span>
}

export function DialogWidget(props: PropsWithChildren<{
    open: boolean
    onClose: () => void
}>) {

    return <dialog open={props.open} className={styles.appDialog}>
        <div className={styles.appDialog}>
            {props.children}
            <button
                className="app"
                onClick={props.onClose}
            >Закрыть</button>
        </div>
    </dialog>
}

export function ContainerWidget(props: PropsWithChildren<{
    direction?: "row" | "column" | "2-column"
    gap?: "smaller" | "small" | "medium" | "big" | "bigger" | "biggest"
    wrap?: boolean
    appContainer?: boolean
    style?: React.CSSProperties
}>) {
    return <div
        className={props.appContainer ? "app-container" : ""}
        style={{
            ...{
                display: props.direction == "row" || props.direction == "column" ? "flex" :
                    props.direction == "2-column" ? "grid" : undefined,
                flexDirection: props.direction == "row" ? "row" :
                    props.direction == "column" ? "column" : undefined,
                gridTemplateColumns: props.direction == "2-column" ? "auto 1fr" : undefined,
                flexWrap: props.wrap ? "wrap" : undefined,
                gap: props.gap == "smaller" ? "3px" :
                    props.gap == "small" ? "5px" :
                        props.gap == "medium" ? "10px" :
                            props.gap == "big" ? "15px" :
                                props.gap == "bigger" ? "30px" :
                                    props.gap == "biggest" ? "50px" :
                                        undefined,
            },
            ...props.style
        }}
    >
        {props.children}
    </div>
}

export function ColorizedTextWidget(props: PropsWithChildren<{
    color?: "danger" | "danger-lite" | "good"
    bold?: boolean
}>) {
    const color = props.color == "danger" ? "var(--app-color-danger)" :
        props.color == "danger-lite" ? "var(--app-color-danger-lite)" :
            props.color == "good" ? "var(--app-color-good)" : undefined

    if (props.bold) {
        return <b style={{ color: color }}>{props.children}</b>
    }

    return <span style={{ color: color }}>{props.children}</span>
}

export function AutoRefresherWidget(props: {
    callback: () => void
    defaultInterval?: number
}) {
    const [refreshInterval, setRefreshInterval] = useState(props.defaultInterval ?? 0)
    useEffect(() => {
        if (!refreshInterval) {
            return
        }

        const id = setInterval(props.callback, refreshInterval)

        return () => {
            clearInterval(id)
        }
    }, [props.callback, refreshInterval])

    return <select
        className="app"
        value={refreshInterval}
        onChange={e => setRefreshInterval(parseInt(e.target.value))}
    >
        <option value={0}>Не обновлять</option>
        <option value={1 * 1000}>Раз в секунду</option>
        <option value={10 * 1000}>Раз в 10 секунд</option>
        <option value={30 * 1000}>Раз в 30 секунд</option>
        <option value={1 * 60 * 1000}>Раз в минуту</option>
        <option value={5 * 60 * 1000}>Раз в 5 минут</option>
    </select>
}