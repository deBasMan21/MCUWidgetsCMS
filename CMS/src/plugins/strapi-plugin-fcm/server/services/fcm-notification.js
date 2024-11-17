'use strict';

/**
 *  service.
 */

var fcmUtil = require('../../util/fcm');

const { propOr } = require('lodash/fp');

// const {
//     hasDraftAndPublish,
//     constants: { PUBLISHED_AT_ATTRIBUTE },
// } = require('@strapi/utils').contentTypes;

// const setPublishedAt = data => {
//     data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
// };

const uid = 'plugin::strapi-plugin-fcm.fcm-notification';
module.exports = ({ strapi }) => ({
    async find(params = {}) {

        // const fetchParams = getFetchParams(params);
        const data = await strapi.documents(uid).findMany({});

        return {
            data
        };
    },

    async findOne(entityId, params) {
        return strapi.documents(uid).findOne({
            documentId: entityId,
            ...params
        });
    },

    async delete(entityId, params = {}) {
        return strapi.documents(uid).delete({
            documentId: entityId,
            ...params
        });
    },

    async send(body) {
        return await fcmUtil.send(body.data);
    },

    async create(params = {}) {
        const model = strapi.contentTypes[uid];
        const setupEntry = async (entry) => {
            // if (hasDraftAndPublish(model)) {
            //     setPublishedAt(entry);
            // }
            // if (entry[PUBLISHED_AT_ATTRIBUTE]) {
            //     const fcmResponse = await fcmUtil.send(entry);
            //     entry.response = fcmResponse || {};
            // }
            entry.payload = entry.payload || {};
            return entry;
        };
        const { data } = params;
        if (Array.isArray(data)) {
            if (data.length > 0) {
                const entries = await Promise.all(data.map(d => setupEntry(d)));
                return strapi.db.query(uid).createMany({ data: entries });
            } else {
                throw Error('Data array is empty!');
            }
        } else {
            const entry = await setupEntry(data);
            return strapi.documents(uid).create({ data: entry });
        }
    },

    async update(entityId, params = {}) {
        const { data } = params;
        if (Object.keys(data.response || {}).length === 0) {
            const fcmResponse = await fcmUtil.send(data);
            data.response = fcmResponse || {};
        }
        data.payload = data.payload || {};
        return strapi.documents(uid).update({
            documentId: entityId,
            ...params,
            data
        });
    },

    count(params = {}) {
        return strapi.query(uid).count({ where: params });
    },
});
