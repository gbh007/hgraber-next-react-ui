import { BookFilter } from "../apiclient/model-book-filter";
import { DatetimePickerWidget } from "./datetime-picker";
import { ShowSelectWidget } from "./show-select";

interface BookFilterProps {
    value: BookFilter
    onChange: (v: BookFilter) => void
}

export function BookFilterWidget(props: BookFilterProps) {
    return <>
        <div>
            Показывать удаленные:
            <ShowSelectWidget value={props.value.delete_status || "except"} onChange={(v: string) => {
                props.onChange({ ...props.value, delete_status: v })
            }} />
        </div>
        <div>
            Показывать подтвержденные:
            <ShowSelectWidget value={props.value.verify_status || "only"} onChange={(v: string) => {
                props.onChange({ ...props.value, verify_status: v })
            }} />
        </div>
        <div>
            Показывать загруженные:
            <ShowSelectWidget value={props.value.download_status || "only"} onChange={(v: string) => {
                props.onChange({ ...props.value, download_status: v })
            }} />
        </div>
        <div>
            Сортировать по:
            <select className="app" value={props.value.sort_field || "created_at"} onChange={e => {
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
                checked={props.value.sort_desc == null ? true : props.value.sort_desc}
                onChange={e => {
                    props.onChange({ ...props.value, sort_desc: e.target.checked })
                }}
                placeholder="Сортировать по убыванию"
                type="checkbox"
                autoComplete="off"
            />
        </label>
        <span>С
            <DatetimePickerWidget value={props.value.from || ""} onChange={
                v => props.onChange({ ...props.value, from: v })
            } /></span>
        <span>По
            <DatetimePickerWidget value={props.value.to || ""} onChange={
                v => props.onChange({ ...props.value, to: v })
            } /></span>
        <input
            type="text"
            value={props.value.filter?.name || ""}
            onChange={e => {
                props.onChange({ ...props.value, filter: { ...props.value.filter, name: e.target.value } })
            }}
        />
    </>
}