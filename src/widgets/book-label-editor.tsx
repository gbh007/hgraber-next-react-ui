import { useState } from "react";
import { LabelDeleteRequest, LabelGetResponseLabel, LabelPresetListResponseLabel, LabelSetRequest, useLabelDelete, useLabelGet, useLabelPresetList, useLabelSet } from "../apiclient/api-labels";
import { HumanTimeWidget } from "./common";
import { ErrorTextWidget } from "./error-text";

export function BookLabelEditorButtonCoordinatorWidget(props: {
    bookID: string
    pageNumber?: number
}) {
    const [show, setShow] = useState(false)
    const [labelsResponse, fetchLabels] = useLabelGet()
    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    const [labelSetResponse, doSetLabel] = useLabelSet()
    const [labelDeleteResponse, doDeleteLabel] = useLabelDelete()

    return <>
        <button
            className="app"
            onClick={() => {
                fetchLabels({ book_id: props.bookID })
                fetchLabelPresets()
                setShow(true)
            }}
        >Редактировать метки</button>
        <dialog open={show}>
            <div className="app-container container-column container-gap-middle">
                <ErrorTextWidget value={labelsResponse} />
                <ErrorTextWidget value={labelPresetsResponse} />
                <ErrorTextWidget value={labelSetResponse} />
                <ErrorTextWidget value={labelDeleteResponse} />
                <BookLabelEditorWidget
                    bookID={props.bookID}
                    onCreate={(v: LabelSetRequest) => {
                        doSetLabel(v).then(() => { fetchLabels({ book_id: props.bookID }) })
                    }}
                    onDelete={(v: LabelDeleteRequest) => {
                        doDeleteLabel(v).then(() => { fetchLabels({ book_id: props.bookID }) })
                    }}
                    pageNumber={props.pageNumber}
                    value={labelsResponse.data?.labels}
                    autoComplete={labelPresetsResponse.data?.labels}
                />
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                    }}
                >Закрыть</button>
            </div>
        </dialog>
    </>
}

export function BookLabelEditorWidget(props: {
    bookID: string
    pageNumber?: number
    value?: Array<LabelGetResponseLabel>
    autoComplete?: Array<LabelPresetListResponseLabel> // FIXME: по неизвестной причине не обновляется
    onDelete: (v: LabelDeleteRequest) => void
    onCreate: (v: LabelSetRequest) => void
}) {
    const [pageNumber, setPageNumber] = useState(props.pageNumber ?? 0)
    const [name, setName] = useState("")
    const [value, setValue] = useState("")

    return <div className="container-column container-gap-middle">
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
                {props.value?.map(label =>
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
        <BookLabelPresetAutocompleteWidget autoComplete={props.autoComplete} />
        <div className="container-row container-gap-small">
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
    </div>
}

export function BookLabelPresetAutocompleteWidget(props: {
    autoComplete?: Array<LabelPresetListResponseLabel>
}) {
    if (!props.autoComplete) {
        return null
    }

    return <>
        {props.autoComplete?.map(labelPreset =>
            <datalist id={"label-preset-values-" + labelPreset.name} key={labelPreset.name}>
                {labelPreset.values.map(v =>
                    <option key={v} value={v} />
                )}
            </datalist>
        )}
        <datalist id={"label-preset-names"}>
            {props.autoComplete?.map(labelPreset =>
                <option key={labelPreset.name} value={labelPreset.name} />
            )}
        </datalist>
    </>
}