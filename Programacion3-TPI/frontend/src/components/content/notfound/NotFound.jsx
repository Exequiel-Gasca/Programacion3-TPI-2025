import { Button } from "react-bootstrap";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found d-flex flex-column align-items-center justify-content-center text-center">
      <h1>404: Página no encontrada</h1>
      <Button className="turn-back" variant="link" href="/">
        Volver a la página de inicio
      </Button>
    </div>
  );
};

export default NotFound;
