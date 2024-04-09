/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    findGroupChildrenByChildId,
    NavContextMenuPatchCallback,
} from "@api/ContextMenu";
import { Menu, Toasts } from "@webpack/common";
import { upload } from "plugins/sharex";
import { Settings } from "Vencord";

import { getExtension, showToast } from "./utils";

function ShareXIcon() {
    return <img
        style={{ borderRadius: "50%" }}
        aria-hidden="true"
        width={16}
        height={16}
        src="https://getsharex.com/img/ShareX_Logo.png"
    />;
}

export const messageContextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    const { itemHref, itemSrc } = props;
    const settings = Settings.plugins.ShareX; // The plugin settings
    const mediaSrc: string | undefined = itemHref ?? itemSrc; // The src of the media
    if (!mediaSrc) {
        return;
    }
    const extension: string | undefined = getExtension(mediaSrc); // The extension of the media
    if (!extension || !settings.supportedExtensions.split(",").includes(extension)) {
        return;
    }
    const group = findGroupChildrenByChildId("copy-link", children);
    group?.push(<Menu.MenuItem
        id="sharex"
        label="Upload to ShareX"
        icon={ShareXIcon}
        action={async () => {
            showToast(Toasts.Type.MESSAGE, "Uploading...", 1000); // Inform the user that we're uploading
            try {
                const uploadedUrl: string = await upload(mediaSrc, extension); // Upload the media

                // Inform of the successful upload
                showToast(Toasts.Type.SUCCESS, `Uploaded, copied to clipboard!${settings.showUrlAfterUpload ? ` ${uploadedUrl}` : ""}`);
            } catch (err: any) {
                showToast(Toasts.Type.FAILURE, err.message);
                throw err;
            }
        }}
    />);
};
