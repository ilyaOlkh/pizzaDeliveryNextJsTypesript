'use server'
import { settings } from '@/app/settings'
export default async function getGlobalUrl() {
    return settings.globalURL
}