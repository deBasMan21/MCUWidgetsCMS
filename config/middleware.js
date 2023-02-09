module.exports = ({ env }) => ({
    settings: {
        cache: {
            enabled: true,
            models: ["mcu-projects", "directors", "actors", "related-projects"]
        }
    }
});
