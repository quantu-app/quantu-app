interface StringId {
    id: string
}


export function addOrUpdate<T extends StringId>(
    state: Array<T>,
    lessonBlock: T
): Array<T> {
    const index = state.findIndex((c) => c.id === lessonBlock.id);
    if (index === -1) {
        state.push(lessonBlock);
    } else {
        state[index] = lessonBlock;
    }
    return state;
}