interface ErrorTextWidgetProps {
    isError: boolean
    errorText: string
}

// TODO: заменить все использования на этот виджет
export function ErrorTextWidget(props: ErrorTextWidgetProps) {
    if (props.isError) {
        return <div className="app-error-container">
            {props.errorText}
        </div>
    }

    return null
}