import { Link } from 'react-router-dom'
import { AttributeColor } from '../../apiclient/api-attribute'
import { MassloadFlag, MassloadInfo } from '../../apiclient/api-massload'
import { MassloadEditorLink, MassloadViewLink } from '../../core/routing'
import { MassloadFlagViewWidget } from './flag'
import {
    ColorizedTextWidget,
    ContainerWidget,
} from '../../widgets/design-system'
import { BookOneAttributeWidget } from '../../widgets/attribute'

export function MassloadListWidget(props: {
    value: Array<MassloadInfo>
    colors?: Array<AttributeColor>
    onDelete: (id: number) => void
    flagInfos?: Array<MassloadFlag>
}) {
    return (
        <ContainerWidget
            appContainer
            gap='medium'
            direction='column'
        >
            <table style={{ borderSpacing: '20px' }}>
                <thead>
                    <tr>
                        <td>
                            <ContainerWidget
                                direction='row'
                                gap='small'
                            >
                                <span>ID</span>
                                <Link
                                    className='app-button'
                                    to={MassloadEditorLink()}
                                >
                                    Новая
                                </Link>
                            </ContainerWidget>
                        </td>
                        <td>Название</td>
                        <td>Описание</td>
                        <td>Флаги</td>
                        <td>Данные</td>
                        <td>Аттрибуты</td>
                        <td>Действия</td>
                    </tr>
                </thead>
                <tbody>
                    {props.value?.map((ml) => (
                        <tr key={ml.id}>
                            <td>{ml.id}</td>
                            <td>{ml.name}</td>
                            <td>
                                <pre className='app'>{ml.description}</pre>
                            </td>
                            <td>
                                <MassloadFlagViewWidget
                                    flags={ml.flags}
                                    flagInfos={props.flagInfos}
                                />
                            </td>
                            <td>
                                <ContainerWidget
                                    direction='column'
                                    gap='medium'
                                >
                                    <ContainerWidget
                                        direction='row'
                                        gap='small'
                                        wrap
                                    >
                                        <b>Размер:</b>
                                        {ml.page_size_formatted ? (
                                            <span>
                                                {ml.page_size_formatted}
                                            </span>
                                        ) : null}

                                        {ml.file_size_formatted &&
                                        ml.file_size_formatted !=
                                            ml.page_size_formatted ? (
                                            <span>
                                                ({ml.file_size_formatted})
                                            </span>
                                        ) : null}
                                    </ContainerWidget>
                                    <ContainerWidget
                                        direction='row'
                                        gap='small'
                                        wrap
                                    >
                                        <b>Количество:</b>
                                        {ml.page_count ? (
                                            <span>{ml.page_count}</span>
                                        ) : null}

                                        {ml.file_count &&
                                        ml.file_count != ml.page_count ? (
                                            <span>({ml.file_count})</span>
                                        ) : null}
                                    </ContainerWidget>
                                    <ContainerWidget
                                        direction='row'
                                        gap='small'
                                        wrap
                                    >
                                        <b>Книг:</b>
                                        {ml.books_in_system ? (
                                            <span>{ml.books_in_system}</span>
                                        ) : null}
                                    </ContainerWidget>
                                    <ContainerWidget
                                        direction='row'
                                        gap='small'
                                        wrap
                                    >
                                        <b>До / Новых / Скачано:</b>
                                        {ml.books_ahead ? (
                                            <span>{ml.books_ahead}</span>
                                        ) : null}
                                        <span>/</span>
                                        {ml.new_books ? (
                                            <span>{ml.new_books}</span>
                                        ) : null}
                                        <span>/</span>
                                        {ml.existing_books ? (
                                            <span>{ml.existing_books}</span>
                                        ) : null}
                                    </ContainerWidget>
                                </ContainerWidget>
                            </td>
                            <td>
                                <ContainerWidget
                                    direction='row'
                                    gap='smaller'
                                    wrap
                                >
                                    {ml.attributes?.map((attr, i) => (
                                        <BookOneAttributeWidget
                                            key={i}
                                            value={attr.value}
                                            colors={props.colors}
                                            code={attr.code}
                                        />
                                    ))}
                                </ContainerWidget>
                            </td>
                            <td>
                                <ContainerWidget
                                    direction='column'
                                    gap='small'
                                >
                                    <Link
                                        className='app-button'
                                        to={MassloadViewLink(ml.id)}
                                    >
                                        Посмотреть
                                    </Link>
                                    <Link
                                        className='app-button'
                                        to={MassloadEditorLink(ml.id)}
                                    >
                                        Редактировать
                                    </Link>
                                    <button
                                        className='app'
                                        onClick={() => {
                                            props.onDelete(ml.id)
                                        }}
                                    >
                                        <ColorizedTextWidget color='danger-lite'>
                                            Удалить
                                        </ColorizedTextWidget>
                                    </button>
                                </ContainerWidget>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ContainerWidget>
    )
}
