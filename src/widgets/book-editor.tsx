import { AttributeCountResponseAttribute } from "../apiclient/api-attribute";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookRaw, BookRawAttribute, BookRawLabel } from "../apiclient/model-book";
import { BookAttributeAutocompleteList, BookAttributeAutocompleteWidget } from "./attribute/book-attribute";
import { attributeCodes } from "./attribute/codes";
import { ContainerWidget, DeleteButtonWidget, StringArrayPickerWidget } from "./common";
import { DatetimePickerWidget } from "./datetime-picker";
import { BookLabelPresetAutocompleteWidget } from "./label/book-label-preset-autocomplete-widget";


export function BookEditorWidget(props: {
    value: BookRaw
    onChange: (v: BookRaw) => void
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    return <ContainerWidget direction="column" gap="medium">
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
    </ContainerWidget>
}

export function BookMainInfoEditorWidget(props: {
    value: BookRaw
    onChange: (v: BookRaw) => void
}) {
    return <ContainerWidget appContainer direction="column" gap="small">
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
                props.onChange({ ...props.value, origin_url: e.target.value || undefined })
            }}
        /></label>
    </ContainerWidget>
}


export function BookLabelInfoEditorWidget(props: {
    value: Array<BookRawLabel>
    onChange: (v: Array<BookRawLabel>) => void
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="row" gap="small">
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
        </ContainerWidget>
        {props.value.map((label, i) =>
            label.page_number == 0 ? <LabelEditor
                key={i}
                value={label}
                onChange={e => props.onChange(props.value.map((v, index) => i == index ? e : v))}
                onDelete={() => props.onChange(props.value.filter((_, index) => i != index))}
            /> : null
        )}
        <details className="app">
            <summary>Метки страниц</summary>
            <ContainerWidget appContainer direction="column" gap="medium">
                {props.value.map((label, i) =>
                    label.page_number != 0 ? <LabelEditor
                        key={i}
                        value={label}
                        onChange={e => props.onChange(props.value.map((v, index) => i == index ? e : v))}
                        onDelete={() => props.onChange(props.value.filter((_, index) => i != index))}
                    /> : null
                )}
            </ContainerWidget>
        </details>
        <BookLabelPresetAutocompleteWidget labelsAutoComplete={props.labelsAutoComplete} />
    </ContainerWidget>
}

function LabelEditor(props: {
    value: BookRawLabel
    onChange: (v: BookRawLabel) => void
    onDelete: () => void
}) {
    return <ContainerWidget direction="row" gap="smaller" wrap>
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
        <DeleteButtonWidget onClick={props.onDelete}></DeleteButtonWidget>
    </ContainerWidget>
}

export function BookAttributeInfoEditorWidget(props: {
    value: Array<BookRawAttribute>
    onChange: (v: Array<BookRawAttribute>) => void
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="row" gap="small">
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
        </ContainerWidget>
        {props.value.map((label, i) =>
            <AttributeEditor
                key={i}
                value={label}
                onChange={e => props.onChange(props.value.map((v, index) => i == index ? e : v))}
                onDelete={() => props.onChange(props.value.filter((_, index) => i != index))}
            />
        )}
        <BookAttributeAutocompleteWidget attributeCount={props.attributeCount} isOrigin={true} />
    </ContainerWidget>
}

function AttributeEditor(props: {
    value: BookRawAttribute
    onChange: (v: BookRawAttribute) => void
    onDelete: () => void
}) {
    return <ContainerWidget direction="row" gap="small">
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
        <DeleteButtonWidget onClick={props.onDelete}></DeleteButtonWidget>
        <StringArrayPickerWidget
            value={props.value.values}
            onChange={e => props.onChange({ ...props.value, values: e })}
            autoCompleteID={BookAttributeAutocompleteList(props.value.code, true)}
        />
    </ContainerWidget>
}
