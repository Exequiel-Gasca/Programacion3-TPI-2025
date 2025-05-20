import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ token, isAdmin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // limpia el token en App
    navigate("/login"); // redirige al login
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Peluquería TUP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/servicios">
              Servicios
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/crear-servicio">
                Crear Servicio
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto">
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registrarse
                </Nav.Link>
              </>
            ) : (
              <Button variant="outline-danger" onClick={handleLogout}>
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
