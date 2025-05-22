import Carousel from "react-bootstrap/Carousel";
import BarberImage1 from "../../../../assets/images/BarberImage1.jpg";
import BarberImage2 from "../../../../assets/images/BarberImage2.jpg";
import BarberImage3 from "../../../../assets/images/BarberImage3.jpg";
import BarberImage4 from "../../../../assets/images/BarberImage4.jpg";
import "./BarberCarousel.css";

function BarberCarousel() {
  return (
    <Carousel className="barber-carousel">
      <Carousel.Item interval={8500}>
        <img className="d-block w-100" src={BarberImage1} alt="First slide" />
        <Carousel.Caption>
          <h3 className="carousel-name-text">Lucas</h3>
          <p className="carousel-text">
            Lucas quería un corte con personalidad, algo distinto. Me dijo que
            le gustaba el estilo retro, así que optamos por un corte tipo 'bowl
            cut', con el flequillo recto y el contorno bien parejo. Le gustaba
            que fuera simétrico y llamativo, sin degradados ni transiciones.
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={8500}>
        <img className="d-block w-100" src={BarberImage2} alt="Second slide" />
        <Carousel.Caption>
          <h3 className="carousel-name-text">Sebastián</h3>
          <p className="carousel-text">
            Seba buscaba algo moderno y prolijo. Me pidió un corte que le
            sirviera tanto para el trabajo como para el día a día. Le hice un
            fade alto en los costados y la nuca, y dejé la parte superior corta
            pero con algo de textura, para que pueda peinarlo fácil y mantenerlo
            sin complicaciones
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={8500}>
        <img className="d-block w-100" src={BarberImage3} alt="Third slide" />
        <Carousel.Caption>
          <h3 className="carousel-name-text">Federico</h3>
          <p className="carousel-text">
            Fede tenía rulos muy definidos y me pidió que los respetara. No
            quería que se los alisara ni que le sacara mucho largo. Trabajé con
            tijera, modelando la forma para mantener el volumen bajo control y
            destacar su textura natural. Buscaba un look natural pero cuidado.
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={8500}>
        <img className="d-block w-100" src={BarberImage4} alt="Third slide" />
        <Carousel.Caption>
          <h3 className="carousel-name-text">Miguel</h3>
          <p className="carousel-text">
            Migue vino buscando un estilo más clásico y formal. Me dijo que
            quería algo sobrio, sin cortes extremos. Así que le dejé los
            laterales prolijos, sin rebajar demasiado, y la parte de arriba con
            el largo suficiente como para peinarlo hacia atrás con producto. Un
            estilo atemporal y elegante.”.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default BarberCarousel;
