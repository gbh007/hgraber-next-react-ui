import { useEffect, useState } from "react"
import { useUserLogin } from "../apiclient/api-user-login"
import { useAppSettings } from "../apiclient/settings"

import "./settings.css"

export function SettingsScreen() {
    const [{ isError, errorText }, login] = useUserLogin()

    const [appSettings, setSettings] = useAppSettings()

    const [token, setToken] = useState("")
    const [pageCount, setPageCount] = useState(appSettings.book_on_page)

    useEffect(() => {
        setPageCount(appSettings.book_on_page)
    }, [appSettings, setPageCount])

    return (
        <>
            <div className="app-container top-bar-settings">
                <table>
                    <tbody>
                        <tr>
                            <td className="head" colSpan={2}>Данные приложения</td>
                        </tr>
                        <tr>
                            <td>Количество на странице</td>
                            <td>
                                <input
                                    className="app"
                                    type="number"
                                    id="on-page"
                                    value={pageCount}
                                    onChange={e => setPageCount(parseInt(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="app" onClick={() => setSettings({ ...appSettings, book_on_page: pageCount })}>Сохранить</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div >

            <div className="app-container">
                {isError ? <div className="app-error-container">
                    {errorText}
                </div> : null}
                <input
                    className="app"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Токен"
                    id="token"
                    type="password"
                />
                <button className="app" onClick={() => {
                    login({ token }).then(() => setToken(""))
                }}>Авторизоваться</button>
            </div >
        </>
    )
}