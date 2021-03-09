import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as passport from 'passport';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as _ from 'lodash';
import { RedisIoAdapter } from './config/adapters/redis.adapter';

const RedisStore = connectRedis(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  app.use(
    session({
      store: new RedisStore({
        client: redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        }),
      }),
      secret: process.env.APP_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.appName = process.env.APP_NAME;
    res.locals.appPrefix = process.env.APP_PREFIX;
    res.locals.appUrl = process.env.APP_URL + res.locals.appPrefix;

    if (req.session?.passport?.user) {
      const { user } = req.session.passport;
      res.locals.authUser = user;

      res.locals.authRoles = _(user.roles).map('name').value();
    }

    res.locals.originalUrl = req.path;
    res.locals.module = req.path.replace(/^\/([^\/]*).*$/, '$1');

    res.locals.baseUrl = (uri = '') => {
      const url = res.locals.appUrl;
      const isEmpty = (str) => {
        return !str || 0 === str.length;
      };

      const fullUrl = url + (isEmpty(uri) ? '' : '/' + uri);
      return fullUrl.replace(/([^:])(\/\/+)/g, '$1/');
    };

    next();
  });

  app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
