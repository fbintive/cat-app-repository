const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${api.chrome()}), Node.js (v${api.node()}), and Electron (v${api.electron()})`

const func = async () => {
  const test = document.getElementById('comTest')
  const response = await window.api.ping()
  test.innerText = response
}

func()
