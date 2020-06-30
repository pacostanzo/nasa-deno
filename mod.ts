import { Application } from "https://deno.land/x/oak@v5.0.0/mod.ts";

const app = new Application();

const PORT = 8000;

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const stat = Date.now();
    await next();
    const delta = Date.now() - stat;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});


app.use(async (ctx) => {
    ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__ 
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
});


if (import.meta.main) {
    await app.listen({
        port: PORT,
    });
}