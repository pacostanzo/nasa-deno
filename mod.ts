import * as log from "https://deno.land/std/log/mod.ts";
import { Application, send } from "https://deno.land/x/oak@v5.0.0/mod.ts";
import api from './api.ts';

const app = new Application();

const PORT = 8000;

await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("INFO"),
    },
    loggers: {
      default: {
        level: "INFO",
        handlers: ["console"],
      },
    },
  });

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const stat = Date.now();
    await next();
    const delta = Date.now() - stat;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
    const filePath = ctx.request.url.pathname;
    const fileWhiteList = [
        "/index.html",
        "/javascripts/script.js",
        "/stylesheets/style.css",
        "/images/favicon.png"
    ];
    if (fileWhiteList.includes(filePath)) {
        await send(ctx, filePath, {
            root: `${Deno.cwd()}/public`,
        });
    }

});


if (import.meta.main) {
    log.info(`Starting server on port ${PORT}...`);
    await app.listen({
        port: PORT,
    });
}