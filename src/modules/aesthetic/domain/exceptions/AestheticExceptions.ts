export class AestheticNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Aesthetic not found: ${identifier}`);
        this.name = 'AestheticNotFoundException';
    }
}

export class AestheticAlreadyExistsException extends Error {
    constructor(name: string) {
        super(`Aesthetic with name "${name}" already exists`);
        this.name = 'AestheticAlreadyExistsException';
    }
}

export class InvalidQuizAnswersException extends Error {
    constructor(message: string = 'Invalid quiz answers provided') {
        super(message);
        this.name = 'InvalidQuizAnswersException';
    }
}

export class InvalidThemePropertiesException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidThemePropertiesException';
    }
}