window.utils = {
  changeFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = (result) => {
        const base64Str = result.currentTarget.result
        resolve(base64Str)
      }
    })
  }
}