import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Aviso de nueva versión (modo prompt, arquitectura 6.2).
 * TODO(T-persistencia): antes de aplicar la versión hay que forzar un guardado de la partida.
 */
export function AvisoActualizacion() {
  const {
    needRefresh: [necesitaActualizar, setNecesitaActualizar],
    updateServiceWorker,
  } = useRegisterSW();

  if (!necesitaActualizar) {
    return null;
  }

  return (
    <div role="status" className="aviso">
      <p>Nueva versión disponible.</p>
      <button
        type="button"
        onClick={() => {
          void updateServiceWorker(true);
        }}
      >
        Actualizar
      </button>
      <button
        type="button"
        onClick={() => {
          setNecesitaActualizar(false);
        }}
      >
        Más tarde
      </button>
    </div>
  );
}
