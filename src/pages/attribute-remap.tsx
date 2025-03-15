import { useEffect, useState } from "react"
import {
    AttributeColor,
    AttributeRemapCreateRequest,
    AttributeRemapDeleteRequest,
    AttributeRemapUpdateRequest,
    useAttributeColorList,
    useAttributeCount,
    useAttributeRemapCreate,
    useAttributeRemapDelete,
    useAttributeRemapList,
    useAttributeRemapUpdate,
} from "../apiclient/api-attribute"
import { ErrorTextWidget } from "../widgets/error-text"
import { attributeCodes, BookAttributeAutocompleteWidget, BookAttributeValueWidget } from "../widgets/attribute"
import { ColorizedTextWidget, ContainerWidget } from "../widgets/common"

export function AttributeRemapListScreen() {
    const [valueFilter, setValueFilter] = useState("")

    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    const [attributeRemapListResponse, fetchAttributeRemapList] = useAttributeRemapList()


    const [attributeRemapDeleteResponse, doAttributeRemapDelete] = useAttributeRemapDelete()
    const [attributeRemapCreateResponse, doAttributeRemapCreate] = useAttributeRemapCreate()
    const [attributeRemapUpdateResponse, doAttributeRemapUpdate] = useAttributeRemapUpdate()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])
    useEffect(() => { fetchAttributeRemapList() }, [fetchAttributeRemapList])

    const remappedAttributes = attributeRemapListResponse.data?.remaps?.filter(v => !v.is_delete && (valueFilter == "" || v.value.includes(valueFilter)))
    const droppedAttributes = attributeRemapListResponse.data?.remaps?.filter(v => v.is_delete && (valueFilter == "" || v.value.includes(valueFilter)))
    const newAttributes = attributeCountResponse.data?.attributes?.filter(v =>
        (valueFilter == "" || v.value.includes(valueFilter)) &&
        !attributeRemapListResponse.data?.remaps?.find((attr => attr.code == v.code && attr.value == v.value))
    )

    return <ContainerWidget direction="column" gap="big">
        <ContainerWidget appContainer direction="column" gap="medium">
            <ErrorTextWidget value={attributeColorListResponse} />
            <ErrorTextWidget value={attributeCountResponse} />
            <ErrorTextWidget value={attributeRemapListResponse} />
            <ErrorTextWidget value={attributeRemapDeleteResponse} />
            <ErrorTextWidget value={attributeRemapCreateResponse} />
            <ErrorTextWidget value={attributeRemapUpdateResponse} />

            <input
                className="app"
                value={valueFilter}
                onChange={e => setValueFilter(e.target.value)}
            />
        </ContainerWidget>

        {!remappedAttributes ? null :
            <ContainerWidget appContainer direction="column" gap="medium">
                <details className="app">
                    <summary>Ремапинг</summary>
                    <ContainerWidget direction="column" gap="medium">
                        {remappedAttributes.map(attr => <AttributeRemapEditorWidget
                            isNew={false}
                            value={attr}
                            colors={attributeColorListResponse.data?.colors}
                            key={attr.code + attr.value}

                            onCreate={(v: AttributeRemapCreateRequest) => {
                                doAttributeRemapCreate(v).then(() => fetchAttributeRemapList())
                            }}
                            onUpdate={(v: AttributeRemapUpdateRequest) => {
                                doAttributeRemapUpdate(v).then(() => fetchAttributeRemapList())

                            }}
                            onDelete={(v: AttributeRemapDeleteRequest) => {
                                doAttributeRemapDelete(v).then(() => fetchAttributeRemapList())

                            }}
                        />)}
                    </ContainerWidget>
                </details>
            </ContainerWidget>
        }

        {!droppedAttributes ? null :
            <ContainerWidget appContainer direction="column" gap="medium">
                <details className="app">
                    <summary>Удаление атрибутов</summary>
                    <ContainerWidget direction="column" gap="medium">
                        {droppedAttributes.map(attr => <AttributeRemapEditorWidget
                            isNew={false}
                            value={attr}
                            colors={attributeColorListResponse.data?.colors}
                            key={attr.code + attr.value}

                            onCreate={(v: AttributeRemapCreateRequest) => {
                                doAttributeRemapCreate(v).then(() => fetchAttributeRemapList())
                            }}
                            onUpdate={(v: AttributeRemapUpdateRequest) => {
                                doAttributeRemapUpdate(v).then(() => fetchAttributeRemapList())

                            }}
                            onDelete={(v: AttributeRemapDeleteRequest) => {
                                doAttributeRemapDelete(v).then(() => fetchAttributeRemapList())

                            }}
                        />)}
                    </ContainerWidget>
                </details>
            </ContainerWidget>
        }


        {!newAttributes ? null :
            <ContainerWidget appContainer direction="column" gap="medium">
                <details className="app">
                    <summary>Новые аттрибуты</summary>
                    <ContainerWidget direction="column" gap="medium">
                        {newAttributes.map(attr => <AttributeRemapEditorWidget
                            isNew={true}
                            value={attr}
                            colors={attributeColorListResponse.data?.colors}
                            key={attr.code + attr.value}

                            onCreate={(v: AttributeRemapCreateRequest) => {
                                doAttributeRemapCreate(v).then(() => fetchAttributeRemapList())
                            }}
                            onUpdate={(v: AttributeRemapUpdateRequest) => {
                                doAttributeRemapUpdate(v).then(() => fetchAttributeRemapList())

                            }}
                            onDelete={(v: AttributeRemapDeleteRequest) => {
                                doAttributeRemapDelete(v).then(() => fetchAttributeRemapList())

                            }}
                        />)}
                    </ContainerWidget>
                </details>
            </ContainerWidget>
        }

        <BookAttributeAutocompleteWidget attributeCount={attributeCountResponse.data?.attributes} />
    </ContainerWidget>
}



function AttributeRemapEditorWidget(props: {
    value: {
        code: string
        value: string
        to_code?: string
        to_value?: string
        is_delete?: boolean
    }
    isNew: boolean
    colors?: Array<AttributeColor>
    onCreate: (v: AttributeRemapCreateRequest) => void
    onUpdate: (v: AttributeRemapUpdateRequest) => void
    onDelete: (v: AttributeRemapDeleteRequest) => void
}) {
    const [remap, setRemap] = useState<{
        code: string
        value: string
        to_code?: string
        to_value?: string
        is_delete?: boolean
    }>({
        code: "tag",
        value: "",
    })

    useEffect(() => {
        setRemap(props.value)
    }, [props.value])


    return <ContainerWidget direction="row" gap="medium">
        <AttributeAutoColorWidget
            code={remap.code}
            value={remap.value}
            colors={props.colors}
        />
        <select
            className="app"
            value={remap.code}
            onChange={e => {
                setRemap({ ...remap, code: e.target.value })
            }}
        >
            {attributeCodes.map(code =>
                <option value={code} key={code}>{code}</option>
            )}
        </select>
        <input
            className="app"
            value={remap.value}
            onChange={e => setRemap({ ...remap, value: e.target.value })}
            list={"attribute-autocomplete-" + remap.code}
        />
        <label style={{ display: "flex" }}>
            <input
                className="app"
                type="checkbox"
                checked={remap?.is_delete ?? false}
                onChange={e => setRemap({ ...remap, is_delete: e.target.checked })}
            />
            <span>удалить</span>
        </label>
        {remap.is_delete ? null : <>
            <select
                className="app"
                value={remap.to_code}
                onChange={e => {
                    setRemap({ ...remap, to_code: e.target.value })
                }}
            >
                <option value="">Не выбрано</option>
                {attributeCodes.map(code =>
                    <option value={code} key={code}>{code}</option>
                )}
            </select>
            <input
                className="app"
                value={remap.to_value}
                onChange={e => setRemap({ ...remap, to_value: e.target.value })}
                list={"attribute-autocomplete-" + remap.to_code}
            />
            {remap.to_code && remap.to_value ?
                <AttributeAutoColorWidget
                    code={remap.to_code}
                    value={remap.to_value}
                    colors={props.colors}
                /> : null}
        </>}
        {props.isNew ?
            <button className="app" onClick={() => {
                props.onCreate(remap)
            }}>
                <ColorizedTextWidget color="good">Создать</ColorizedTextWidget>
            </button> :
            <>
                <button className="app" onClick={() => {
                    props.onUpdate(remap)
                }}>
                    <ColorizedTextWidget color="good">Сохранить</ColorizedTextWidget>
                </button>
                <button className="app" onClick={() => {
                    props.onDelete(remap)
                }}>
                    <ColorizedTextWidget color="danger">Удалить</ColorizedTextWidget>
                </button>
            </>
        }
    </ContainerWidget>
}


function AttributeAutoColorWidget(props: {
    code: string
    value: string
    colors?: Array<AttributeColor>
}) {
    const color = props.colors?.find(color => color.code == props.code && color.value == props.value)

    return <BookAttributeValueWidget
        code={props.code}
        value={props.value}
        color={color}
        key={props.value}
    />
}