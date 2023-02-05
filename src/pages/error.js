// import { useRouteError } from "react-router-dom";

export default function Page() {
    // const error = useRouteError();
    return (
        <div className="container" style={{
            display:"flex",
            flexDirection:"column",
            height:"100%",
            justifyContent:"center",
            alignItems:"center"
        }} >
            <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* <i>{error.statusText || error.message}</i> */}
      </p>
        </div>
    )
}