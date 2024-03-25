'use client'
import { GetAuthStatus } from "@/app/AuthControllers/GetDataController";
import refreshStart from "../authClientServices/refresh";
import getGlobalUrl from "../service/getGlobalUrl";
import redirectUrl from "../service/redirect";

export default async function GetAuthStatusService() {

    let accessToken = localStorage.getItem('accessToken')
    let response = await GetAuthStatus(accessToken)
    if (!response[0]) {
        if (response[1] == 'NeedRefresh') {
            console.log('refreshInit')

            await refreshStart()
            accessToken = localStorage.getItem('accessToken')
            response = await GetAuthStatus(accessToken)
            return response
        } else if (response[1] == 'NeedAuth') {
            alert('нужна авторизация')
            // console.log('перекидываю на главную страницу')
            // let url = await getGlobalUrl()
            // redirectUrl(url)
            return [false, false]
        } else if (response[1] == 'IDs are not equal') {
            alert('несовпадение айди')
            // console.log('перекидываю на главную страницу')
            // let url = await getGlobalUrl()
            // redirectUrl(url)
            return [false, false]
        }
    } else {
        return response
    }
}