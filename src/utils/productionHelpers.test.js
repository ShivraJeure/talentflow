
import { describe, expect, it } from "vitest";
import {
  normalizeApiError,
  safeArray,
  isValidId,
} from "./productionHelpers";

describe("normalizeApiError", () => {
  it("handles missing errors", () => {
    expect(normalizeApiError(null)).toBe(
      "Something went wrong. Please try again."
    );
  });

  it("handles network errors", () => {
    expect(
      normalizeApiError({ code: "ERR_NETWORK" })
    ).toBe(
      "Unable to connect to the server. Please check your connection."
    );
  });

  it("handles unauthorized responses", () => {
    expect(
      normalizeApiError({
        response: { status: 401 },
      })
    ).toBe(
      "Your session has expired. Please log in again."
    );
  });

  it("handles server errors", () => {
    expect(
      normalizeApiError({
        response: { status: 500 },
      })
    ).toBe(
      "The server is temporarily unavailable. Please try again later."
    );
  });

  it("uses a server-provided message for other errors", () => {
    expect(
      normalizeApiError({
        response: {
          status: 400,
          data: { message: "Invalid request" },
        },
      })
    ).toBe("Invalid request");
  });
});

describe("safeArray", () => {
  it("returns arrays unchanged", () => {
    const employees = [{ id: 1 }, { id: 2 }];

    expect(safeArray(employees)).toEqual(employees);
  });

  it("returns an empty array for invalid input", () => {
    expect(safeArray(null)).toEqual([]);
    expect(safeArray(undefined)).toEqual([]);
    expect(safeArray({})).toEqual([]);
  });
});

describe("isValidId", () => {
  it("accepts valid string and numeric IDs", () => {
    expect(isValidId("EMP-101")).toBe(true);
    expect(isValidId(101)).toBe(true);
  });

  it("rejects blank strings and invalid values", () => {
    expect(isValidId("   ")).toBe(false);
    expect(isValidId(null)).toBe(false);
    expect(isValidId(NaN)).toBe(false);
  });
});
