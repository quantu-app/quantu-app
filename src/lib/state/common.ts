interface ResourceStringId {
    id: string
}

interface ResourceTimestamps {
    releasedAt?: Date | string | null,
    createdAt: Date | string | null,
    updatedAt: Date | string | null
}

export function addOrUpdate<T extends ResourceStringId>(
    state: Array<T>,
    resource: T
): Array<T> {
    const index = state.findIndex((c) => c.id === resource.id);
    if (index === -1) {
        state.push(resource);
    } else {
        state[index] = resource;
    }
    return state;
}

export function resourceFromJSON<T extends ResourceStringId & ResourceTimestamps>(resource: T): T {
    if (resource.releasedAt) {
        return {
            ...resource,
            releasedAt: resource.releasedAt ? new Date(resource.releasedAt) : null,
            createdAt: resource.createdAt ? new Date(resource.createdAt) : null,
            updatedAt: resource.updatedAt ? new Date(resource.updatedAt) : null
        };
    } else {
        return {
            ...resource,
            createdAt: resource.createdAt ? new Date(resource.createdAt) : null,
            updatedAt: resource.updatedAt ? new Date(resource.updatedAt) : null
        };
    }
}