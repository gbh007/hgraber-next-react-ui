import { useEffect } from "react"
import { useSystemInfo } from "../apiclient/api-system-info"
import "./main.css"

export function MainScreen() {
    const [{ data, isError, errorText }, fetchData] = useSystemInfo()

    useEffect(() => { fetchData() }, [fetchData])

    return (
        <>
            {
                isError ?
                    <div className="app-error-container" >
                        {errorText}
                    </div>
                    :
                    <>
                        <div className="app-container" id="index-info">
                            <ul>
                                <li>Всего <b>{data?.count || 0}</b> тайтлов</li>
                                <li>
                                    Всего незагруженно
                                    <b> {data?.not_load_count || 0}</b> тайтлов
                                </li>
                                <li>Всего <b>{data?.page_count || 0}</b> страниц</li>
                                <li>
                                    Всего незагруженно
                                    <b> {data?.not_load_page_count || 0}</b> страниц
                                </li>
                                <li>
                                    Всего без тела (файла)
                                    <b> {data?.page_without_body_count || 0}</b> страниц
                                </li>
                                <li>
                                    Объем страниц:
                                    <b> {data?.pages_size_formatted || 0}</b>
                                </li>
                                <li>
                                    Объем файлов:
                                    <b> {data?.files_size_formatted || 0}</b>
                                </li>
                            </ul>
                        </div>

                        <div className="app-container" id="info-workers">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Название</td>
                                        <td>В очереди</td>
                                        <td>В работе</td>
                                        <td>Раннеров</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.monitor?.workers || []).map((worker) =>
                                        <tr key={worker.name}>
                                            <td>{worker.name}</td>
                                            <td>{worker.in_queue}</td>
                                            <td>{worker.in_work}</td>
                                            <td>{worker.runners}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
            }
        </>
    )
}