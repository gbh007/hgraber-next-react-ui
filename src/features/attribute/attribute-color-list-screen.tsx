import { useEffect } from "react"
import { useAttributeColorDelete, useAttributeColorList } from "../../apiclient/api-attribute"
import { AttributeColorListWidget } from "../../widgets/attribute/attribute-color-list-widget"
import { ContainerWidget, ErrorTextWidget } from "../../widgets/design-system"

export function AttributeColorListScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [attributeColorDeleteResponse, doAttributeColorDelete] = useAttributeColorDelete()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])

    return <ContainerWidget appContainer>
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={attributeColorDeleteResponse} />
        <AttributeColorListWidget
            value={attributeColorListResponse.data?.colors}
            onDelete={(code: string, value: string) => {
                if (!confirm(`Удалить окраску аттрибута ${code}/${value}`)) {
                    return
                }

                doAttributeColorDelete({
                    code: code,
                    value: value,
                }).then(() => {
                    fetchAttributeColorList()
                })
            }}
        />
    </ContainerWidget>
}