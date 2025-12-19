export class AdminException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AdminException';
    }
}

export class ForbiddenException extends AdminException {
    constructor(message: string = 'Access forbidden') {
        super(message);
        this.name = 'ForbiddenException';
    }
}

export class ContentNotFoundException extends AdminException {
    constructor(message: string = 'Content not found') {
        super(message);
        this.name = 'ContentNotFoundException';
    }
}

export class InvalidContentException extends AdminException {
    constructor(message: string = 'Invalid content data') {
        super(message);
        this.name = 'InvalidContentException';
    }
}