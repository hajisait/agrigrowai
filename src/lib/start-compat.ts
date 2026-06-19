type ServerLikeFn<TInput, TOutput> = (input: TInput) => Promise<TOutput> | TOutput;

export function useServerFn<TInput, TOutput>(fn: ServerLikeFn<TInput, TOutput>) {
  return (args: { data: TInput }) => Promise.resolve(fn(args.data));
}

export function createServerFn() {
  return {
    inputValidator(validator: (data: unknown) => unknown) {
      return {
        handler(handler: (ctx: { data: unknown }) => unknown) {
          return (data: unknown) => handler({ data: validator(data) });
        },
      };
    },
    handler(handler: (ctx: { data: unknown }) => unknown) {
      return (data?: unknown) => handler({ data });
    },
  };
}

export function createStart(config: unknown) {
  return config;
}

export function createMiddleware() {
  return {
    server: (fn: unknown) => fn,
    client: (fn: unknown) => fn,
  };
}