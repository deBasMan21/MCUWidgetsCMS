'use strict';

/**
 *  service.
 */

var fcmUtil = require('../../util/fcm');

const { propOr } = require('lodash/fp');

const { getFetchParams } = require('@strapi/strapi');

// const {
//     hasDraftAndPublish,
//     constants: { PUBLISHED_AT_ATTRIBUTE },
// } = require('@strapi/utils').contentTypes;

// const setPublishedAt = data => {
//     data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
// };

const uid = 'plugin::strapi-plugin-fcm.fcm-plugin-configuration';
module.exports = ({ strapi }) => ({
    async find(params = {}) {

        const fetchParams = getFetchParams(params);
        const data = await strapi.documents(uid).findMany({
            ...fetchParams
        });

        return {
            data
        };
    },

    async findOne(entityId, params) {
        return strapi.documents(uid).findOne(getFetchParams(params));
    },

    async create(params = {}) {
        const { data } = params;
        const count = strapi.query(uid).count();
        if (count < 1) {
            return await strapi.documents(uid).create({ ...params, data });
        } else if (data.id) {
            return await strapi.documents(uid).update({
                documentId: data.id,
                ...params,
                data
            });
        }
        return {
            error: 'Only one configuration is allowed, try passing the id to update the existing one.'
        };
    },

    async update(entityId, params = {}) {
        const { data } = params;
        const count = strapi.query(uid).count();
        if (count < 1) {
            return await strapi.documents(uid).create({ ...params, data });
        } else {
            return await strapi.documents(uid).update({
                documentId: entityId,
                ...params,
                data
            });
        }
    }
});
