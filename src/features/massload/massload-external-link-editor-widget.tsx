import { useState } from 'react'
import { MassloadInfoExternalLink } from '../../apiclient/api-massload'
import {
    ColorizedTextWidget,
    ContainerWidget,
    HumanTimeWidget,
} from '../../widgets/design-system'

export function MassloadExternalLinkEditorWidget(props: {
    value?: Array<MassloadInfoExternalLink>
    onCreate: (url: string) => void
    onDelete: (url: string) => void
}) {
    const [value, setValue] = useState('')

    return (
        <ContainerWidget
            appContainer
            gap='medium'
            direction='column'
        >
            <ContainerWidget
                direction='row'
                gap='small'
            >
                <input
                    className='app'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button
                    className='app'
                    onClick={() => {
                        props.onCreate(value)
                    }}
                >
                    <ColorizedTextWidget color='good'>
                        Создать
                    </ColorizedTextWidget>
                </button>
            </ContainerWidget>

            <table style={{ borderSpacing: '20px' }}>
                <thead>
                    <tr>
                        <td>Значение</td>
                        <td>Создана</td>
                        <td>Действия</td>
                    </tr>
                </thead>
                <tbody>
                    {props.value?.map((link, i) => (
                        <tr key={i}>
                            <td>{link.url}</td>
                            <td>
                                <HumanTimeWidget value={link.created_at} />
                            </td>
                            <td>
                                <ContainerWidget
                                    direction='column'
                                    gap='small'
                                >
                                    <button
                                        className='app'
                                        onClick={() => {
                                            props.onDelete(link.url)
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
