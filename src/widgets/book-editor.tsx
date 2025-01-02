import { AttributeCountResponseAttribute } from "../apiclient/api-attribute-count";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookRaw, BookRawAttribute, BookRawLabel } from "../apiclient/model-book";
import { attributeCodes, BookAttributeAutocompleteWidget } from "./book-filter";
import { BookLabelPresetAutocompleteWidget } from "./book-label-editor";
import { DatetimePickerWidget } from "./datetime-picker";


export function BookEditorWidget(props: {
    value: BookRaw
    onChange: (v: BookRaw) => void
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    return <div className="container-column container-gap-middle">
        <BookMainInfoEditorWidget
            value={props.value}
            onChange={props.onChange}
        />
        <BookLabelInfoEditorWidget
            value={props.value.labels ?? []}
            onChange={e => props.onChange({ ...props.value, labels: e })}
            labelsAutoComplete={props.labelsAutoComplete}
        />
        <BookAttributeInfoEditorWidget
            value={props.value.attributes ?? []}
            onChange={e => props.onChange({ ...props.value, attributes: e })}
            attributeCount={props.attributeCount}
        />
    </div>
}

export function BookMainInfoEditorWidget(props: {
    value: BookRaw
    onChange: (v: BookRaw) => void
}) {
    return <div className="app-container container-column container-gap-small">
        <b>Основная информация</b>
        <label>Название: <input
            className="app"
            value={props.value.name}
            onChange={e => {
                props.onChange({ ...props.value, name: e.target.value })
            }}
        /></label>
        <label>Ссылка: <input
            className="app"
            value={props.value.origin_url ?? ""}
            onChange={e => {
                props.onChange({ ...props.value, origin_url: e.target.value })
            }}
        /></label>
    </div>
}


export function BookLabelInfoEditorWidget(props: {
    value: Array<BookRawLabel>
    onChange: (v: Array<BookRawLabel>) => void
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
}) {
    return <div className="app-container container-column container-gap-middle">
        <div className="container-row container-gap-small">
            <b>Метки</b>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, {
                        name: "",
                        value: "",
                        page_number: 0,
                        create_at: new Date().toJSON(),
                    }])
                }}
            >создать</button>
        </div>
        {props.value.map((label, i) =>
            <LabelEditor
                key={i}
                value={label}
                onChange={e => props.onChange(props.value.map((v, index) => i == index ? e : v))}
                onDelete={() => props.onChange(props.value.filter((_, index) => i != index))}
            />
        )}
        <BookLabelPresetAutocompleteWidget labelsAutoComplete={props.labelsAutoComplete} />
    </div>
}

function LabelEditor(props: {
    value: BookRawLabel
    onChange: (v: BookRawLabel) => void
    onDelete: () => void
}) {
    return <div className="container-row container-gap-smaller">
        <input
            className="app"
            list="label-preset-names"
            value={props.value.name}
            onChange={e => props.onChange({ ...props.value, name: e.target.value })}
            placeholder="название"
        />
        <input
            className="app"
            type="number"
            value={props.value.page_number}
            onChange={e => props.onChange({ ...props.value, page_number: e.target.valueAsNumber })}
            placeholder="номер страницы"
        />
        <input
            className="app"
            list={"label-preset-values-" + props.value.name}
            value={props.value.value}
            onChange={e => props.onChange({ ...props.value, value: e.target.value })}
            placeholder="значение"
        />
        <DatetimePickerWidget
            value={props.value.create_at}
            onChange={e => props.onChange({ ...props.value, create_at: e })}
        />
        <button className="app" onClick={props.onDelete} >удалить</button>
    </div>
}

export function BookAttributeInfoEditorWidget(props: {
    value: Array<BookRawAttribute>
    onChange: (v: Array<BookRawAttribute>) => void
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    return <div className="app-container container-column container-gap-middle">
        <div className="container-row container-gap-small">
            <b>Аттрибуты</b>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, {
                        code: "tag", // FIXME: убрать этот хардкод
                        values: [],
                    }])
                }}
            >создать</button>
        </div>
        {props.value.map((label, i) =>
            <AttributeEditor
                key={i}
                value={label}
                onChange={e => props.onChange(props.value.map((v, index) => i == index ? e : v))}
                onDelete={() => props.onChange(props.value.filter((_, index) => i != index))}
            />
        )}
        <BookAttributeAutocompleteWidget attributeCount={props.attributeCount} />
    </div>
}

function AttributeEditor(props: {
    value: BookRawAttribute
    onChange: (v: BookRawAttribute) => void
    onDelete: () => void
}) {
    return <div className="container-row container-gap-small">
        <select
            className="app"
            value={props.value.code}
            onChange={e => {
                props.onChange({ ...props.value, code: e.target.value })
            }}
        >
            {attributeCodes.map(code =>
                <option value={code} key={code}>{code}</option>
            )}
        </select>
        <button className="app" onClick={props.onDelete}>удалить</button>
        <ManyStringSelectWidget
            value={props.value.values}
            onChange={e => props.onChange({ ...props.value, values: e })}
            autoCompleteID={"attribute-autocomplete-" + props.value.code}
        />
    </div>
}

function ManyStringSelectWidget(props: {
    value: Array<string>
    onChange: (v: Array<string>) => void
    autoCompleteID?: string
}) {
    return <div className="container-column container-gap-smaller">
        <div>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, ""])
                }}
            >добавить</button>
        </div>
        {props.value.map((value, i) =>
            <div key={i} className="container-row container-gap-smaller">
                <input
                    className="app"
                    value={value}
                    onChange={e => props.onChange(props.value.map((v, index) => i == index ? e.target.value : v))}
                    list={props.autoCompleteID}
                />
                <button
                    className="app"
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                >удалить</button>
            </div>
        )}
    </div>
}