import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatBox from "./ChatBox";
import '@testing-library/jest-dom';

// Mock AI hook
vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [],
    sendMessage: vi.fn(),
    stop: vi.fn(),
    status: "ready",
    error: undefined,
    setMessages: vi.fn(),
  }),
}));

describe("ChatBox Component (FE-09)", () => {
  // 1. Idle state test
  it("renders the input and send button in idle state", () => {
    render(<ChatBox />);
    const input = screen.getByPlaceholderText(/ask me about pedalboard effects/i);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(input).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  // 2. Validated form test (prevents empty submission)
  it("does not submit when the input is empty or just whitespace", () => {
    const handlePreset = vi.fn();
    render(<ChatBox onApplyPreset={handlePreset} />);
    
    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);
    
    expect(handlePreset).not.toHaveBeenCalled();
  });

  // 3. Error state/retry option test
  it("displays error state and retry option when forced", () => {
    render(<ChatBox forcedState="error" />);
    const errorBanner = screen.getByText(/connection or stream failed/i);
    const retryButton = screen.getByRole("button", { name: /retry last message/i });
    expect(errorBanner).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
  });

  // 4. Initial empty state message test
  it("shows the empty history prompt when no messages exist", () => {
    render(<ChatBox />);
    const emptyPrompt = screen.getByText(/no preset history yet/i);
    expect(emptyPrompt).toBeInTheDocument();
  });

  // 5. Valid form input submission test
  it("allows typing into the input field", () => {
    render(<ChatBox />);
    const input = screen.getByPlaceholderText(/ask me about pedalboard effects/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "Give me an indie rock preset" } });
    expect(input.value).toBe("Give me an indie rock preset");
  });

  // 6. Tool-result / Preset logic interaction test
  it("triggers preset application on relevant keyword submission", () => {
    const handlePreset = vi.fn();
    render(<ChatBox onApplyPreset={handlePreset} />);
    
    const input = screen.getByPlaceholderText(/ask me about pedalboard effects/i);
    const sendButton = screen.getByRole("button", { name: /send/i });
    
    fireEvent.change(input, { target: { value: "indie tone preset" } });
    fireEvent.click(sendButton);
    
    expect(handlePreset).toHaveBeenCalledWith({
      boostEngaged: true,
      filterEngaged: true,
      delayEngaged: true,
    });
  });
});