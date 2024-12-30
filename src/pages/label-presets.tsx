import { useEffect, useState } from "react";
import { LabelPresetCreateRequest, useLabelPresetCreate, useLabelPresetDelete, useLabelPresetGet, useLabelPresetList, useLabelPresetUpdate } from "../apiclient/api-labels";
import { HumanTimeWidget } from "../widgets/common";
import { Link, useParams } from "react-router-dom";
import { ErrorTextWidget } from "../widgets/error-text";

export function LabelPresetsScreen() {
    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])

    const [labelPresetDeleteResponse, doDeleteLabelPreset] = useLabelPresetDelete()

    return <div className="app-container">
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={labelPresetDeleteResponse} />
        <table>
            <thead>
                <tr>
                    <td>Название <Link className="app" to={"/label/preset/edit"} >новый</Link></td>
                    <td>Описание</td>
                    <td>Значения</td>
                    <td>Создан</td>
                    <td>Обновлен</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {labelPresetsResponse.data?.presets?.map(labelPreset =>
                    <tr key={labelPreset.name}>
                        <td>{labelPreset.name}</td>
                        <td>{labelPreset.description}</td>
                        <td>{labelPreset.values.join(", ")}</td>
                        <td><HumanTimeWidget value={labelPreset.created_at} /></td>
                        <td>{labelPreset.updated_at ? <HumanTimeWidget value={labelPreset.updated_at} /> : null}</td>
                        <td>
                            <div className="container-column container-gap-smaller">
                                <Link className="app" to={"/label/preset/edit/" + encodeURIComponent(labelPreset.name)} >Редактировать</Link>
                                <button
                                    className="app"
                                    onClick={() => {
                                        doDeleteLabelPreset({ name: labelPreset.name })
                                            .then(() => fetchLabelPresets())
                                    }}
                                    disabled={labelPresetDeleteResponse.isLoading}
                                >Удалить</button>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}

export function LabelPresetEditorScreen() {
    const params = useParams()
    const labelPresetName = decodeURIComponent(params.name ?? "")

    const [labelPresetCreateResponse, doCreateLabelPreset] = useLabelPresetCreate()
    const [labelPresetUpdateResponse, doUpdateLabelPreset] = useLabelPresetUpdate()
    const [labelPresetGetResponse, doGetLabelPreset] = useLabelPresetGet()


    const [data, setData] = useState<LabelPresetCreateRequest>({
        name: "",
        values: [],
    })

    useEffect(() => {
        if (labelPresetGetResponse.data) {
            setData(labelPresetGetResponse.data!)
        }
    }, [labelPresetGetResponse.data])

    if (labelPresetName) {
        useEffect(() => {
            doGetLabelPreset({ name: labelPresetName })
        }, [doGetLabelPreset, labelPresetName])
    }

    return <div className="app-container container-column container-gap-small">
        <ErrorTextWidget value={labelPresetCreateResponse} />
        <ErrorTextWidget value={labelPresetUpdateResponse} />
        <ErrorTextWidget value={labelPresetGetResponse} />
        <input
            className="app"
            value={data.name}
            onChange={e => {
                setData({ ...data, name: e.target.value })
            }}
        />
        <textarea
            className="app"
            value={data.description}
            onChange={e => {
                setData({ ...data, description: e.target.value })
            }}
        />
        <StringArrayPickerWidget
            value={data.values}
            onChange={e => {
                setData({ ...data, values: e })
            }}
        />
        <button
            className="app"
            onClick={() => {
                if (labelPresetName) {
                    doUpdateLabelPreset(data)
                } else {
                    doCreateLabelPreset(data) // TODO: сделать роутинг на редактирование
                }
            }}
        >Сохранить</button>
    </div>
}


export function StringArrayPickerWidget(props: {
    name?: string
    value?: Array<string>
    onChange: (v: Array<string>) => void
}) {
    return <div className="container-column container-gap-smaller">
        <div>
            {props.name ? <span>{props.name}: </span> : null}
            <button className="app" onClick={() => {
                props.onChange([...props.value ?? [], ""])
            }}>Добавить</button>
        </div>
        {props.value?.map((value, i) => <div key={i}>
            <input
                className="app"
                type="text"
                value={value}
                onChange={e => {
                    props.onChange(props.value?.map((value, ind) => ind == i ? e.target.value : value) ?? [])
                }}
            />
            <button className="app" onClick={() => {
                props.onChange(props.value?.filter((_, ind) => ind != i) ?? [])
            }}>Удалить</button>
        </div >)
        }
    </div >
}