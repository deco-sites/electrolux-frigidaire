import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { useScript } from "deco/hooks/useScript.ts";
import { Context } from "deco/deco.ts";

const serviceWorkerScript = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();

  return (
    <>
      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@view-transition { navigation: auto; }`,
          }}
        />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: Gotham;
              src: url(${asset("/fonts/gotham-book.woff")}) format('woff');
              font-weight: 300;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: Gotham;
              src: url(${asset("/fonts/gotham-bold.woff")}) format('woff');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }`,
          }}
        >
        </style>
      </Head>

      {/* Rest of Preact tree */}
      <ctx.Component />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(serviceWorkerScript) }}
      />
    </>
  );
});
