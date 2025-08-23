import { Link } from 'react-router-dom'
import { AttributeColor } from '../../apiclient/api-attribute'
import { BookShortInfo } from '../../apiclient/api-book-list'
import { BookDetailsLink } from '../../core/routing'
import { BookImagePreviewWidget } from '../../widgets/book/book-image-preview-widget'
import {
    ColorizedTextWidget,
    ContainerWidget,
} from '../../widgets/design-system'
import { BookAttributeValueWidget } from '../../widgets/attribute'

export function BookShortInfoWidget(props: {
    value: BookShortInfo
    colors?: Array<AttributeColor>
}) {
    const book = props.value

    return (
        <ContainerWidget appContainer>
            <ContainerWidget
                direction='row'
                gap='medium'
            >
                <Link to={BookDetailsLink(book.info.id)}>
                    <BookImagePreviewWidget
                        flags={book.info.flags}
                        preview_url={book.info.preview_url}
                        previewSize='small'
                    />
                </Link>
                <ContainerWidget direction='column'>
                    {book.info.flags.parsed_name ? (
                        <b>{book.info.name}</b>
                    ) : (
                        <ColorizedTextWidget
                            bold
                            color='danger'
                        >
                            НЕТ НАЗВАНИЯ
                        </ColorizedTextWidget>
                    )}
                    <ContainerWidget
                        direction='row'
                        gap='small'
                        wrap
                        style={{ justifyContent: 'space-between' }}
                    >
                        <ColorizedTextWidget
                            color={
                                book.info.flags.parsed_page
                                    ? undefined
                                    : 'danger'
                            }
                        >
                            Страниц: {book.info.page_count}
                        </ColorizedTextWidget>
                        <span>
                            {new Date(book.info.created_at).toLocaleString()}
                        </span>
                    </ContainerWidget>
                    <ContainerWidget
                        direction='row'
                        gap='smaller'
                        wrap
                    >
                        {book.color_attributes?.map((attr) => (
                            <BookAttributeValueWidget
                                key={attr.code + attr.value}
                                code={attr.code}
                                value={attr.value}
                                color={{
                                    text_color: attr.text_color,
                                    background_color: attr.background_color,
                                }}
                            />
                        ))}
                    </ContainerWidget>
                </ContainerWidget>
            </ContainerWidget>
        </ContainerWidget>
    )
}
