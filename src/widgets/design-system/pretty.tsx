import { PropsWithChildren } from 'react'

export function HumanTimeWidget(props: { value: string }) {
    return <span>{new Date(props.value).toLocaleString()}</span>
}

export function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}

export function ColorizedTextWidget(
    props: PropsWithChildren<{
        color?: 'danger' | 'danger-lite' | 'good'
        bold?: boolean
    }>
) {
    const color =
        props.color == 'danger'
            ? 'var(--app-color-danger)'
            : props.color == 'danger-lite'
              ? 'var(--app-color-danger-lite)'
              : props.color == 'good'
                ? 'var(--app-color-good)'
                : undefined

    if (props.bold) {
        return <b style={{ color: color }}>{props.children}</b>
    }

    return <span style={{ color: color }}>{props.children}</span>
}
