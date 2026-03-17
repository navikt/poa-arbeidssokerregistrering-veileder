import { describe, expect, it } from 'vitest';
import { hentModiaHeaders } from './modia-headers';

describe('hentModiaHeaders', () => {
    it('should return correct headers with token and callId', () => {
        const token = 'test-token-123';
        const callId = 'call-id-456';

        const result = hentModiaHeaders(token, callId);

        expect(result).toEqual({
            'Nav-Consumer-Id': 'arbeidssokerregistrering-for-veileder',
            'Nav-Call-Id': callId,
            'x-trace-id': callId,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    });

    it('should set Authorization header with Bearer prefix', () => {
        const result = hentModiaHeaders('my-token', 'some-call-id');

        expect(result.Authorization).toBe('Bearer my-token');
    });

    it('should use the provided callId for both Nav-Call-Id and x-trace-id', () => {
        const callId = 'unique-trace-id';
        const result = hentModiaHeaders('token', callId);

        expect(result['Nav-Call-Id']).toBe(callId);
        expect(result['x-trace-id']).toBe(callId);
    });
});
