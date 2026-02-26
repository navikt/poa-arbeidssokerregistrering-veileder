export function mapUtfoertAvType(type: string) {
    switch (type) {
        case 'SLUTTBRUKER':
            return 'bruker';
        case 'SYSTEM':
            return 'Nav';
        case 'VEILEDER':
            return 'veileder';
        default:
            return type;
    }
}
