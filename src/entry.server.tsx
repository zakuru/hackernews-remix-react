import { renderToString } from 'react-dom/server';
import { HandleDocumentRequestFunction, RemixServer } from 'remix';
import type { EntryContext } from 'remix';
import dotenv from 'dotenv';

const { JSDOM } = require('jsdom');
const dom = new JSDOM('null', {
  pretendToBeVisual: false,  url: "http://192.168.0.122/" 
});

dotenv.config();
dom.window.setTimeout = global.setTimeout;
Object.keys(dom.window).forEach((e: string) => {
  if((global as any)[e as any] === undefined){
    (global as any)[e] = dom.window[e]
  }
});

export const handleRequest: HandleDocumentRequestFunction = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) => {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
};

export default handleRequest;
