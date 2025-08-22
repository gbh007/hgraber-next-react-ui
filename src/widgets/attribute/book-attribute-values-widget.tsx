import { AttributeColor } from "../../apiclient/api-attribute"
import { BookAttributeValueWidget } from "./book-attribute"


export function BookAttributeValuesWidget(props: {
    code: string
    values: Array<string>
    colors?: Array<AttributeColor>
}) {
    const colors = props.colors?.filter(color => color.code == props.code)

    return <>
        {props.values.map(value => <BookAttributeValueWidget
            code={props.code}
            value={value}
            color={colors?.find(color => color.value == value)}
            key={value}
        />)}
    </>
}