import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ token, isAdmin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // limpia el token en App
    navigate("/login"); // redirige al login
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex flex-row align-items-center gap-3">
            <Nav.Link as={Link} to="/servicios">
              Sobre Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/servicios">
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
              <Button className="navbar-button" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
