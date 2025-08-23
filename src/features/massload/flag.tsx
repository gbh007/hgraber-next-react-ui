import { MassloadFlag } from "../../apiclient/api-massload"
import { ContainerWidget } from "../../widgets/design-system"


export function MassloadFlagViewWidget(props: {
    flags?: Array<string>
    flagInfos?: Array<MassloadFlag>
}) {
    if (!props.flags) {
        return null
    }

    return <ContainerWidget direction="row" gap="small" wrap>
        {props.flags.map((flag, i) => <span key={i} style={{
            borderRadius: "3px",
            padding: "3px",
            border: "1px solid var(--app-color)"
        }}>
            {props.flagInfos?.find((v) => v.code == flag)?.name ?? flag}
        </span>)}
    </ContainerWidget>
}


export function MassloadFlagPickerWidget(props: {
    value: Array<string>
    onChange: (v: Array<string>) => void
    flagInfos: Array<MassloadFlag>
}) {
    return <ContainerWidget direction="column" gap="small" wrap>
        {props.flagInfos.map((flag) => <label key={flag.code}>
            <input
                className="app"
                type="checkbox"
                checked={props.value.includes(flag.code)}
                onChange={e => props.onChange(e.target.checked ? [...props.value, flag.code] : props.value.filter(v => v != flag.code))}
            />
            <span>{flag.name || flag.code}</span>
        </label>)}
    </ContainerWidget>
}
