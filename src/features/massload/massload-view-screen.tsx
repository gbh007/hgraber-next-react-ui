import { useEffect } from "react"
import { useAttributeColorList } from "../../apiclient/api-attribute"
import { useMassloadFlagList, useMassloadInfoGet } from "../../apiclient/api-massload"
import { Link, useParams } from "react-router-dom"
import { MassloadEditorLink, MassloadListLink } from "../../core/routing"
import { MassloadViewWidget } from "./massload-view-widget"
import { ContainerWidget, ErrorTextWidget } from "../../widgets/design-system"

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

        <ContainerWidget direction="row" gap="medium" wrap>
            <Link className="app-button" to={MassloadListLink()}>Список</Link>
            <Link className="app-button" to={MassloadEditorLink(massloadID)}>Редактировать</Link>
        </ContainerWidget>

        {massLoadGetResponse.data ?
            <MassloadViewWidget
                value={massLoadGetResponse.data}
                colors={attributeColorListResponse.data?.colors}
                flagInfos={massloadFlagListResponse.data?.flags}
            /> : null}
    </ContainerWidget>
}