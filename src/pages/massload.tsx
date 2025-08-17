import { useCallback, useEffect, useState } from "react";
import { useAttributeColorList, useAttributeCount } from "../apiclient/api-attribute";
import { ContainerWidget } from "../widgets/common";
import { ErrorTextWidget } from "../widgets/error-text";
import { MassloadAttributeEditorWidget, MassloadExternalLinkEditorWidget, MassloadInfoEditorWidget, MassloadListWidget, MassloadViewWidget } from "../widgets/massload";
import { MassloadInfo, MassloadInfoListRequest, useMassloadAttributeCreate, useMassloadAttributeDelete, useMassloadExternalLinkCreate, useMassloadExternalLinkDelete, useMassloadFlagList, useMassloadInfoCreate, useMassloadInfoDelete, useMassloadInfoGet, useMassloadInfoList, useMassloadInfoUpdate } from "../apiclient/api-massload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MassloadListLink } from "../core/routing";
import { BookAttributeAutocompleteWidget } from "../widgets/attribute";

export function MassloadListScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()

    const [massloadListResponse, doMassloadList] = useMassloadInfoList()
    const [massLoadDeleteResponse, doMassloadDelete] = useMassloadInfoDelete()
    const [massloadFlagListResponse, fetchMassloadFlagList] = useMassloadFlagList()

    const [filter, setFilter] = useState<MassloadInfoListRequest>({})

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { doMassloadList(filter) }, [doMassloadList])
    useEffect(() => { fetchMassloadFlagList() }, [fetchMassloadFlagList])

    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={massloadListResponse} />
        <ErrorTextWidget value={massLoadDeleteResponse} />
        <ErrorTextWidget value={massloadFlagListResponse} />

        <MassloadListWidget
            value={massloadListResponse.data?.massloads ?? []}
            colors={attributeColorListResponse.data?.colors}
            onDelete={(id: number) => {
                if (!confirm(`Удалить массовую загрузку ${id}?`)) {
                    return
                }

                doMassloadDelete({ id: id }).then(() => doMassloadList(filter))
            }}
            flagInfos={massloadFlagListResponse.data?.flags}
        />
    </ContainerWidget>
}

export function MassloadEditorScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    const [massloadFlagListResponse, fetchMassloadFlagList] = useMassloadFlagList()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])
    useEffect(() => { fetchMassloadFlagList() }, [fetchMassloadFlagList])

    const params = useParams()
    const massloadID = params.id == "new" ? 0 : parseInt(params.id ?? "0")
    const isExists = massloadID > 0

    const navigate = useNavigate();

    const [data, setData] = useState<MassloadInfo>({
        id: 0,
        name: "",
        created_at: new Date().toJSON(),
    })

    const [massLoadCreateResponse, doMassloadCreate] = useMassloadInfoCreate()
    const [massLoadUpdateResponse, doMassloadUpdate] = useMassloadInfoUpdate()
    const [massLoadGetResponse, fetchMassloadGet] = useMassloadInfoGet()
    const [massLoadDeleteResponse, doMassloadDelete] = useMassloadInfoDelete()


    const [massLoadAttributeCreateResponse, doMassloadAttributeCreate] = useMassloadAttributeCreate()
    const [massLoadAttributeDeleteResponse, doMassloadAttributeDelete] = useMassloadAttributeDelete()

    const [massLoadExternalLinkCreateResponse, doMassloadExternalLinkCreate] = useMassloadExternalLinkCreate()
    const [massLoadExternalLinkDeleteResponse, doMassloadExternalLinkDelete] = useMassloadExternalLinkDelete()

    useEffect(() => {
        if (massLoadGetResponse.data) {
            setData(massLoadGetResponse.data!)
        }
    }, [massLoadGetResponse.data])


    useEffect(() => {
        if (isExists) {
            fetchMassloadGet({ id: massloadID })
        }
    }, [fetchMassloadGet, massloadID, isExists])

    const useSave = useCallback(() => {
        if (isExists) {
            doMassloadUpdate(data)
        } else {
            doMassloadCreate(data).then(() => {
                // FIXME: работает криво, нужно в промис докидывать данные ответа.
                // navigate(MassloadEditorLink(massLoadCreateResponse.data?.id))
                navigate(MassloadListLink())
            })
        }
    }, [doMassloadUpdate, doMassloadCreate, navigate, isExists, data])

    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={massLoadCreateResponse} />
        <ErrorTextWidget value={massLoadUpdateResponse} />
        <ErrorTextWidget value={massLoadGetResponse} />
        <ErrorTextWidget value={massLoadDeleteResponse} />
        <ErrorTextWidget value={massLoadAttributeCreateResponse} />
        <ErrorTextWidget value={massLoadAttributeDeleteResponse} />
        <ErrorTextWidget value={massLoadExternalLinkCreateResponse} />
        <ErrorTextWidget value={massLoadExternalLinkDeleteResponse} />
        <ErrorTextWidget value={massloadFlagListResponse} />

        <Link className="app-button" to={MassloadListLink()} >Список</Link>

        <MassloadInfoEditorWidget
            onChange={setData}
            onDelete={() => {
                if (!confirm(`Удалить массовую загрузку ${data.name} (${data.id})?`)) {
                    return
                }

                doMassloadDelete({ id: data.id }).then(() => navigate(MassloadListLink()))
            }}
            value={data}
            onSave={useSave}
            flagInfos={massloadFlagListResponse.data?.flags}
        />
        {isExists ? <>
            <MassloadAttributeEditorWidget
                value={data.attributes}
                onCreate={(code: string, value: string) => {
                    doMassloadAttributeCreate({
                        code: code,
                        massload_id: data.id,
                        value: value,
                    }).then(() => {
                        fetchMassloadGet({ id: massloadID })
                    })
                }}
                onDelete={(code: string, value: string) => {
                    doMassloadAttributeDelete({
                        code: code,
                        massload_id: data.id,
                        value: value,
                    }).then(() => {
                        fetchMassloadGet({ id: massloadID })
                    })
                }}
                colors={attributeColorListResponse.data?.colors}
            />
            <MassloadExternalLinkEditorWidget
                value={data.external_links}
                onCreate={(url: string) => {
                    doMassloadExternalLinkCreate({
                        url: url,
                        massload_id: data.id,
                    }).then(() => {
                        fetchMassloadGet({ id: massloadID })
                    })
                }}
                onDelete={(url: string) => {
                    doMassloadExternalLinkDelete({
                        url: url,
                        massload_id: data.id,
                    }).then(() => {
                        fetchMassloadGet({ id: massloadID })
                    })
                }}
            />
        </> : null}

        <BookAttributeAutocompleteWidget attributeCount={attributeCountResponse.data?.attributes} />
    </ContainerWidget>
}


export function MassloadViewScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [massloadFlagListResponse, fetchMassloadFlagList] = useMassloadFlagList()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { fetchMassloadFlagList() }, [fetchMassloadFlagList])

    const params = useParams()
    const massloadID = parseInt(params.id!)

    const [massLoadGetResponse, fetchMassloadGet] = useMassloadInfoGet()


    useEffect(() => {
        fetchMassloadGet({ id: massloadID })
    }, [fetchMassloadGet, massloadID])


    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={massLoadGetResponse} />
        <ErrorTextWidget value={massloadFlagListResponse} />

        <Link className="app-button" to={MassloadListLink()} >Список</Link>
        {massLoadGetResponse.data ?
            <MassloadViewWidget
                value={massLoadGetResponse.data}
                colors={attributeColorListResponse.data?.colors}
                flagInfos={massloadFlagListResponse.data?.flags}
            /> : null}
    </ContainerWidget>
}