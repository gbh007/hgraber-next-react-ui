import { useCallback, useEffect, useState } from "react";
import { useAttributeColorList } from "../apiclient/api-attribute";
import { ContainerWidget } from "../widgets/common";
import { ErrorTextWidget } from "../widgets/error-text";
import { MassloadInfoEditorWidget, MassloadListWidget } from "../widgets/massload";
import { MassloadInfo, useMassloadInfoCreate, useMassloadInfoDelete, useMassloadInfoGet, useMassloadInfoList, useMassloadInfoUpdate } from "../apiclient/api-massload";
import { useNavigate, useParams } from "react-router-dom";
import { MassloadListLink } from "../core/routing";

export function MassloadListScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()

    const [massloadListResponse, fetchMassloadList] = useMassloadInfoList()
    const [massLoadDeleteResponse, doMassloadDelete] = useMassloadInfoDelete()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { fetchMassloadList() }, [fetchMassloadList])

    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={massloadListResponse} />
        <ErrorTextWidget value={massLoadDeleteResponse} />

        <MassloadListWidget
            value={massloadListResponse.data?.massloads ?? []}
            colors={attributeColorListResponse.data?.colors}
            onDelete={(id: number) => {
                if (!confirm(`Удалить массовую загрузку ${id}?`)) {
                    return
                }

                doMassloadDelete({ id: id }).then(() => fetchMassloadList())
            }}
        />
    </ContainerWidget>
}

export function MassloadEditorScreen() {
    const params = useParams()
    const massloadID = params.id == "new" ? 0 : parseInt(params.id ?? "0")
    const isExists = massloadID > 0

    const navigate = useNavigate();

    const [data, setData] = useState<MassloadInfo>({
        id: 0,
        name: "",
        created_at: new Date().toJSON(),
        is_deduplicated: false,
    })

    const [massLoadCreateResponse, doMassloadCreate] = useMassloadInfoCreate()
    const [massLoadUpdateResponse, doMassloadUpdate] = useMassloadInfoUpdate()
    const [massLoadGetResponse, fetchMassloadGet] = useMassloadInfoGet()
    const [massLoadDeleteResponse, doMassloadDelete] = useMassloadInfoDelete()


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
        <ErrorTextWidget value={massLoadCreateResponse} />
        <ErrorTextWidget value={massLoadUpdateResponse} />
        <ErrorTextWidget value={massLoadGetResponse} />
        <ErrorTextWidget value={massLoadDeleteResponse} />

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
        />
    </ContainerWidget>
}