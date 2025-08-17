import { Link } from "react-router-dom";
import { MassloadFlag, MassloadInfo, MassloadInfoAttribute, MassloadInfoExternalLink, MassloadInfoListRequest, MassloadInfoListRequestAttribute } from "../apiclient/api-massload";
import { ColorizedTextWidget, ContainerWidget, DeleteButtonWidget, HumanTimeWidget, ManyStringSelectWidget } from "./common";
import { HProxyListLink, MassloadEditorLink, MassloadViewLink } from "../core/routing";
import { attributeCodes, BookAttributeAutocompleteList, BookAttributeAutocompleteWidget, BookOneAttributeWidget } from "./attribute";
import { AttributeColor, AttributeCountResponseAttribute } from "../apiclient/api-attribute";
import { useState } from "react";

export function MassloadListWidget(props: {
    value: Array<MassloadInfo>
    colors?: Array<AttributeColor>
    onDelete: (id: number) => void
    flagInfos?: Array<MassloadFlag>
}) {
    return <ContainerWidget appContainer gap="medium" direction="column">
        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>ID <Link className="app-button" to={MassloadEditorLink()} >Новая</Link></td>
                    <td>Название</td>
                    <td>Описание</td>
                    <td>Флаги</td>
                    <td>Размер</td>
                    <td>Аттрибуты</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map(ml => <tr key={ml.id}>
                    <td>{ml.id}</td>
                    <td>{ml.name}</td>
                    <td>{ml.description}</td>
                    <td><MassloadFlagViewWidget flags={ml.flags} flagInfos={props.flagInfos} /></td>
                    <td>
                        <ContainerWidget direction="row" gap="small" wrap>
                            {ml.page_size_formatted ? <>
                                <span>{ml.page_size_formatted}</span>
                            </> : null}

                            {ml.file_size_formatted && ml.file_size_formatted != ml.page_size_formatted ? <>
                                <span>({ml.file_size_formatted})</span>
                            </> : null}
                        </ContainerWidget>
                    </td>
                    <td>
                        <ContainerWidget direction="row" gap="smaller" wrap>
                            {ml.attributes?.map((attr, i) =>
                                <BookOneAttributeWidget key={i} value={attr.value} colors={props.colors} code={attr.code} />
                            )}
                        </ContainerWidget>
                    </td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <Link className="app-button" to={MassloadViewLink(ml.id)}>Посмотреть</Link>
                            <Link className="app-button" to={MassloadEditorLink(ml.id)}>Редактировать</Link>
                            <button className="app" onClick={() => {
                                props.onDelete(ml.id)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadInfoEditorWidget(props: {
    value: MassloadInfo
    onChange: (v: MassloadInfo) => void
    onSave: () => void
    onDelete: () => void
    flagInfos?: Array<MassloadFlag>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="row" gap="medium" wrap>
            <button className="app" onClick={props.onSave}>
                <ColorizedTextWidget color="good">Сохранить</ColorizedTextWidget>
            </button>
            <button className="app" onClick={props.onDelete}>
                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
            </button>
        </ContainerWidget>
        <ContainerWidget direction="2-column" gap="medium">
            <span>Название</span>
            <input
                className="app"
                value={props.value.name}
                onChange={e => props.onChange({ ...props.value, name: e.target.value })}
            />
            <span>Описание</span>
            <input
                className="app"
                value={props.value.description}
                onChange={e => props.onChange({ ...props.value, description: e.target.value })}
            />
            <span>Флаги</span>
            <MassloadFlagPickerWidget
                value={props.value.flags ?? []}
                onChange={e => props.onChange({ ...props.value, flags: e })}
                flagInfos={props.flagInfos ?? []}
            />
        </ContainerWidget>
    </ContainerWidget>
}

export function MassloadAttributeEditorWidget(props: {
    value?: Array<MassloadInfoAttribute>
    onCreate: (code: string, text: string) => void
    onDelete: (code: string, text: string) => void
    colors?: Array<AttributeColor>
}) {
    const [code, setCode] = useState("")
    const [value, setValue] = useState("")

    return <ContainerWidget appContainer gap="medium" direction="column">
        <ContainerWidget direction="row" gap="small">
            <select
                className="app"
                value={code}
                onChange={e => {
                    setCode(e.target.value)
                }}
            >
                <option value="" key="">Не выбрано</option>
                {attributeCodes.map(code =>
                    <option value={code} key={code}>{code}</option>
                )}
            </select>
            <input
                className="app"
                value={value}
                onChange={e => setValue(e.target.value)}
                list={BookAttributeAutocompleteList(code)}
            />
            <button className="app" onClick={() => {
                props.onCreate(code, value)
            }}>
                <ColorizedTextWidget color="good">Создать</ColorizedTextWidget>
            </button>
        </ContainerWidget>

        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Аттрибут</td>
                    <td>Создан</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map((attr, i) => <tr key={i}>
                    <td><BookOneAttributeWidget value={attr.value} colors={props.colors} code={attr.code} /></td>
                    <td><HumanTimeWidget value={attr.created_at} /></td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <button className="app" onClick={() => {
                                props.onDelete(attr.code, attr.value)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadExternalLinkEditorWidget(props: {
    value?: Array<MassloadInfoExternalLink>
    onCreate: (url: string) => void
    onDelete: (url: string) => void
}) {
    const [value, setValue] = useState("")

    return <ContainerWidget appContainer gap="medium" direction="column">
        <ContainerWidget direction="row" gap="small">
            <input
                className="app"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <button className="app" onClick={() => {
                props.onCreate(value)
            }}>
                <ColorizedTextWidget color="good">Создать</ColorizedTextWidget>
            </button>
        </ContainerWidget>

        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Значение</td>
                    <td>Создана</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map((link, i) => <tr key={i}>
                    <td>{link.url}</td>
                    <td><HumanTimeWidget value={link.created_at} /></td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <button className="app" onClick={() => {
                                props.onDelete(link.url)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadViewWidget(props: {
    value: MassloadInfo
    colors?: Array<AttributeColor>
    flagInfos?: Array<MassloadFlag>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="2-column" gap="medium">
            <b>Название</b>
            <span>{props.value.name}</span>

            <b>Описание</b>
            <span>{props.value.description}</span>

            {props.value.page_size_formatted ? <>
                <b>Размер страниц</b>
                <span>{props.value.page_size_formatted}</span>
            </> : null}

            {props.value.file_size_formatted ? <>
                <b>Размер файлов</b>
                <span>{props.value.file_size_formatted}</span>
            </> : null}

            <b>Флаги</b>
            <span><MassloadFlagViewWidget flags={props.value.flags} flagInfos={props.flagInfos} /></span>
        </ContainerWidget>

        <b>Аттрибуты</b>
        {props.value.attributes?.map((attr, i) =>
            <ContainerWidget key={i} direction="row" gap="small" style={{ alignItems: "center" }}>
                <BookOneAttributeWidget value={attr.value} colors={props.colors} code={attr.code} />
                {attr.page_size_formatted ? <>
                    <span>{attr.page_size_formatted}</span>
                </> : null}

                {attr.file_size_formatted && attr.file_size_formatted != attr.page_size_formatted ? <>
                    <span>({attr.file_size_formatted})</span>
                </> : null}
            </ContainerWidget>
        )}


        <b>Ссылки</b>
        {props.value.external_links?.map((link, i) =>
            <ContainerWidget key={i} direction="row" gap="smaller">
                <Link className="app-button" to={HProxyListLink(link.url)}>{link.url}</Link>
            </ContainerWidget>
        )}
    </ContainerWidget>
}

function MassloadFlagViewWidget(props: {
    flags?: Array<string>
    flagInfos?: Array<MassloadFlag>
}) {
    if (!props.flags) {
        return null
    }

    return <ContainerWidget direction="row" gap="small" wrap>
        {props.flags.map((flag, i) => <span key={i} style={{
            borderRadius: "3px",
            padding: "3px",
            border: "1px solid var(--app-color)"
        }}>
            {props.flagInfos?.find((v) => v.code == flag)?.name ?? flag}
        </span>)}
    </ContainerWidget>
}


function MassloadFlagPickerWidget(props: {
    value: Array<string>
    onChange: (v: Array<string>) => void
    flagInfos: Array<MassloadFlag>
}) {
    return <ContainerWidget direction="column" gap="small" wrap>
        {props.flagInfos.map((flag) => <label key={flag.code}>
            <input
                className="app"
                type="checkbox"
                checked={props.value.includes(flag.code)}
                onChange={e => props.onChange(e.target.checked ? [...props.value, flag.code] : props.value.filter(v => v != flag.code))}
            />
            <span>{flag.name || flag.code}</span>
        </label>)}
    </ContainerWidget>
}

export function MassloadFilterWidget(props: {
    value: MassloadInfoListRequest
    onChange: (v: MassloadInfoListRequest) => void
    attributeCount?: Array<AttributeCountResponseAttribute>
    flagInfos: Array<MassloadFlag>
}) {
    return <ContainerWidget direction="column" gap="medium">
        <ContainerWidget direction="row" gap="small">
            <span>Название</span>
            <input
                className="app"
                type="text"
                value={props.value.filter?.name ?? ""}
                onChange={e => {
                    props.onChange({ ...props.value, filter: { ...props.value.filter, name: e.target.value } })
                }}
            />
            {props.value.filter?.name ?
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange({ ...props.value, filter: { ...props.value.filter, name: "" } })
                    }}
                ></DeleteButtonWidget>
                : null}
        </ContainerWidget>
        <ContainerWidget direction="row" gap="small">
            <span>Внешняя ссылка</span>
            <input
                className="app"
                type="text"
                value={props.value.filter?.external_link ?? ""}
                onChange={e => {
                    props.onChange({ ...props.value, filter: { ...props.value.filter, external_link: e.target.value } })
                }}
            />
            {props.value.filter?.external_link ?
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange({ ...props.value, filter: { ...props.value.filter, external_link: "" } })
                    }}
                ></DeleteButtonWidget>
                : null}
        </ContainerWidget>


        <ContainerWidget direction="row" gap="small">
            <span>Флаги</span>
            <MassloadFlagPickerWidget
                flagInfos={props.flagInfos}
                onChange={e => {
                    props.onChange({ ...props.value, filter: { ...props.value.filter, flags: e } })
                }}
                value={props.value.filter?.flags ?? []}
            />
        </ContainerWidget>


        <FilterAttributesWidget
            value={props.value.filter?.attributes ?? []}
            onChange={e => {
                props.onChange({ ...props.value, filter: { ...props.value.filter, attributes: e } })
            }}
        />
        <BookAttributeAutocompleteWidget attributeCount={props.attributeCount} />

        <ContainerWidget direction="2-column" gap="small">
            <span>Сортировать по:</span>
            <select className="app" value={props.value.sort?.field ?? "created_at"} onChange={e => {
                props.onChange({ ...props.value, sort: { ...props.value.sort, field: e.target.value } })
            }}>
                <option value="name">Названию</option>
                <option value="id">ИД</option>
                <option value="page_size">Размеру страниц</option>
                <option value="file_size">Размеру файлов</option>
            </select>
        </ContainerWidget>
        <label>
            <span>Сортировать по убыванию</span>
            <input
                className="app"
                checked={props.value.sort?.desc ?? true}
                onChange={e => {
                    props.onChange({ ...props.value, sort: { ...props.value.sort, desc: e.target.checked } })
                }}
                placeholder="Сортировать по убыванию"
                type="checkbox"
                autoComplete="off"
            />
        </label>
    </ContainerWidget>
}

function FilterAttributesWidget(props: {
    value: Array<MassloadInfoListRequestAttribute>
    onChange: (v: Array<MassloadInfoListRequestAttribute>) => void
}) {
    return <ContainerWidget direction="column" gap="small">
        <div>
            <span>Аттрибуты</span>
            <button
                className="app"
                onClick={() => {
                    props.onChange([...props.value, {
                        code: "tag", // TODO: не прибивать гвоздями
                        type: "like", // TODO: не прибивать гвоздями
                        values: [],
                    }])
                }}
            >Добавить фильтр</button>
        </div>
        {props.value.map((v, i) =>
            <ContainerWidget key={i} direction="row" gap="medium">
                <FilterAttributeWidget
                    value={v}
                    onChange={e => {
                        props.onChange(props.value.map((ov, index) => index == i ? e : ov))
                    }}
                />
                <DeleteButtonWidget
                    onClick={() => {
                        props.onChange(props.value.filter((_, index) => index != i))
                    }}
                ></DeleteButtonWidget>
            </ContainerWidget>
        )}
    </ContainerWidget>
}

function FilterAttributeWidget(props: {
    value: MassloadInfoListRequestAttribute
    onChange: (v: MassloadInfoListRequestAttribute) => void
}) {
    return <ContainerWidget direction="row" gap="medium" wrap>
        <select
            className="app"
            value={props.value.code}
            onChange={e => {
                props.onChange({ ...props.value, code: e.target.value })
            }}
        >
            {attributeCodes.map(code =>
                <option value={code} key={code}>{code}</option>
            )}
        </select>
        <select
            className="app"
            value={props.value.type}
            onChange={e => {
                props.onChange({ ...props.value, type: e.target.value })
            }}
        >
            <option value="like">LIKE</option>
            <option value="in">IN</option>
        </select>
        <ManyStringSelectWidget
            value={props.value.values ?? []}
            onChange={e => {
                props.onChange({ ...props.value, values: e })
            }}
            autoCompleteID={BookAttributeAutocompleteList(props.value.code)}
        />
    </ContainerWidget>
}


