/**
 * G1: Table must forward the host's full pagination config verbatim.
 *
 * The old code hardcoded {pageSize:10} whenever pagination was not false,
 * discarding the host's config. This file mocks antd's Table to capture the
 * forwarded prop directly, so the assertion is exact rather than DOM-based.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Table as AntTable } from "antd";

vi.mock("antd", () => ({ Table: vi.fn(() => null) }));

import { Table } from "../../../src/components/data/Table";

const mockedAntTable = AntTable as unknown as ReturnType<typeof vi.fn>;

afterEach(() => {
  mockedAntTable.mockClear();
});

describe("Table pagination passthrough (G1)", () => {
  it("forwards custom pagination config verbatim instead of hardcoding {pageSize:10}", () => {
    render(
      <Table
        id="tbl-g1"
        component="Table"
        properties={{
          columns: [{ title: "Name", dataIndex: "name" }],
          dataSource: [{ id: 1, name: "Alice" }],
          pagination: { pageSize: 20, showSizeChanger: true, current: 2 },
        }}
      />,
    );

    const passedProps = mockedAntTable.mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(passedProps.pagination).toEqual({
      pageSize: 20,
      showSizeChanger: true,
      current: 2,
    });
  });

  it("defaults to {pageSize:10} when pagination is omitted", () => {
    render(
      <Table
        id="tbl-g1b"
        component="Table"
        properties={{
          columns: [{ title: "Name", dataIndex: "name" }],
          dataSource: [{ id: 1, name: "Alice" }],
        }}
      />,
    );

    const passedProps = mockedAntTable.mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(passedProps.pagination).toEqual({ pageSize: 10 });
  });

  it("disables pagination when explicitly set to false", () => {
    render(
      <Table
        id="tbl-g1c"
        component="Table"
        properties={{
          columns: [{ title: "Name", dataIndex: "name" }],
          dataSource: [{ id: 1, name: "Alice" }],
          pagination: false,
        }}
      />,
    );

    const passedProps = mockedAntTable.mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(passedProps.pagination).toBe(false);
  });
});
