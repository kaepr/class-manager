import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { injectStyles, createStylesServer } from '@mantine/remix';

const ABORT_DELAY = 5000;

const server = createStylesServer(); 

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  let markup = renderToString(<RemixServer context={remixContext} url={request.url} />);
  responseHeaders.set('Content-Type', 'text/html');

  
  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });



//   return new Promise((resolve, reject) => {
//     let didError = false;

//     const { pipe, abort } = renderToPipeableStream(
//       <RemixServer context={remixContext} url={request.url} />,
//       {
//         [callbackName]: () => {
//           const body = new PassThrough();

//           responseHeaders.set("Content-Type", "text/html");

//           resolve(
//             new Response(body, {
//               headers: responseHeaders,
//               status: didError ? 500 : responseStatusCode,
//             })
//           );

//           pipe(body);
//         },
//         onShellError: (err: unknown) => {
//           reject(err);
//         },
//         onError: (error: unknown) => {
//           didError = true;

//           console.error(error);
//         },
//       }
//     );

//     setTimeout(abort, ABORT_DELAY);
//   });

}
