export class OutfitNotFoundException extends Error {
    constructor(outfitId: string) {
        super(`Outfit with ID ${outfitId} not found`);
        this.name = 'OutfitNotFoundException';
    }
}

export class UnauthorizedOutfitAccessException extends Error {
    constructor(message: string = 'You do not have permission to access this outfit') {
        super(message);
        this.name = 'UnauthorizedOutfitAccessException';
    }
}

export class InvalidOutfitDataException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidOutfitDataException';
    }
}