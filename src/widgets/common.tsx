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