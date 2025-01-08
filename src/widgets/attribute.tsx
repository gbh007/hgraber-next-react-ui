import { Link } from "react-router-dom";
import { AttributeColor, AttributeCountResponseAttribute } from "../apiclient/api-attribute";

// FIXME: работать с этим списком через API
export const attributeCodes = [
    "author",
    "category",
    "character",
    "group",
    "language",
    "parody",
    "tag",
]

export const attributeDefaultTextColor = "#000000"
export const attributeDefaultBackgroundColor = "#dfdfdf"

export function AttributeColorListWidget(props: {
    value?: Array<AttributeColor>
    onDelete: (code: string, value: string) => void
}) {
    return <div className="container-column">
        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Код <Link className="app-button" to={`/attribute/color/edit`} >Новый</Link></td>
                    <td>Значение</td>
                    <td>Образец</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map((color, i) => <tr key={i}>
                    <td>{color.code}</td>
                    <td>{color.value}</td>
                    <td>
                        <BookAttributeValueWidget value={color.value} color={color} />
                    </td>
                    <td>
                        <div className="container-column container-gap-small">
                            <Link className="app-button" to={`/attribute/color/edit/${encodeURIComponent(color.code)}/${encodeURIComponent(color.value)}`} >Редактировать</Link>
                            <button
                                className="app color-danger-lite"
                                onClick={() => {
                                    props.onDelete(color.code, color.value)
                                }}
                            >Удалить</button>
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </div>
}

export function AttributeColorEditorWidget(props: {
    value: AttributeColor
    onChange: (v: AttributeColor) => void
    isNew?: boolean
}) {
    return <div className="container-2-column container-gap-middle">
        <span>Код</span>
        <select
            className="app"
            value={props.value.code}
            onChange={e => {
                props.onChange({ ...props.value, code: e.target.value })
            }}
            disabled={!props.isNew}
        >
            {attributeCodes.map(code =>
                <option value={code} key={code}>{code}</option>
            )}
        </select>
        <span>Значение</span>
        <input
            className="app"
            value={props.value.value}
            onChange={e => props.onChange({ ...props.value, value: e.target.value })}
            disabled={!props.isNew}
            list={"attribute-autocomplete-" + props.value.code}
        />
        <span>Цвет текста</span>
        <input
            className="app"
            type="color"
            value={props.value.text_color}
            onChange={e => props.onChange({ ...props.value, text_color: e.target.value })}
        />
        <span>Цвет фона</span>
        <input
            className="app"
            type="color"
            value={props.value.background_color}
            onChange={e => props.onChange({ ...props.value, background_color: e.target.value })}
        />

        <span>Итог</span>
        <BookAttributeValueWidget value={props.value.value} color={props.value} />
    </div>
}

export function BookAttributeValuesWidget(props: {
    code: string
    values: Array<string>
    colors?: Array<AttributeColor>
}) {
    const colors = props.colors?.filter(color => color.code == props.code)

    return <>
        {props.values.map(value => <BookAttributeValueWidget
            value={value}
            color={colors?.find(color => color.value == value)}
            key={value}
        />)}
    </>
}

export function BookAttributeValueWidget(props: {
    value: string
    color?: AttributeColor
}) {
    return <span key={props.value} style={{
        borderRadius: "3px",
        padding: "3px",
        margin: "2px",
        color: props.color?.text_color ?? attributeDefaultTextColor,
        backgroundColor: props.color?.background_color ?? attributeDefaultBackgroundColor,
        display: "inline-block",
    }}>{props.value}</span>
}

export function BookAttributeAutocompleteWidget(props: {
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    if (!props.attributeCount) {
        return null
    }

    return <>
        {attributeCodes.map(code =>
            <datalist key={code} id={"attribute-autocomplete-" + code}>
                {props.attributeCount?.filter(e => e.code == code).map(attr =>
                    <option value={attr.value} key={attr.value} />
                )}
            </datalist>
        )}
    </>
}
