import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollTo as it's not implemented in jsdom
window.scrollTo = vi.fn();
