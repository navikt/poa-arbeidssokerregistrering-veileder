export async function register() {
    if (process.env.ENABLE_MOCK === 'enabled' && process.env.NAIS_CLUSTER_NAME?.startsWith('prod-')) {
        throw new Error(
            `ENABLE_MOCK=enabled er ikke tillatt i produksjon (NAIS_CLUSTER_NAME=${process.env.NAIS_CLUSTER_NAME})`,
        );
    }
}
