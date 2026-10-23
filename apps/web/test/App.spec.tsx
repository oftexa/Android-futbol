import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("pantalla inicial", () => {
  it("muestra el título de versión de desarrollo", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Android Futbol 4 — versión de desarrollo" }),
    ).toBeTruthy();
  });

  it("lista las divisiones que llegan de @af4/contracts", () => {
    render(<App />);
    const lista = screen.getByRole("list");
    const elementos = within(lista).getAllByRole("listitem");
    expect(elementos.map((li) => li.textContent)).toEqual(["Primera división", "Segunda división"]);
  });
});
