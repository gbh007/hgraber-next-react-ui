import { useState } from "react";
import { BookFilter, BookFilterAttribute, BookFilterLabel } from "../apiclient/model-book-filter";
import { DatetimePickerWidget } from "./datetime-picker";
import { ShowSelectWidget } from "./show-select";
import { AttributeCountResponseAttribute } from "../apiclient/api-attribute-count";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookLabelPresetAutocompleteWidget } from "./book-label-editor";

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

export function BookFilterWidget(props: {
    value: BookFilter
    onChange: (v: BookFilter) => void
    attributeCount?: Array<AttributeCountResponseAttribute>
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
}) {
    return <div className="container-column container-gap-small">
        <div>
            Показывать удаленные:
            <ShowSelectWidget value={props.value.delete_status ?? "except"} onChange={(v: string) => {
                props.onChange({ ...props.value, delete_status: v })
            }} />
        </div>
        <div>
            Показывать подтвержденные:
            <ShowSelectWidget value={props.value.verify_status ?? "only"} onChange={(v: string) => {
                props.onChange({ ...props.value, verify_status: v })
            }} />
        </div>
        <div>
            Показывать загруженные:
            <ShowSelectWidget value={props.value.download_status ?? "only"} onChange={(v: string) => {
                props.onChange({ ...props.value, download_status: v })
            }} />
        </div>
        <div>
            Показывать пересобранные:
            <ShowSelectWidget value={props.value.show_rebuilded ?? "all"} onChange={(v: string) => {
                props.onChange({ ...props.value, show_rebuilded: v })
            }} />
        </div>
        <div>
            Показывать без страниц:
            <ShowSelectWidget value={props.value.show_without_pages ?? "all"} onChange={(v: string) => {
                props.onChange({ ...props.value, show_without_pages: v })
            }} />
        </div>
        <div>
            Показывать без превью:
            <ShowSelectWidget value={props.value.show_without_preview ?? "all"} onChange={(v: string) => {
                props.onChange({ ...props.value, show_without_preview: v })
            }} />
        </div>
        <div>
            Сортировать по:
            <select className="app" value={props.value.sort_field ?? "created_at"} onChange={e => {
                props.onChange({ ...props.value, sort_field: e.target.value })
            }}>
                <option value="created_at">Дате создания</option>
                <option value="name">Названию</option>
                <option value="id">ИД</option>
                <option value="page_count">Количеству страниц</option>
            </select>
        </div>
        <label>
            <span>Сортировать по убыванию</span>
            <input
                className="app"
                checked={props.value.sort_desc ?? true}
                onChange={e => {
                    props.onChange({ ...props.value, sort_desc: e.target.checked })
                }}
                placeholder="Сортировать по убыванию"
                type="checkbox"
                autoComplete="off"
            />
        </label>
        <div>
            <span>С <DatetimePickerWidget value={props.value.from ?? ""} onChange={
                v => props.onChange({ ...props.value, from: v })
            } /></span>
            <span> По <DatetimePickerWidget value={props.value.to ?? ""} onChange={
                v => props.onChange({ ...props.value, to: v })
            } /></span>
        </div>
        <div>
            <span>Название </span>
            <input
                className="app"
                type="text"
                value={props.value.filter?.name ?? ""}
                onChange={e => {
                    props.onChange({ ...props.value, filter: { ...props.value.filter, name: e.target.value } })
                }}
            />
        </div>
        <BookFilterAttributesWidget
            value={props.value.filter?.attributes ?? []}
            onChange={e => {
                props.onChange({ ...props.value, filter: { ...props.value.filter, attributes: e } })
            }}
        />
        <BookAttributeAutocompleteWidget attributeCount={props.attributeCount} />
        <BookFilterLabelsWidget
            value={props.value.filter?.labels ?? []}
            onChange={e => {
                props.onChange({ ...props.value, filter: { ...props.value.filter, labels: e } })
            }}
        />
        <BookLabelPresetAutocompleteWidget labelsAutoComplete={props.labelsAutoComplete} />
    </div>
}

function BookFilterAttributesWidget(props: {
    value: Array<BookFilterAttribute>
    onChange: (v: Array<BookFilterAttribute>) => void
}) {
    return <div className="container-column container-gap-small">
        <div>
            <span>Аттрибуты </span>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, {
                        code: "tag", // TODO: не прибивать гвоздями
                        type: "like", // TODO: не прибивать гвоздями
                    }])
                }}
            >Добавить фильтр</button>
        </div>
        {props.value.map((v, i) =>
            <div key={i} className="container-row container-gap-middle">
                <BookFilterAttributeWidget
                    value={v}
                    onChange={e => {
                        props.onChange(props.value.map((ov, index) => index == i ? e : ov))
                    }}
                />
                <button
                    className="app"
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                >удалить фильтр</button>
            </div>
        )}
    </div>
}

function BookFilterAttributeWidget(props: {
    value: BookFilterAttribute
    onChange: (v: BookFilterAttribute) => void
}) {
    return <div className="container-row container-gap-middle">
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
        <select
            className="app"
            value={props.value.type}
            onChange={e => {
                props.onChange({ ...props.value, type: e.target.value })
            }}
        >
            <option value="like">LIKE</option>
            <option value="in">IN</option>
            <option value="count_eq">=</option>
            <option value="count_gt">{">"}</option>
            <option value="count_lt">{"<"}</option>
        </select>
        {props.value.type == "count_eq" ||
            props.value.type == "count_gt" ||
            props.value.type == "count_lt" ?
            <input
                className="app"
                type="number"
                value={props.value.count ?? 0}
                onChange={e => {
                    props.onChange({ ...props.value, count: e.target.valueAsNumber })
                }}
            />
            :
            <ManyStringSelectWidget
                value={props.value.values ?? []}
                onChange={e => {
                    props.onChange({ ...props.value, values: e })
                }}
                autoCompleteID={"attribute-autocomplete-" + props.value.code}
            />
        }
    </div>
}

function ManyStringSelectWidget(props: {
    value: Array<string>
    onChange: (v: Array<string>) => void
    autoCompleteID?: string
}) {
    const [value, setValue] = useState("")
    return <div className="container-column container-gap-smaller">
        <div>
            <input
                className="app"
                value={value}
                onChange={e => setValue(e.target.value)}
                list={props.autoCompleteID}
            />
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, value])
                    setValue("")
                }}
                disabled={value == ""}
            >добавить</button>
        </div>
        {props.value.map((v, i) =>
            <div key={i} className="container-row container-gap-smaller">
                <span>{v}</span>
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



function BookFilterLabelsWidget(props: {
    value: Array<BookFilterLabel>
    onChange: (v: Array<BookFilterLabel>) => void
}) {
    return <div className="container-column container-gap-small">
        <div>
            <span>Метки </span>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, {
                        name: "",
                        type: "in", // TODO: не прибивать гвоздями
                    }])
                }}
            >Добавить фильтр</button>
        </div>
        {props.value.map((v, i) =>
            <div key={i} className="container-row container-gap-middle">
                <BookFilterLabelWidget
                    value={v}
                    onChange={e => {
                        props.onChange(props.value.map((ov, index) => index == i ? e : ov))
                    }}
                />
                <button
                    className="app"
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                >удалить фильтр</button>
            </div>
        )}
    </div>
}

function BookFilterLabelWidget(props: {
    value: BookFilterLabel
    onChange: (v: BookFilterLabel) => void
}) {
    return <div className="container-row container-gap-middle">
        <input
            className="app"
            list="label-preset-names"
            value={props.value.name}
            onChange={e => {
                props.onChange({ ...props.value, name: e.target.value })
            }}
            placeholder="название"
        />
        <select
            className="app"
            value={props.value.type}
            onChange={e => {
                props.onChange({ ...props.value, type: e.target.value })
            }}
        >
            <option value="like">LIKE</option>
            <option value="in">IN</option>
            <option value="count_eq">=</option>
            <option value="count_gt">{">"}</option>
            <option value="count_lt">{"<"}</option>
        </select>
        {props.value.type == "count_eq" ||
            props.value.type == "count_gt" ||
            props.value.type == "count_lt" ?
            <input
                className="app"
                type="number"
                value={props.value.count ?? 0}
                onChange={e => {
                    props.onChange({ ...props.value, count: e.target.valueAsNumber })
                }}
            />
            :
            <ManyStringSelectWidget
                value={props.value.values ?? []}
                onChange={e => {
                    props.onChange({ ...props.value, values: e })
                }}
                autoCompleteID={"label-preset-values-" + props.value.name}
            />
        }
    </div>
}
