import { useState } from "react";
import { BookFilter, BookFilterAttribute, BookFilterFlags, BookFilterLabel } from "../apiclient/model-book-filter";
import { DatetimePickerWidget } from "./datetime-picker";
import { ShowSelectWidget } from "./show-select";
import { AttributeCountResponseAttribute } from "../apiclient/api-attribute";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookLabelPresetAutocompleteWidget } from "./book-label-editor";
import { attributeCodes, BookAttributeAutocompleteList, BookAttributeAutocompleteWidget } from "./attribute";
import { ContainerWidget, DeleteButtonWidget } from "./common";


export function BookFilterWidget(props: {
    value: BookFilter
    onChange: (v: BookFilter) => void
    attributeCount?: Array<AttributeCountResponseAttribute>
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
}) {
    return <ContainerWidget direction="column" gap="small">
        <BookFilterFlagsWidget
            value={props.value.filter?.flags ?? {}}
            onChange={v => props.onChange({ ...props.value, filter: { ...props.value.filter, flags: v } })}
        />
        <ContainerWidget direction="2-column" gap="small">
            <span>Сортировать по:</span>
            <select className="app" value={props.value.sort?.field ?? "created_at"} onChange={e => {
                props.onChange({ ...props.value, sort: { ...props.value.sort, field: e.target.value } })
            }}>
                <option value="created_at">Дате создания</option>
                <option value="name">Названию</option>
                <option value="id">ИД</option>
                <option value="page_count">Количеству страниц</option>
            </select>
        </ContainerWidget>
        <label>
            <span>Сортировать по убыванию</span>
            <input
                className="app"
                checked={props.value.sort?.desc ?? true}
                onChange={e => {
                    props.onChange({ ...props.value, sort: { ...props.value.sort, desc: e.target.checked } })
                }}
                placeholder="Сортировать по убыванию"
                type="checkbox"
                autoComplete="off"
            />
        </label>
        <ContainerWidget direction="row" gap="small" wrap>
            <span>С</span>
            <DatetimePickerWidget
                value={props.value.filter?.created_at?.from ?? ""}
                onChange={
                    v => props.onChange({ ...props.value, filter: { ...props.value.filter, created_at: { ...props.value.filter?.created_at, from: v } } })
                }
            />
            <span>По</span>
            <DatetimePickerWidget
                value={props.value.filter?.created_at?.to ?? ""}
                onChange={
                    v => props.onChange({ ...props.value, filter: { ...props.value.filter, created_at: { ...props.value.filter?.created_at, to: v } } })
                }
            />
        </ContainerWidget>
        <ContainerWidget direction="row" gap="small">
            <span>Название</span>
            <input
                className="app"
                type="text"
                value={props.value.filter?.name ?? ""}
                onChange={e => {
                    props.onChange({ ...props.value, filter: { ...props.value.filter, name: e.target.value } })
                }}
            />
            {props.value.filter?.name ?
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange({ ...props.value, filter: { ...props.value.filter, name: "" } })
                    }}
                ></DeleteButtonWidget>
                : null}
        </ContainerWidget>
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
    </ContainerWidget>
}

function BookFilterFlagsWidget(props: {
    value: BookFilterFlags
    onChange: (v: BookFilterFlags) => void
}) {
    return <ContainerWidget direction="2-column" gap="small">
        <span>Показывать удаленные:</span>
        <ShowSelectWidget value={props.value.delete_status ?? "except"} onChange={(v: string) => {
            props.onChange({ ...props.value, delete_status: v })
        }} />
        <span>Показывать подтвержденные:</span>
        <ShowSelectWidget value={props.value.verify_status ?? "only"} onChange={(v: string) => {
            props.onChange({ ...props.value, verify_status: v })
        }} />
        <span>Показывать загруженные:</span>
        <ShowSelectWidget value={props.value.download_status ?? "only"} onChange={(v: string) => {
            props.onChange({ ...props.value, download_status: v })
        }} />
        <span>Показывать пересобранные:</span>
        <ShowSelectWidget value={props.value.show_rebuilded ?? "all"} onChange={(v: string) => {
            props.onChange({ ...props.value, show_rebuilded: v })
        }} />
        <span>Показывать без страниц:</span>
        <ShowSelectWidget value={props.value.show_without_pages ?? "all"} onChange={(v: string) => {
            props.onChange({ ...props.value, show_without_pages: v })
        }} />
        <span>Показывать без превью:</span>
        <ShowSelectWidget value={props.value.show_without_preview ?? "all"} onChange={(v: string) => {
            props.onChange({ ...props.value, show_without_preview: v })
        }} />
    </ContainerWidget>
}

function BookFilterAttributesWidget(props: {
    value: Array<BookFilterAttribute>
    onChange: (v: Array<BookFilterAttribute>) => void
}) {
    return <ContainerWidget direction="column" gap="small">
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
            <ContainerWidget key={i} direction="row" gap="medium">
                <BookFilterAttributeWidget
                    value={v}
                    onChange={e => {
                        props.onChange(props.value.map((ov, index) => index == i ? e : ov))
                    }}
                />
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                ></DeleteButtonWidget>
            </ContainerWidget>
        )}
    </ContainerWidget>
}

function BookFilterAttributeWidget(props: {
    value: BookFilterAttribute
    onChange: (v: BookFilterAttribute) => void
}) {
    return <ContainerWidget direction="row" gap="medium" wrap>
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
                autoCompleteID={BookAttributeAutocompleteList(props.value.code)}
            />
        }
    </ContainerWidget>
}

function ManyStringSelectWidget(props: {
    value: Array<string>
    onChange: (v: Array<string>) => void
    autoCompleteID?: string
}) {
    const [value, setValue] = useState("")
    return <ContainerWidget direction="column" gap="smaller">
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
            <ContainerWidget key={i} direction="row" gap="smaller">
                <span>{v}</span>
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                ></DeleteButtonWidget>
            </ContainerWidget>
        )}
    </ContainerWidget>
}



function BookFilterLabelsWidget(props: {
    value: Array<BookFilterLabel>
    onChange: (v: Array<BookFilterLabel>) => void
}) {
    return <ContainerWidget direction="column" gap="small">
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
            <ContainerWidget key={i} direction="row" gap="medium">
                <BookFilterLabelWidget
                    value={v}
                    onChange={e => {
                        props.onChange(props.value.map((ov, index) => index == i ? e : ov))
                    }}
                />
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                ></DeleteButtonWidget>
            </ContainerWidget>
        )}
    </ContainerWidget>
}

function BookFilterLabelWidget(props: {
    value: BookFilterLabel
    onChange: (v: BookFilterLabel) => void
}) {
    return <ContainerWidget direction="row" gap="medium" wrap>
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
    </ContainerWidget>
}
