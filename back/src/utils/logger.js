export const logger = {
  error: (msg, ctx) =>
    console.error(
      JSON.stringify({ level: 'error', ts: new Date(), msg, ...ctx })
    ),
  warn: (msg, ctx) =>
    console.warn(
      JSON.stringify({ level: 'warn', ts: new Date(), msg, ...ctx })
    ),
  info: (msg, ctx) =>
    console.info(
      JSON.stringify({ level: 'info', ts: new Date(), msg, ...ctx })
    ),
};
