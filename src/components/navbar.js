import {Link} from 'react-router-dom';
export default function Component() {
    return <div  >
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
            <Link className="navbar-brand" to="/">Valabji</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="https://www.linkedin.com/in/valabji/details/skills/">Skills</a>
                    {/* <Link to={`skills`} className="nav-link">Skills</Link> */}
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="https://www.linkedin.com/in/valabji/details/experience/">Experience</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="https://www.linkedin.com/in/valabji/details/education/">Education</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="https://www.linkedin.com/in/valabji/details/projects/">Projects</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>
    </div>
}