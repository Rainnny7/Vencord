/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin, { OptionType } from "@utils/types";
import { Clipboard } from "@webpack/common";
import { messageContextMenuPatch } from "plugins/sharex/contextMenu";
import { Settings } from "Vencord";

export default definePlugin({
    name: "ShareX",
    description: "Allows you to upload your ShareX host directly from Discord",
    tags: ["ShareX", "CDN", "Media", "Video", "Picture"],

    // The authors of this plugin
    authors: [
        {
            id: 504147739131641857n,
            name: "Braydon (Rainnny)",
        },
    ],

    // The options for this plugin
    options: {
        uploadUrl: {
            type: OptionType.STRING,
            description: "The URL of your ShareX host",
            default: "https://cdn.example.com"
        },
        fileFormName: {
            type: OptionType.STRING,
            description: "The form name of the file to upload",
            default: "sharex",
        },
        secretFormName: {
            type: OptionType.STRING,
            description: "The form name of the upload secret",
            default: "secret",
        },
        uploadSecret: {
            type: OptionType.STRING,
            description: "The upload secret to use",
            default: "XXXXXXX"
        },
        showUrlAfterUpload: {
            type: OptionType.BOOLEAN,
            description: "Should the URL of the uploaded media be shown after uploading?",
            default: true,
        },
        uploadedMediaUrl: {
            type: OptionType.STRING,
            description: "The URL of uploaded media",
            default: "https://cdn.example.com/{json::url}",
        },
        supportedExtensions: {
            type: OptionType.STRING,
            description: "The supported extensions by your ShareX host",
            defaultt: "png,jpg,jpeg,gif,mp4,webm,webp,txt,log,zip,rar,exe,msi,apk"
        },
        corsProxy: {
            type: OptionType.STRING,
            description: "The cors proxy to use",
            default: "https://cors.rainnny.club"
        },
    },

    // The patches for this plugin
    patches: [],

    // The context menus for this plugin
    contextMenus: {
        "message": messageContextMenuPatch
    }
});

/**
 * Upload media to ShareX.
 *
 * @param mediaSrc the src of the media
 * @param extension the extension of the media
 * @returns the url of the uploaded media
 */
export async function upload(mediaSrc: string, extension: string): Promise<string> {
    const settings = Settings.plugins.ShareX; // The plugin settings
    console.log(`Uploading ${mediaSrc} with extension ${extension}`);

    // Fetch the buffer of the media
    const imageResponse: Response = await fetch(`${settings.corsProxy}/${mediaSrc}`);
    if (!imageResponse.ok) {
        throw new Error("Failed retrieving image data");
    }
    // Getting the array buffer of the image
    const arrayBuffer: ArrayBuffer = await imageResponse.arrayBuffer();
    const srcBuffer: Uint8Array = new Uint8Array(arrayBuffer);

    // Create the form data to upload
    const formData: FormData = new FormData();
    formData.append(settings.fileFormName, new Blob([srcBuffer]), `media.${extension}`);
    formData.append(settings.secretFormName, settings.uploadSecret);

    // Upload the image
    const uploadUrl: string = `${settings.corsProxy}/${settings.uploadUrl}`;
    console.log(`Uploading to ShareX host... ${uploadUrl}`);
    const response: Response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Failed uploading image ${response.statusText}`);
    }
    const json: any = await response.json(); // Get the json of the response
    if (json?.status === "ERROR") {
        throw new Error(json?.url);
    }

    // Parsing the uploaded url
    const uploadedUrl: string = settings.uploadedMediaUrl.replace(/\{json::(\w+)\}/g, (match: string, propertyName: string) => {
        return Object.prototype.hasOwnProperty.call(json, propertyName) ? json[propertyName] : match;
    });

    // Inform of upload & copy
    console.log(`Uploaded to ShareX: ${uploadedUrl}`);
    Clipboard.copy(uploadedUrl);
    return uploadedUrl;
}
