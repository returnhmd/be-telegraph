module.exports = {
  errorCatcher(defaultStatusCode = 400) {
    return async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        if (e.status) ctx.status = e.status
        else ctx.status = defaultStatusCode
        ctx.body = { status: ctx.status, message: e.message }
      }
    }
  },
}
