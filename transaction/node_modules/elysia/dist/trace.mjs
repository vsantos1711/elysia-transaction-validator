// src/trace.ts
var resolver = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return [promise, resolve];
};
var createSignal = () => {
  const [start, resolveStart] = resolver();
  const [end, resolveEnd] = resolver();
  const children = [];
  const resolvers = [];
  return {
    signal: start,
    consume: (trace) => {
      switch (trace.type) {
        case "begin":
          if (trace.unit && children.length === 0)
            for (let i = 0; i < trace.unit; i++) {
              const [start2, resolveStart2] = resolver();
              const [end2, resolveEnd2] = resolver();
              children.push(start2);
              resolvers.push([
                (trace2) => {
                  resolveStart2({
                    children: [],
                    end: end2,
                    name: trace2.name ?? "",
                    skip: false,
                    time: trace2.time
                  });
                },
                (time) => {
                  resolveEnd2(time);
                }
              ]);
            }
          resolveStart({
            children,
            end,
            name: trace.name ?? "",
            skip: false,
            time: trace.time
          });
          break;
        case "end":
          resolveEnd(trace.time);
          break;
      }
    },
    consumeChild(trace) {
      switch (trace.type) {
        case "begin":
          if (!resolvers[0])
            return;
          const [resolveStart2] = resolvers[0];
          resolveStart2({
            children: [],
            end,
            name: trace.name ?? "",
            skip: false,
            time: trace.time
          });
          break;
        case "end":
          const child = resolvers.shift();
          if (!child)
            return;
          child[1](trace.time);
      }
    },
    resolve() {
      resolveStart({
        children: [],
        end: new Promise((resolve) => resolve(0)),
        name: "",
        skip: true,
        time: 0
      });
      for (const [resolveStart2, resolveEnd2] of resolvers) {
        resolveStart2({
          children: [],
          end: new Promise((resolve) => resolve(0)),
          name: "",
          skip: true,
          time: 0
        });
        resolveEnd2(0);
      }
      resolveEnd(0);
    }
  };
};
var createTraceListener = (getReporter, totalListener, handler) => {
  return async function trace(trace) {
    if (trace.event !== "request" || trace.type !== "begin")
      return;
    const id = trace.id;
    const reporter = getReporter();
    const request = createSignal();
    const parse = createSignal();
    const transform = createSignal();
    const beforeHandle = createSignal();
    const handle = createSignal();
    const afterHandle = createSignal();
    const error = createSignal();
    const response = createSignal();
    request.consume(trace);
    const reducer = (event) => {
      if (event.id === id)
        switch (event.event) {
          case "request":
            request.consume(event);
            break;
          case "request.unit":
            request.consumeChild(event);
            break;
          case "parse":
            parse.consume(event);
            break;
          case "parse.unit":
            parse.consumeChild(event);
            break;
          case "transform":
            transform.consume(event);
            break;
          case "transform.unit":
            transform.consumeChild(event);
            break;
          case "beforeHandle":
            beforeHandle.consume(event);
            break;
          case "beforeHandle.unit":
            beforeHandle.consumeChild(event);
            break;
          case "handle":
            handle.consume(event);
            break;
          case "afterHandle":
            afterHandle.consume(event);
            break;
          case "afterHandle.unit":
            afterHandle.consumeChild(event);
            break;
          case "error":
            error.consume(event);
            break;
          case "error.unit":
            error.consumeChild(event);
            break;
          case "response":
            if (event.type === "begin") {
              request.resolve();
              parse.resolve();
              transform.resolve();
              beforeHandle.resolve();
              handle.resolve();
              afterHandle.resolve();
              error.resolve();
            } else
              reporter.off("event", reducer);
            response.consume(event);
            break;
          case "response.unit":
            response.consumeChild(event);
            break;
          case "exit":
            request.resolve();
            parse.resolve();
            transform.resolve();
            beforeHandle.resolve();
            handle.resolve();
            afterHandle.resolve();
            error.resolve();
            break;
        }
    };
    reporter.on("event", reducer);
    await handler({
      id,
      // @ts-ignore
      context: trace.ctx,
      // @ts-ignore
      set: trace.ctx?.set,
      // @ts-ignore
      store: trace.ctx?.store,
      time: trace.time,
      request: request.signal,
      parse: parse.signal,
      transform: transform.signal,
      beforeHandle: beforeHandle.signal,
      handle: handle.signal,
      afterHandle: afterHandle.signal,
      error: error.signal,
      response: response.signal
    });
    reporter.emit(`res${id}.${totalListener}`, void 0);
  };
};
export {
  createTraceListener
};
