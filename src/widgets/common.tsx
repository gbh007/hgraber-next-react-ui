import { PropsWithChildren } from "react"
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
    const color = props.color == "danger" ? "#f00" :
        props.color == "danger-lite" ? "#b00" :
            props.color == "good" ? "#008b33" : undefined

    if (props.bold) {
        return <b style={{ color: color }}>{props.children}</b>
    }

    return <span style={{ color: color }}>{props.children}</span>
}