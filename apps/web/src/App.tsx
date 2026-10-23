import { Division } from "@af4/contracts";
import { AvisoActualizacion } from "./actualizaciones/AvisoActualizacion";

// Solo presentación: los nombres vienen de @af4/contracts y ninguna cifra de juego se calcula aquí.
const ETIQUETAS: Record<Division, string> = {
  primera: "Primera división",
  segunda: "Segunda división",
};

export function App() {
  return (
    <main className="inicio">
      <h1>Android Futbol 4 — versión de desarrollo</h1>
      <p>Divisiones definidas en el núcleo:</p>
      <ul>
        {Division.options.map((division) => (
          <li key={division}>{ETIQUETAS[division]}</li>
        ))}
      </ul>
      <AvisoActualizacion />
    </main>
  );
}
