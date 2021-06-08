(async _ => {
  const W = window || global
  const D = W.document
  const BU = W.BRAVE

  const getWebGLContext = _ => {
    const canvas = D ? new W.OffscreenCanvas(256, 256) : D.createElement('canvas')
    return canvas.getContext('webgl')
  }

  const makeAPICall = (apiName, ...args) => {
    switch (apiName) {
      case 'webgl-get-supported-extensions':
        return getWebGLContext().getSupportedExtensions()

      case 'webgl-get-extension': {
        const extensionName = args ?? args[0]
        const rs = getWebGLContext().getExtension(extensionName)
        return {
          toString: String(rs),
          content: rs
        }
      }

      default:
        throw new Error(`Unexpected api called from makeAPICall: ${apiName}`)
    }
  }

  const onMessage = (action, msg) => {
    switch (action) {
      case 'strict-mode::call': {
        const apiName = msg.api
        const apiARgs = msg.args ?? []
        const callResult = makeAPICall(apiName, ...apiARgs)
        return callResult
      }
    }
  }
  BU.receivePostMsg(onMessage)
})()
