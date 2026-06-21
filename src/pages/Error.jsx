export default function ErrorPage() {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  )
}
