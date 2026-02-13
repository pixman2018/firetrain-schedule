export function convertSnaps<T>(snapshot: any): T[] {
  return snapshot.docs.map((snap: any) => {
    return {
      id: snap.id,
      ...snap.data(),
    } as T;
  });
}

export function convertSnap<T>(snapshot: any): T | null {
  const payload = snapshot.data();
  return payload ? ({ ...payload, id: snapshot.id } as T) : null;
}
