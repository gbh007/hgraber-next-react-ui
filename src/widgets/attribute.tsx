import { Link } from "react-router-dom";
import { AttributeColor, AttributeCountResponseAttribute } from "../apiclient/api-attribute";
import { ColorizedTextWidget, ContainerWidget } from "./common";
import { AttributeColorEditLink, BookListLinkAttribute } from "../core/routing";

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
    return <ContainerWidget direction="column">
        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Код <Link className="app-button" to={AttributeColorEditLink()} >Новый</Link></td>
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
                        <BookAttributeValueWidget value={color.value} color={color} code={color.code} />
                    </td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <Link className="app-button" to={AttributeColorEditLink(color.code, color.value)} >Редактировать</Link>
                            <button className="app" onClick={() => {
                                props.onDelete(color.code, color.value)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function AttributeColorEditorWidget(props: {
    value: AttributeColor
    onChange: (v: AttributeColor) => void
    isNew?: boolean
}) {
    return <ContainerWidget direction="2-column" gap="medium">
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
        <BookAttributeValueWidget value={props.value.value} color={props.value} code={props.value.code} />
    </ContainerWidget>
}

export function BookAttributeValuesWidget(props: {
    code: string
    values: Array<string>
    colors?: Array<AttributeColor>
}) {
    const colors = props.colors?.filter(color => color.code == props.code)

    return <>
        {props.values.map(value => <BookAttributeValueWidget
            code={props.code}
            value={value}
            color={colors?.find(color => color.value == value)}
            key={value}
        />)}
    </>
}

export function BookAttributeValueWidget(props: {
    value: string
    code: string
    color?: AttributeColor
}) {
    return <span key={props.value} style={{
        borderRadius: "3px",
        padding: "3px",
        margin: "2px",
        color: props.color?.text_color ?? attributeDefaultTextColor,
        backgroundColor: props.color?.background_color ?? attributeDefaultBackgroundColor,
        display: "inline-block",
    }}>
        <Link
            style={{
                textDecoration: "none",
                color: "unset",
            }}
            to={BookListLinkAttribute(props.code, props.value)}
        >{props.value}</Link>
    </span>
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
