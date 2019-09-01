import * as functions from 'firebase-functions';

const firebase_tools = require('firebase-tools');

export const recursiveDelete = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB'}).https.onCall((data, context) => {
        const path = data.path;

        return firebase_tools.firestore.delete(path, {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: functions.config().fb.token
        }).then(() => {
            return { path: path };
        });
});