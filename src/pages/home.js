export default function Page() {
  return (
    <div className="container" style={{ flex: 1, height: "100%" }}>
      <div className="row" style={{ height: "100%" }}>
        <div className="col-lg-6">
          <div className="error-template">
            <h2>My name is abdalrahman Valabji</h2>
            <div>
              <p>
                Indian🇮🇳-Sudanese🇸🇩 Software Developer with 7 years of professional experience.
                Experienced in mobile application development, web development, system development,
                and implementation including initial implementation, migrations, solving complex technical problems,
                and business requirement gatherings. Possess good leadership and communication skills.
                <br />
                <br />
                ✅ Soft Skills: Time management, Quick learner, Teamwork, Problem Solving,
                and Listening Skills :)
                <br />
                <br />
                My Current Tech Stack: <br />
                ✅ Front-End: JavaScript, React, React-Native, Expo, Redux, NextJS,
                HTML, CSS, SCSS, and TailwindCSS <br />
                ✅ Back-End: Node.js, Mongo, MySql, Ruby on Rails <br />
                ✅ User Interface Design: Figma / Adobe XD <br />
                ✅ Tools & Methods: Git, GitHub, GitLab, Heroku, AWS, Vercel,
                Chrome Dev Tools, Jest, React Testing Library, Jira, GitHub Kanban Board, Trello <br /> <br />
                👨‍💻 More in the skills section 👨‍💻 <br /> <br />
                I will be glad if you visit my: <br />
                🌐 Github Account: <a href="https://github.com/valabji" rel="noreferrer" target="_blank">https://github.com/valabji</a>
              </p>
            </div>
            <div className="error-actions">
              <a
                href="mailto:valabji@gmail.com"
                target="_blank"
                rel="noreferrer"
                STYLE="margin-top: 10px;"
                className="btn btn-info btn-lg"
              >
                <span className="lni lni-envelope"></span>
                <span STYLE="margin-left:10px">Email</span>
              </a>

              <a
                href="https://wa.me/249920166262"
                target="_blank"
                rel="noreferrer"
                STYLE="margin-top: 10px;"
                className="btn btn-info btn-lg"
              >
                <span className="lni lni-whatsapp"></span>
                <span STYLE="margin-left:10px">Whatsapp</span>
              </a>

              <a
                href="https://www.linkedin.com/in/valabji/"
                target="_blank"
                rel="noreferrer"
                STYLE="margin-top: 10px;"
                className="btn btn-info btn-lg"
              >
                <span className="lni lni-linkedin"></span>
                <span STYLE="margin-left:10px">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-6" style={{ height: "100%" }}>
          <img
            src="assets/imgs/me.jpeg"
            alt="me"
            style={{ objectFit: "contain", width: "100%", maxHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
