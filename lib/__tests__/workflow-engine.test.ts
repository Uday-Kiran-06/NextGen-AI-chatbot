import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runAgentWorkflow } from '../workflow-engine';

// Mock Gemini
const mockSendMessage = vi.fn();
vi.mock('@/lib/gemini', () => ({
    model: {
        startChat: vi.fn(() => ({
            sendMessage: mockSendMessage,
        })),
    },
}));

describe('runAgentWorkflow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return text response when no tool is called', async () => {
        mockSendMessage.mockResolvedValue({
            response: {
                text: () => 'Hello, world!',
            },
        });

        const result = await runAgentWorkflow([], 'Hi');

        expect(result.type).toBe('text');
        expect(result.content).toBe('Hello, world!');
    });

    it('should detect tool calls in JSON format', async () => {
        const toolCall = JSON.stringify({
            tool: 'calculate',
            args: { expression: '2 + 2' }
        });

        mockSendMessage.mockResolvedValue({
            response: {
                text: () => toolCall,
            },
        });

        const result = await runAgentWorkflow([], 'Calculate 2+2');

        expect(result.type).toBe('tool_call');
        expect(result.toolName).toBe('calculate');
        expect(result.toolArgs).toEqual({ expression: '2 + 2' });
    });

    it('should handle invalid JSON as plain text', async () => {
        const invalidJson = '{ tool: "broken" '; // Missing closing brace
        mockSendMessage.mockResolvedValue({
            response: {
                text: () => invalidJson,
            },
        });

        const result = await runAgentWorkflow([], 'Broken JSON');

        expect(result.type).toBe('text');
        expect(result.content).toBe(invalidJson);
    });
});
