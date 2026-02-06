function hentModiaHeaders(token: string, callId: string) {
	return {
		'Nav-Consumer-Id': 'arbeidssokerregistrering-for-veileder',
		'Nav-Call-Id': callId,
		'x-trace-id': callId,
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
}

export { hentModiaHeaders };
