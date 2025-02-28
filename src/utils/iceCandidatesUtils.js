export const addPendingIceCandidates = (
	pendingCandidatesRef,
	peerConnectionRef
) => {
	if (pendingCandidatesRef.current.length > 0) {
		pendingCandidatesRef.current.forEach((candidate) => {
			if (candidate) {
				peerConnectionRef.current?.addIceCandidate(
					new RTCIceCandidate(candidate)
				);
			}
		});

		pendingCandidatesRef.current = [];
	}
};
