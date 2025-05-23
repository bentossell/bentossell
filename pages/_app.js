import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <div className="topbar">
        <h1>claude code woz ere</h1>
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp