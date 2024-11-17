'use strict';

const { propOr } = require('lodash/fp');

const { getFetchParams } = require('@strapi/strapi');

const {
    hasDraftAndPublish,
    constants: { PUBLISHED_AT_ATTRIBUTE },
} = require('@strapi/utils').contentTypes;

const setPublishedAt = data => {
    data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};

/**
 *  service.
 */

const uid = 'plugin::strapi-plugin-fcm.fcm-topic';
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

        if (hasDraftAndPublish(contentType)) {
            setPublishedAt(data);
        }

        return strapi.documents(uid).create({ ...params, data });
    },

    async update(entityId, params = {}) {
        const { data } = params;

        return strapi.documents(uid).update({
            documentId: "__TODO__",
            ...params,
            data
        });
    },

    async delete(entityId, params = {}) {
        return;
    },

    count(params = {}) {
        return strapi.query(uid).count({ where: params });
    },
});
