import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons";
import "./NavBar.css";

function NavBar({ token, isAdmin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // limpia el token en App
    navigate("/"); // redirige al home
  };

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
          <Nav className="ms-auto d-flex flex-row align-items-center gap-3">
            <Nav.Link as={Link} to="/servicios">
              Sobre Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/locations">
              Ubicaciones
            </Nav.Link>
            <Nav.Link as={Link} to="/servicios">
              Nuestros Servicios
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/crear-servicio">
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
                  <Person /> Mi Perfil
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Mensajes</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Configuración</Dropdown.Item>
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
/*                              <Button className="navbar-button" onClick={handleLogout}>
                  <Person /> Mi Perfil
                </Button>*/
