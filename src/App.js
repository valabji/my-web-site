import './App.css';
import Home from './pages/home';
import Layout from './layout';
import ErrorPage from './pages/error';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
  // Navigate,
  Routes,
  Route,
} from "react-router-dom";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

const brouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="*" element={<AnimationApp />} />
    </Route>

  )
);

function AnimationApp() {
  let location = useLocation();
  return <TransitionGroup style={{height:"100%"}}>
    <CSSTransition
      key={location.pathname}
      classNames="alert"
      timeout={3000}
    >
      <Routes location={location}>
        <Route path="skills" element={<Home />} />
        <Route path="about" element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </CSSTransition>
  </TransitionGroup>
}
function App() {
  return (
    <div className="App">
      <RouterProvider router={brouter} />
    </div>
  );
}

export default App;
