export default {
  port: process.env.API_PORT ?? 3000,
  mysql: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    user: process.env.MYSQL_USER ?? 'tiffane',
    password: process.env.MYSQL_PASSWORD ?? 'notfound404',
    database: process.env.MYSQL_DATABASE ?? 'testAPI',
    port: process.env.MYSQL_PORT ?? 3306
  },
  salt: process.env.SALT ?? 10
}
