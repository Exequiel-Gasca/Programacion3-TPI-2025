import "./Faq.css";
const Faq = () => {
  return (
    <div className="faq">
      <h2>Preguntas Frecuentes</h2>
      <div className="pregunta">
        <h3>¿Cómo puedo sacar turno?</h3>
        <p>
          Podés sacar turno a través de nuestro formulario online o
          comunicándote con nosotros por WhatsApp. Solo seleccioná el servicio,
          la fecha y el horario disponible.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Qué servicios ofrecen?</h3>
        <p>
          Ofrecemos cortes de cabello para mujeres, hombres y adolescentes,
          coloración, tratamientos capilares, alisados, peinados para eventos,
          barbería y más.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Cuáles son los medios de pago disponibles?</h3>
        <p>
          Aceptamos efectivo, tarjetas de débito y crédito, y pagos electrónicos
          como Mercado Pago.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Necesito sacar turno o atienden por orden de llegada?</h3>
        <p>
          Recomendamos siempre sacar turno para asegurarte disponibilidad.
          También atendemos por orden de llegada, pero está sujeto a la
          disponibilidad del momento.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Qué pasa si llego tarde a mi turno?</h3>
        <p>
          Si llegás con más de 10 minutos de retraso, es posible que debamos
          reprogramar tu cita para no afectar a otros clientes.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Tienen servicios especiales para eventos?</h3>
        <p>
          Sí, ofrecemos servicios de peinados, maquillaje y asesoramiento para
          casamientos, cumpleaños de 15 y otros eventos. Podés consultarnos para
          armar un paquete personalizado.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Utilizan productos veganos o cruelty-free?</h3>
        <p>
          Sí, trabajamos con marcas que no testean en animales y ofrecemos
          opciones veganas para varios de nuestros tratamientos.
        </p>
      </div>
      <div className="pregunta">
        <h3>¿Realizan diagnósticos capilares?</h3>
        <p>
          Sí, realizamos diagnósticos gratuitos para recomendarte el mejor
          tratamiento según tu tipo de cabello y necesidades.
        </p>
      </div>
    </div>
  );
};

export default Faq;
