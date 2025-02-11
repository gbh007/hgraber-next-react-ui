import { useEffect, useState } from "react";
import { ContainerWidget } from "../widgets/common";
import { Link, useParams } from "react-router-dom";
import { ErrorTextWidget } from "../widgets/error-text";
import { ParsingMirrorEditLink } from "../core/routing";
import { ParsingMirrorUpdateRequest, useParsingMirrorCreate, useParsingMirrorDelete, useParsingMirrorGet, useParsingMirrorList, useParsingMirrorUpdate } from "../apiclient/api-parsing-mirror";

export function ParsingMirrorsScreen() {
    const [parsingMirrorsResponse, fetchParsingMirrors] = useParsingMirrorList()
    useEffect(() => { fetchParsingMirrors() }, [fetchParsingMirrors])

    const [parsingMirrorDeleteResponse, doDeleteParsingMirror] = useParsingMirrorDelete()

    return <div className="app-container">
        <ErrorTextWidget value={parsingMirrorsResponse} />
        <ErrorTextWidget value={parsingMirrorDeleteResponse} />
        <table>
            <thead>
                <tr>
                    <td>Название <Link className="app" to={ParsingMirrorEditLink()} >новое</Link></td>
                    <td>Описание</td>
                    <td>Значения</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {parsingMirrorsResponse.data?.mirrors?.map(labelPreset =>
                    <tr key={labelPreset.id}>
                        <td>{labelPreset.name}</td>
                        <td>{labelPreset.description}</td>
                        <td>{labelPreset.prefixes.join(", ")}</td>
                        <td>
                            <ContainerWidget direction="column" gap="smaller">
                                <Link className="app-button" to={ParsingMirrorEditLink(labelPreset.id)} >Редактировать</Link>
                                <button
                                    className="app"
                                    onClick={() => {
                                        doDeleteParsingMirror({ id: labelPreset.id })
                                            .then(() => fetchParsingMirrors())
                                    }}
                                    disabled={parsingMirrorDeleteResponse.isLoading}
                                >Удалить</button>
                            </ContainerWidget>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}

export function ParsingMirrorEditorScreen() {
    const params = useParams()
    const mirrorID = params.id ?? ""

    const [parsingMirrorCreateResponse, doCreateParsingMirror] = useParsingMirrorCreate()
    const [parsingMirrorUpdateResponse, doUpdateParsingMirror] = useParsingMirrorUpdate()
    const [parsingMirrorGetResponse, doGetParsingMirror] = useParsingMirrorGet()


    const [data, setData] = useState<ParsingMirrorUpdateRequest>({
        id: "",
        name: "",
        prefixes: [],
    })

    useEffect(() => {
        if (parsingMirrorGetResponse.data) {
            setData(parsingMirrorGetResponse.data!)
        }
    }, [parsingMirrorGetResponse.data])

    if (mirrorID) {
        useEffect(() => {
            doGetParsingMirror({ id: mirrorID })
        }, [doGetParsingMirror, mirrorID])
    }

    return <ContainerWidget appContainer direction="column" gap="small">
        <ErrorTextWidget value={parsingMirrorCreateResponse} />
        <ErrorTextWidget value={parsingMirrorUpdateResponse} />
        <ErrorTextWidget value={parsingMirrorGetResponse} />
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
            value={data.prefixes}
            onChange={e => {
                setData({ ...data, prefixes: e })
            }}
        />
        <button
            className="app"
            onClick={() => {
                if (mirrorID) {
                    doUpdateParsingMirror(data)
                } else {
                    doCreateParsingMirror(data) // TODO: сделать роутинг на редактирование
                }
            }}
        >Сохранить</button>
    </ContainerWidget>
}


export function StringArrayPickerWidget(props: {
    value?: Array<string>
    onChange: (v: Array<string>) => void
}) {
    return <ContainerWidget direction="column" gap="smaller">
        <div>
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
    </ContainerWidget >
}