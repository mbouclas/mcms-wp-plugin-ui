import './app.css'
import TopBarApp from './TopBarApp.svelte'

const topBarApp = new TopBarApp({
    target: document.getElementById('mcms-top-bar-app')
})

export default topBarApp
