import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PersonFill } from "react-bootstrap-icons";
import "./NavBar.css";

function NavBar({ token, isAdmin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const location = useLocation();
  const aboutus = location.pathname === "/about-us";
  const locations = location.pathname === "/locations";
  const services = location.pathname === "/services";
  const createservice = location.pathname === "/create-service";
  const turns = location.pathname === "/turns";

  return (
    <Navbar expand="lg" className="barber-navbar bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src="../../../../public/barbershop.png"
            width={"65"}
            height={"65"}
            alt="logo"
          />
          <p className="store-name mb-0">BARBERSHOP</p>
        </Navbar.Brand>

        <Navbar.Toggle
          className="navbar-toggle"
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3">
            <Nav.Link
              as={Link}
              className={aboutus ? "underlined" : ""}
              to="/about-us"
            >
              Sobre Nosotros
            </Nav.Link>
            <Nav.Link
              as={Link}
              className={locations ? "underlined" : ""}
              to="/locations"
            >
              Ubicaciones
            </Nav.Link>
            <Nav.Link
              as={Link}
              className={services ? "underlined" : ""}
              to="/services"
            >
              Nuestros Servicios
            </Nav.Link>

            {token && (
              <Nav.Link
                as={Link}
                className={turns ? "underlined" : ""}
                to="/turns"
              >
                Turnos
              </Nav.Link>
            )}

            {isAdmin && (
              <Nav.Link
                as={Link}
                className={createservice ? "underlined" : ""}
                to="/create-service"
              >
                Crear Servicio
              </Nav.Link>
            )}

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button className="navbar-button" size="lg">
                    Ingresar
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <Dropdown>
                <Dropdown.Toggle className="navbar-button" id="dropdown-basic">
                  <PersonFill /> Mi Cuenta
                </Dropdown.Toggle>
                <Dropdown.Menu className="centered-menu">
                  <Dropdown.Item href="/settings" className="drop-menu">
                    Configuración
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="logout-button"
                    href="/"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
