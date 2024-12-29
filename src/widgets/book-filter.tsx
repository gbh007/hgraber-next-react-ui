import { useState } from "react";
import { BookFilter, BookFilterAttribute } from "../apiclient/model-book-filter";
import { DatetimePickerWidget } from "./datetime-picker";
import { ShowSelectWidget } from "./show-select";


export function BookFilterWidget(props: {
    value: BookFilter
    onChange: (v: BookFilter) => void
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
            {/* FIXME: работать с этим списком через API */}
            <option value="author">author</option>
            <option value="category">category</option>
            <option value="character">character</option>
            <option value="group">group</option>
            <option value="language">language</option>
            <option value="parody">parody</option>
            <option value="tag">tag</option>
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