module.exports = {
    DIALECT: "mysql",
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    DB:
        process.env.NODE_ENV === "dev"
            ? process.env.DB_DEV
            : process.env.DB_TEST,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASS,
};
