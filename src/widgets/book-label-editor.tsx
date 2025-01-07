import { useState } from "react";
import { LabelDeleteRequest, LabelGetResponseLabel, LabelPresetListResponseLabel, LabelSetRequest } from "../apiclient/api-labels";
import { HumanTimeWidget } from "./common";

export function BookLabelEditorWidget(props: {
    bookID: string
    pageNumber?: number
    value?: Array<LabelGetResponseLabel>
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    onDelete: (v: LabelDeleteRequest) => void
    onCreate: (v: LabelSetRequest) => void
}) {
    const [pageNumber, setPageNumber] = useState(props.pageNumber ?? 0)
    const [name, setName] = useState("")
    const [value, setValue] = useState("")

    return <div className="container-column container-gap-big">
        <div className="app-container container-row container-gap-small">
            <span>Создать метку</span>
            <input
                className="app"
                list="label-preset-names"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="название"
            />
            <input
                className="app"
                type="number"
                value={pageNumber}
                onChange={e => setPageNumber(e.target.valueAsNumber)}
                placeholder="номер страницы"
            />
            <input
                className="app"
                list={"label-preset-values-" + name}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="значение"
            />
            <button
                className="app"
                onClick={() => {
                    props.onCreate({
                        book_id: props.bookID,
                        name: name,
                        value: value,
                        page_number: pageNumber,
                    })
                }}
            >создать</button>
        </div>
        <div className="app-container container-column">
            <table>
                <thead>
                    <tr>
                        <td>Метка</td>
                        <td>Страница</td>
                        <td>Значение</td>
                        <td>Создана</td>
                        <td>Действия</td>
                    </tr>
                </thead>
                <tbody>
                    {props.value?.sort((a, b) => a.page_number - b.page_number).map(label =>
                        <tr key={label.book_id + label.page_number + label.name}>
                            <td>{label.name}</td>
                            <td>{label.page_number ?? ''}</td>
                            <td>{label.value}</td>
                            <td><HumanTimeWidget value={label.created_at} /></td>
                            <td>
                                <button
                                    className="app"
                                    onClick={() => {
                                        props.onDelete({
                                            book_id: label.book_id,
                                            name: label.name,
                                            page_number: label.page_number,
                                        })
                                    }}
                                >удалить</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <BookLabelPresetAutocompleteWidget labelsAutoComplete={props.labelsAutoComplete} />
    </div>
}

export function BookLabelPresetAutocompleteWidget(props: {
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
}) {
    if (!props.labelsAutoComplete) {
        return null
    }

    return <>
        {props.labelsAutoComplete?.map(labelPreset =>
            <datalist id={"label-preset-values-" + labelPreset.name} key={labelPreset.name}>
                {labelPreset.values.map(v =>
                    <option key={v} value={v} />
                )}
            </datalist>
        )}
        <datalist id={"label-preset-names"}>
            {props.labelsAutoComplete?.map(labelPreset =>
                <option key={labelPreset.name} value={labelPreset.name} />
            )}
        </datalist>
    </>
}