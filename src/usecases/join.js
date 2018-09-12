/*
Copyright 2018 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const assert = require('assert');

module.exports = async function join(session, roomName) {
    session.log.step(`joins room "${roomName}"`);
    //TODO: brittle selector
    const directoryButton = await session.waitAndQuery('.mx_RoleButton[aria-label="Room directory"]');
    await directoryButton.click();

    const roomInput = await session.waitAndQuery('.mx_DirectorySearchBox_input');
    await session.replaceInputText(roomInput, roomName);

    const firstRoomLabel = await session.waitAndQuery('.mx_RoomDirectory_table .mx_RoomDirectory_name:first-child', 1000);
    await firstRoomLabel.click();

    const joinLink = await session.waitAndQuery('.mx_RoomPreviewBar_join_text a');
    await joinLink.click();

    await session.waitAndQuery('.mx_MessageComposer');
    session.log.done();
}