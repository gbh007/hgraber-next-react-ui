import { BookDetailsSize } from "../../apiclient/model-book"
import { ColorizedTextWidget, ContainerWidget } from "../../widgets/common"

export function BookSizeWidget(props: {
    value?: BookDetailsSize
}) {
    if (!props.value) {
        return null
    }

    return <ContainerWidget direction="column">
        <b>Размер:</b>
        {props.value.unique_without_dead_hashes_count > 0 ?
            <ContainerWidget direction="row" gap="small">
                <span>уникальный (без мертвых хешей)</span>
                <ColorizedTextWidget bold color="good">
                    {props.value.unique_without_dead_hashes_formatted}
                </ColorizedTextWidget>
                <span>({props.value.unique_without_dead_hashes_count} шт)</span>
            </ContainerWidget>
            : null}
        {props.value.unique_without_dead_hashes_count != props.value.unique_count && props.value.unique_count > 0 ?
            <ContainerWidget direction="row" gap="small">
                <span>уникальный (с мертвыми хешами)</span>
                <ColorizedTextWidget bold>
                    {props.value.unique_formatted}
                </ColorizedTextWidget>
                <span>({props.value.unique_count} шт)</span>
            </ContainerWidget>
            : null}
        {props.value.shared_count > 0 ?
            <ContainerWidget direction="row" gap="small">
                <span>разделяемый</span>
                <ColorizedTextWidget bold>
                    {props.value.shared_formatted}
                </ColorizedTextWidget>
                <span>({props.value.shared_count} шт)</span>
            </ContainerWidget>
            : null}
        {props.value.dead_hashes_count > 0 ?
            <ContainerWidget direction="row" gap="small">
                <span>мертвые хеши</span>
                <ColorizedTextWidget bold color="danger">
                    {props.value.dead_hashes_formatted}
                </ColorizedTextWidget>
                <span>({props.value.dead_hashes_count} шт)</span>
            </ContainerWidget>
            : null}
        {props.value.inner_duplicate_count > 0 ?
            <ContainerWidget direction="row" gap="small">
                <span>количество внутренних дублей</span>
                <ColorizedTextWidget bold color="danger-lite">
                    {props.value.inner_duplicate_count}
                </ColorizedTextWidget>
            </ContainerWidget>
            : null}
        <span>общий <b>{props.value.total_formatted}</b> / {props.value.avg_page_size_formatted}</span>
    </ContainerWidget>
}