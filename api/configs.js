module.exports = {
    db: {
        host: `${process.env.DB_HOST}`,
        name: `${process.env.DB_NAME}`,
        username: `${process.env.DB_USERNAME}`,
        password: `${process.env.DB_PASSWORD}`,
    },
    jwt: {
        secret: `${process.env.JWT_SECRET}`,
    },
    clientSecret: `${process.env.CLIENT_SECRET}`,
}
