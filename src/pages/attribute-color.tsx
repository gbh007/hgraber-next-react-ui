import { useCallback, useEffect, useState } from "react";
import { AttributeColor, useAttributeColorCreate, useAttributeColorDelete, useAttributeColorGet, useAttributeColorList, useAttributeColorUpdate, useAttributeCount } from "../apiclient/api-attribute";
import { AttributeColorEditorWidget, AttributeColorListWidget, BookAttributeAutocompleteWidget } from "../widgets/attribute";
import { ErrorTextWidget } from "../widgets/error-text";
import { useNavigate, useParams } from "react-router-dom";
import { AttributeColorEditLink } from "../core/routing";
import { ContainerWidget } from "../widgets/common";

export function AttributeColorListScreen() {
    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [attributeColorDeleteResponse, doAttributeColorDelete] = useAttributeColorDelete()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])

    return <div className="app-container">
        <ErrorTextWidget value={attributeColorListResponse} />
        <ErrorTextWidget value={attributeColorDeleteResponse} />
        <AttributeColorListWidget
            value={attributeColorListResponse.data?.colors}
            onDelete={(code: string, value: string) => {
                doAttributeColorDelete({
                    code: code,
                    value: value,
                }).then(() => {
                    fetchAttributeColorList()
                })
            }}
        />
    </div>
}

export function AttributeColorEditorScreen() {
    const params = useParams()
    const attributeCode = decodeURIComponent(params.code ?? "")
    const attributeValue = decodeURIComponent(params.value ?? "")


    const navigate = useNavigate();

    const [data, setData] = useState<AttributeColor>({
        code: attributeCode || "tag",
        value: attributeValue || "",
        text_color: "#000000", // TODO: подумать можно ли это вытащить из цветов темы, и должны ли быть отдельные цвета на темы
        background_color: "#dfdfdf", // TODO: подумать можно ли это вытащить из цветов темы, и должны ли быть отдельные цвета на темы
        created_at: new Date().toJSON(),
    })

    const [attributeColorGetResponse, fetchAttributeColorGet] = useAttributeColorGet()
    const [attributeColorCreateResponse, doAttributeColorCreate] = useAttributeColorCreate()
    const [attributeColorUpdateResponse, doAttributeColorUpdate] = useAttributeColorUpdate()
    const [attributeCountResponse, getAttributeCount] = useAttributeCount()

    useEffect(() => { getAttributeCount() }, [getAttributeCount])

    useEffect(() => {
        if (attributeColorGetResponse.data) {
            setData(attributeColorGetResponse.data!)
        }
    }, [attributeColorGetResponse.data])

    const isExists = attributeCode && attributeValue

    useEffect(() => {
        if (isExists) {
            fetchAttributeColorGet({
                code: attributeCode,
                value: attributeValue,
            })
        }
    }, [fetchAttributeColorGet, attributeCode, attributeValue, isExists])

    const useSave = useCallback(() => {
        if (isExists) {
            doAttributeColorUpdate(data)
        } else {
            doAttributeColorCreate(data).then(() => {
                navigate(AttributeColorEditLink(data.code, data.value))
            })
        }
    }, [doAttributeColorUpdate, doAttributeColorCreate, navigate, isExists, data])

    return <ContainerWidget appContainer direction="column" gap="big">
        <ErrorTextWidget value={attributeColorGetResponse} />
        <ErrorTextWidget value={attributeColorCreateResponse} />
        <ErrorTextWidget value={attributeColorUpdateResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <AttributeColorEditorWidget
            onChange={setData}
            value={data}
            isNew={!isExists}
        />
        <button
            className="app"
            onClick={useSave}
        >Сохранить</button>
        <BookAttributeAutocompleteWidget attributeCount={attributeCountResponse.data?.attributes} />
    </ContainerWidget>
}