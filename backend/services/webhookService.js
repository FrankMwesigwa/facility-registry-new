import axios from "axios";
import crypto from "crypto";

/**
 * WebhookService is responsible for pushing payload updates to registered systems.
 * It computes an HMAC SHA256 signature using each system's secret and sends it as
 * an HTTP header for verification on the receiver side.
 */
class WebhookService {
    /**
     * Push an event payload to a specific system.
     * @param {{url: string, api_key: string, secret: string}} system
     * @param {string} eventName
     * @param {object} payload
     */
    static async pushToSystem(system, eventName, payload) {
        const body = {
            event: eventName,
            timestamp: new Date().toISOString(),
            data: payload,
        };

        const serialized = JSON.stringify(body);
        const signature = crypto
            .createHmac("sha256", system.secret)
            .update(serialized)
            .digest("hex");

        const headers = {
            "Content-Type": "application/json",
            "X-API-KEY": system.api_key,
            "X-Signature": signature,
            "X-Signature-Alg": "HMAC-SHA256",
        };

        const url = system.url.endsWith("/") ? `${system.url}webhook` : `${system.url}/webhook`;
        return axios.post(url, body, { headers, timeout: 15000 });
    }

    /**
     * Broadcast an event to an array of active systems.
     * @param {Array<{url: string, api_key: string, secret: string, is_active: boolean}>} systems
     * @param {string} eventName
     * @param {object} payload
     * @returns {Promise<{success: number, failed: number, results: Array}>}
     */
    static async broadcast(systems, eventName, payload) {
        const activeSystems = (systems || []).filter(s => s && s.is_active);
        const results = await Promise.allSettled(
            activeSystems.map((s) => this.pushToSystem(s, eventName, payload))
        );
        const summary = {
            success: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length,
            results,
        };
        return summary;
    }
}

export default WebhookService;


