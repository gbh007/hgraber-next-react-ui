import { useEffect, useState } from "react"
import {
    AttributeColor,
    AttributeRemapCreateRequest,
    AttributeRemapDeleteRequest,
    AttributeRemapUpdateRequest,
    useAttributeColorList,
    useAttributeCount,
    useAttributeOriginCount,
    useAttributeRemapCreate,
    useAttributeRemapDelete,
    useAttributeRemapList,
    useAttributeRemapUpdate,
} from "../apiclient/api-attribute"
import { ErrorTextWidget } from "../widgets/error-text"
import { attributeCodes, BookAttributeAutocompleteList, BookAttributeAutocompleteWidget, BookAttributeValueWidget } from "../widgets/attribute"
import { ColorizedTextWidget, ContainerWidget } from "../widgets/common"

export function AttributeRemapListScreen() {
    const [valueFilter, setValueFilter] = useState("")
    const [codeFilter, setCodeFilter] = useState("")
    const [showLimit, setShowLimit] = useState(true)
    const [maxShowOnLimit, setMaxShowOnLimit] = useState(100)

    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    const [attributeOriginCountResponse, getAttributeOriginCount] = useAttributeOriginCount()
    const [attributeRemapListResponse, fetchAttributeRemapList] = useAttributeRemapList()


    const [attributeRemapDeleteResponse, doAttributeRemapDelete] = useAttributeRemapDelete()
    const [attributeRemapCreateResponse, doAttributeRemapCreate] = useAttributeRemapCreate()
    const [attributeRemapUpdateResponse, doAttributeRemapUpdate] = useAttributeRemapUpdate()

    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])
    useEffect(() => { getAttributeOriginCount() }, [getAttributeOriginCount])
    useEffect(() => { fetchAttributeRemapList() }, [fetchAttributeRemapList])

    const remappedAttributes = attributeRemapListResponse.data?.remaps?.
        filter(v => !v.is_delete && (
            valueFilter == "" ||
            v.value.toLowerCase().includes(valueFilter.toLowerCase()) ||
            v.to_value?.toLowerCase().includes(valueFilter.toLowerCase())
        ) && (
                codeFilter == "" ||
                v.code == codeFilter ||
                v.to_code == codeFilter
            )).
        filter((_, i) => !showLimit || i < maxShowOnLimit)
    const droppedAttributes = attributeRemapListResponse.data?.remaps?.
        filter(v => v.is_delete && (
            valueFilter == "" ||
            v.value.toLowerCase().includes(valueFilter.toLowerCase()) ||
            v.to_value?.toLowerCase().includes(valueFilter.toLowerCase())
        ) && (
                codeFilter == "" ||
                v.code == codeFilter ||
                v.to_code == codeFilter
            )).
        filter((_, i) => !showLimit || i < maxShowOnLimit)
    const newAttributes = attributeOriginCountResponse.data?.attributes?.
        filter(v =>
            (
                valueFilter == "" ||
                v.value.toLowerCase().includes(valueFilter.toLowerCase())
            ) && (
                codeFilter == "" ||
                v.code == codeFilter
            ) &&
            !attributeRemapListResponse.data?.remaps?.find((attr => attr.code == v.code && attr.value == v.value))
        ).
        filter((_, i) => !showLimit || i < maxShowOnLimit)

    return <ContainerWidget direction="column" gap="big">
        <ContainerWidget appContainer direction="column" gap="medium">
            <ErrorTextWidget value={attributeColorListResponse} />
            <ErrorTextWidget value={attributeCountResponse} />
            <ErrorTextWidget value={attributeOriginCountResponse} />
            <ErrorTextWidget value={attributeRemapListResponse} />
            <ErrorTextWidget value={attributeRemapDeleteResponse} />
            <ErrorTextWidget value={attributeRemapCreateResponse} />
            <ErrorTextWidget value={attributeRemapUpdateResponse} />

            <ContainerWidget direction="row" gap="medium" wrap>
                <input
                    placeholder="Фильтр по названию"
                    className="app"
                    value={valueFilter}
                    onChange={e => setValueFilter(e.target.value)}
                />


                <select
                    className="app"
                    value={codeFilter}
                    onChange={e => {
                        setCodeFilter(e.target.value)
                    }}
                >
                    <option value="">Не выбрано</option>
                    {attributeCodes.map(code =>
                        <option value={code} key={code}>{code}</option>
                    )}
                </select>

                <label style={{ display: "flex" }}>
                    <input
                        className="app"
                        type="checkbox"
                        checked={showLimit}
                        onChange={e => setShowLimit(e.target.checked)}
                    />
                    <span>Ограничить вывод {maxShowOnLimit} первых</span>
                </label>
                <input
                    className="app"
                    type="number"
                    value={maxShowOnLimit}
                    onChange={e => setMaxShowOnLimit(e.target.valueAsNumber)}
                />
            </ContainerWidget>
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
        <BookAttributeAutocompleteWidget attributeCount={attributeOriginCountResponse.data?.attributes} isOrigin={true} />
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
            list={BookAttributeAutocompleteList(remap.code, true)}
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
                list={BookAttributeAutocompleteList(remap.to_code ?? "")}
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