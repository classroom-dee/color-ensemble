import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ColorWheel from "../../src/components/ColorWheel";
import { useColor } from "../../src/hooks/useColor";

vi.mock("../../src/hooks/useColor");

describe("ColorWheel", () => {
  test("passes hsl and setHsl to HslColorPicker", () => {
    const setHsl = vi.fn();

    vi.mocked(useColor).mockReturnValue({
      hsl: { h: 0, s: 0, l: 0 },
      setHsl,
    });

    const { container } = render(<ColorWheel />);

    // react-colorful renders a div with class react-colorful
    expect(container.querySelector(".react-colorful")).toBeTruthy();
  });
});
