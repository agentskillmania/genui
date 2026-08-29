/**
 * Unit tests for template binding expansion in SurfaceState.
 *
 * Covers: `{ path, componentId }` ChildList bindings, relative path inlining,
 * template subtrees, per-instance id remapping, re-expansion after data
 * updates, and visible error components for broken bindings.
 */

import { describe, it, expect, vi } from "vitest";
import { SurfaceEngine } from "../../../src/engine/SurfaceEngine";
import {
  GENUI_ERROR_COMPONENT,
} from "../../../src/engine/surfaceError";

/** Create a surface and push components/data in one step. */
function makeSurface(engine: SurfaceEngine, surfaceId = "s1") {
  engine.createSurface(surfaceId, "catalog-1", {});
  return engine.getSurface(surfaceId)!;
}

describe("SurfaceState – template binding expansion", () => {
  it("expands one child per data item with relative paths inlined", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "item_tpl" } }),
      JSON.stringify({ id: "item_tpl", component: "Text", text: { path: "name" } }),
    ]);
    surface.updateDataModel("/items", [{ name: "A" }, { name: "B" }, { name: "C" }]);

    const children = surface.getChildren("root");
    expect(children).toHaveLength(3);
    expect(children[0].id).toBe("root:0:item_tpl");
    expect(children[2].id).toBe("root:2:item_tpl");
    expect(children[0].text).toBe("A");
    expect(children[2].text).toBe("C");
    // Template binding resolved to a literal — no dangling path binding
    expect(children[0].component).toBe("Text");
  });

  it("resolves nested relative paths with '/' segments", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/data/items", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "labels/availableLiters" } }),
    ]);
    surface.updateDataModel("/data/items", [{ labels: { availableLiters: 42 } }]);

    const children = surface.getChildren("root");
    expect(children).toHaveLength(1);
    expect(children[0].text).toBe(42);
  });

  it("inlines array property bindings (options lists)", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/rows", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "ChoicePicker", options: { path: "candidates" } }),
    ]);
    surface.updateDataModel("/rows", [{ candidates: ["x", "y"] }]);

    const children = surface.getChildren("root");
    expect(children[0].options).toEqual(["x", "y"]);
  });

  it("expands template subtrees (template with its own children)", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "card_tpl" } }),
      JSON.stringify({ id: "card_tpl", component: "Card", children: ["tpl_title"], title: { path: "name" } }),
      JSON.stringify({ id: "tpl_title", component: "Text", text: { path: "desc" } }),
    ]);
    surface.updateDataModel("/items", [{ name: "n1", desc: "d1" }, { name: "n2", desc: "d2" }]);

    const children = surface.getChildren("root");
    expect(children).toHaveLength(2);

    const first = children[0];
    expect(first.id).toBe("root:0:card_tpl");
    expect(first.title).toBe("n1");
    expect(first.children).toEqual(["root:0:tpl_title"]);

    const firstChild = surface.getChildren(first.id);
    expect(firstChild).toHaveLength(1);
    expect(firstChild[0].id).toBe("root:0:tpl_title");
    expect(firstChild[0].text).toBe("d1");

    const secondChild = surface.getChildren(children[1].id);
    expect(secondChild[0].text).toBe("d2");
  });

  it("re-expands on every read so dataModel updates are picked up", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "name" } }),
    ]);
    surface.updateDataModel("/items", [{ name: "old" }]);
    expect(surface.getChildren("root")[0].text).toBe("old");

    surface.updateDataModel("/items", [{ name: "new" }, { name: "new2" }]);
    const children = surface.getChildren("root");
    expect(children).toHaveLength(2);
    expect(children[0].text).toBe("new");
  });

  it("returns an empty array for an empty data array (not an error)", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "name" } }),
    ]);
    surface.updateDataModel("/items", []);

    expect(surface.getChildren("root")).toEqual([]);
  });

  it("returns an error component when the binding path is missing from the dataModel", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/missing", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "name" } }),
    ]);

    const children = surface.getChildren("root");
    expect(children).toHaveLength(1);
    expect(children[0].component).toBe(GENUI_ERROR_COMPONENT);
    expect(children[0].message).toContain("/missing");
  });

  it("returns an error component when the bound value is not an array", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "name" } }),
    ]);
    surface.updateDataModel("/items", "not-an-array");

    const children = surface.getChildren("root");
    expect(children[0].component).toBe(GENUI_ERROR_COMPONENT);
    expect(children[0].message).toContain("not an array");
  });

  it("returns an error component when the template componentId is not registered", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "ghost_tpl" } }),
    ]);
    surface.updateDataModel("/items", [{ name: "A" }]);

    const children = surface.getChildren("root");
    expect(children[0].component).toBe(GENUI_ERROR_COMPONENT);
    expect(children[0].message).toContain("ghost_tpl");
  });

  it("leaves absolute path bindings untouched for render-time resolution", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "List", children: { path: "/items", componentId: "tpl" } }),
      JSON.stringify({ id: "tpl", component: "Text", text: { path: "/global/title" } }),
    ]);
    surface.updateDataModel("/items", [{ name: "A" }]);
    surface.updateDataModel("/global", { title: "Global" });

    const children = surface.getChildren("root");
    // Absolute binding survives expansion; resolveProperties resolves it
    expect(children[0].text).toEqual({ path: "/global/title" });
    expect(surface.resolveProperties(children[0].text)).toBe("Global");
  });
});

describe("SurfaceState – received-components tracking", () => {
  it("flags hasReceivedComponents only after a component payload", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);
    expect(surface.hasReceivedComponents()).toBe(false);

    surface.updateComponents([JSON.stringify({ id: "root", component: "Text" })]);
    expect(surface.hasReceivedComponents()).toBe(true);
  });

  it("lists component ids in insertion order", () => {
    const engine = new SurfaceEngine();
    const surface = makeSurface(engine);

    surface.updateComponents([
      JSON.stringify({ id: "root", component: "Column", children: ["a"] }),
      JSON.stringify({ id: "a", component: "Text" }),
    ]);
    expect(surface.getComponentIds()).toEqual(["root", "a"]);
  });
});

describe("SurfaceEngine – missing surface diagnostics", () => {
  it("logs a deduped console.error for updates to unknown surfaces", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const engine = new SurfaceEngine();

      engine.updateComponents("ghost", [JSON.stringify({ id: "root", component: "Text" })]);
      engine.updateComponents("ghost", [JSON.stringify({ id: "root", component: "Text" })]);
      engine.updateDataModel("ghost", "/x", 1);

      // One error for updateComponents (deduped across chunks) + one for updateDataModel
      expect(errorSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy.mock.calls[0][0]).toContain("createSurface");
    } finally {
      errorSpy.mockRestore();
    }
  });
});
