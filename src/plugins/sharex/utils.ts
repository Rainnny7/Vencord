/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Toasts } from "@webpack/common";

/**
 * Get the extension of the
 * file at the given url.
 *
 * @param url the url of the file
 * @returns the file url
 */
export function getExtension(url: string): string | undefined {
    return url.split(/[#?]/)[0].split(".").pop()?.trim();
}

/**
 * Show a toast notification.
 *
 * @param type the type of the toast
 * @param message the message on the toast
 * @param duration the duration of the toast
 */
export function showToast(type: any, message: string, duration: number = 3000) {
    Toasts.show({
        id: Toasts.genId(),
        type,
        message,
        options: {
            duration: duration,
            position: Toasts.Position.BOTTOM
        }
    });
}
