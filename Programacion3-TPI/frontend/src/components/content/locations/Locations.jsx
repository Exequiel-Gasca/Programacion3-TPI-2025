import { Col, Nav, Row, Tab } from "react-bootstrap";
import "./Locations.css";

const Locations = () => {
  return (
    <div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="0">
        <Row className="g-0">
          <Col sm={3}>
            <h1 className="d-flex flex-column align-items-center m-3">
              Sucursales
            </h1>
            <hr />

            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link className="branch" eventKey="1">
                  Sucursal Centro
                </Nav.Link>
              </Nav.Item>
              <hr />

              <Nav.Item>
                <Nav.Link className="branch" eventKey="2">
                  Sucursal Pichincha
                </Nav.Link>
              </Nav.Item>
              <hr />

              <Nav.Item>
                <Nav.Link className="branch" eventKey="3">
                  Sucursal Zona Sur
                </Nav.Link>
              </Nav.Item>
              <hr />
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="0">
                <div className="map-responsive">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Rosario&zoom=13&maptype=roadmap`}
                    allowFullScreen
                    loading="fast"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="1">
                <div className="map-responsive">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=San%20Martin%20547&zoom=17&maptype=roadmap`}
                    allowFullScreen
                    loading="fast"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="2">
                <div className="map-responsive">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Salta%202834&zoom=17&maptype=roadmap`}
                    allowFullScreen
                    loading="fast"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="3">
                <div className="map-responsive">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=San%20Martin%205418&zoom=17&maptype=roadmap`}
                    allowFullScreen
                    loading="fast"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Locations;
